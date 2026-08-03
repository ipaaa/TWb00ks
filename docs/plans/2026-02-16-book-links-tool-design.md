# Book Links Collection & Review System - Design Document

**Date:** 2026-02-16
**Status:** Draft

## Overview

An automated system to collect and verify bookstore purchase links for books in the democracy book curation project. The system enriches existing books in a staging area (暫貼區) with links to multiple Taiwan bookstores, then merges approved links to the main database.

## Goals

1. Automate finding bookstore links for books using web search
2. Provide easy review workflows (CLI and spreadsheet-based)
3. Safely merge verified links without overwriting existing data
4. Support multiple bookstores with configurable search strategies

## Architecture

### Three-Component System

#### 1. Node.js CLI Tool (`scripts/book-links.js`)
- Reads/writes to Google Sheets via API
- Generates bookstore links using "I'm Feeling Lucky" search
- Interactive review session with browser integration
- Primary workflow for reviewers

#### 2. Google AppScript (`appscript/approve-links.gs`)
- Custom spreadsheet menu with approval buttons
- Spreadsheet-native review workflow
- Fine-grained (cell-level) and bulk (row-level) approval

#### 3. Shared Configuration (`scripts/bookstores.config.json`)
- Defines bookstore list with search patterns
- Configurable search engine (Google/DuckDuckGo)
- Easy to extend with new bookstores

### Design Decision: Dual Tools Approach

**Why not a single unified tool?**
- AppScript provides zero-setup spreadsheet integration
- Node.js provides powerful CLI automation and browser control
- Each tool optimized for its environment
- Small logic duplication worth the simplicity

## Components

### Node.js CLI Tool

#### Commands

**Primary: `npm run review-links`**
Interactive review session:
1. Scans 暫貼區 for books with missing links
2. For each book:
   - Generates all bookstore links (if not already done)
   - Prints title + all links to console
   - Opens all links in browser tabs
   - Prompts: "Are all links correct? (Y/N)"
   - If Y: Writes to 暫貼區 AND merges to main tab, proceeds to next
   - If N: Skips to next book
3. Shows summary (X approved, Y skipped)

**Optional: `npm run review-links --title="書名"`**
Review one specific book

**Optional: `npm run find-links`**
Batch generate links without review

#### Core Functions

```javascript
// Generate links for a book using "I'm Feeling Lucky"
findBookLinks(title, searchEngine) → { books: url, kingstone: url, ... }

// Interactive review loop
reviewSession() → summary stats

// Atomic operation: write to staging + merge to main
commitAndMerge(title, links) → { stagingSuccess, mainSuccess, error }

// Google Sheets API operations
readStagingArea() → [ { title, links, ... }, ... ]
writeStagingArea(row, links) → success/error
findBookInMainTab(title) → row number or null
mergeLinksToMainTab(row, links) → success/error
```

#### Link Generation Logic

For each bookstore:
1. Build "I'm Feeling Lucky" query: `site:{domain} {title}`
2. Execute search via Google or DuckDuckGo
3. Get first result URL
4. If no result found:
   - Fallback: Use bookstore's search page (if defined in config)
   - Otherwise: Mark as "NOT_FOUND"

### Google AppScript

#### Custom Menu

Adds "Book Links" menu with two buttons:

**1. "Approve Selected Cell"** - Granular approval
- Reviewer selects single cell (one bookstore link)
- Identifies: book title + which bookstore column
- Finds matching book in main tab
- Copies just that one link field
- Use case: Confident about one link, others need verification

**2. "Approve Selected Row"** - Bulk approval
- Reviewer selects one or more rows
- For each: finds matching book in main tab
- Copies all non-empty link fields
- Shows summary: "Approved 3 books, 2 not found"
- Use case: All links verified, ready to commit

#### Core Functions

```javascript
onOpen() // Add custom menu

approveSelectedCell() // Single link approval
approveSelectedRows() // Whole book approval

findBookInMainTab(title) // Search by title
mergeLinkCell(mainRow, stagingValue, column) // Copy one field
mergeBookLinks(mainRow, stagingLinks) // Copy all fields
```

### Configuration File

**`scripts/bookstores.config.json`**

```json
{
  "searchEngine": "google",
  "bookstores": [
    {
      "id": "books",
      "name": "博客來",
      "domain": "books.com.tw",
      "columnName": "博客來",
      "searchUrl": "https://search.books.com.tw/search/query/key/{title}"
    },
    {
      "id": "kingstone",
      "name": "金石堂",
      "domain": "kingstone.com.tw",
      "columnName": "金石堂",
      "searchUrl": "https://www.kingstone.com.tw/search/search?q={title}"
    },
    {
      "id": "eslite",
      "name": "誠品",
      "domain": "eslite.com",
      "columnName": "誠品",
      "searchUrl": "https://www.eslite.com/Search?q={title}"
    },
    {
      "id": "momo",
      "name": "momo",
      "domain": "momoshop.com.tw",
      "columnName": "momo",
      "searchUrl": null
    },
    {
      "id": "kobo",
      "name": "Kobo",
      "domain": "kobo.com",
      "columnName": "Kobo",
      "searchUrl": null
    },
    {
      "id": "readmoo",
      "name": "Readmoo",
      "domain": "readmoo.com",
      "columnName": "readmoo",
      "searchUrl": null
    },
    {
      "id": "taaze",
      "name": "讀冊",
      "domain": "taaze.tw",
      "columnName": "tazze",
      "searchUrl": null
    }
  ]
}
```

## Data Flow

### Workflow

```
1. [Manual] Add book titles to 暫貼區 tab
         ↓
2. [CLI] npm run review-links
         ↓
3. [Auto] Generate links for each bookstore
         ↓
4. [Auto] Open all links in browser
         ↓
5. [Human] Review links, press Y or N
         ↓
6. [Auto] If Y: Write to 暫貼區 + Merge to main tab
         ↓
7. [Existing] npm run sync pulls to codebase
```

Alternative path for spreadsheet users:
- Steps 1-3: Same
- Step 4-5: Review manually in spreadsheet
- Step 6: Click AppScript "Approve Selected Row" button

### Sheet Structure

**暫貼區 (Staging Area) Tab**
Columns:
- 書名 (Title)
- 博客來 (books.com.tw)
- 金石堂 (kingstone.com.tw)
- 誠品 (eslite.com)
- momo (momoshop.com.tw)
- Kobo
- readmoo
- tazze (讀冊)

**Main Books Tab**
- (Existing structure)
- Contains same link columns

## Critical Design Rules

### Rule 1: Never Overwrite Existing Links

When merging from 暫貼區 → main tab:
- **Only fill empty fields**: If main tab already has a link, keep it
- **Update "NOT_FOUND"**: Replace "NOT_FOUND" with new valid link
- **Preserve manual edits**: Human-curated links take precedence

**Merge logic:**
```javascript
for each bookstore column:
  mainValue = mainTab[bookTitle][bookstore]
  stagingValue = stagingTab[bookTitle][bookstore]

  if (mainValue is empty OR mainValue === "NOT_FOUND"):
    if (stagingValue is not empty):
      mainTab[bookTitle][bookstore] = stagingValue
  // else: keep existing mainValue, don't overwrite
```

**Applies to:**
- CLI: `npm run review-links` (Y approval)
- AppScript: "Approve Selected Cell"
- AppScript: "Approve Selected Row"

### Rule 2: Validate Book Exists Before Merging

Before any merge operation:
1. Search for book in main tab by exact title match
2. **If found**: Proceed with merge (applying Rule 1)
3. **If not found**:
   - CLI: Show error: `"❌ Book '{title}' not found in main tab, skipping merge. Links saved to 暫貼區."`
   - AppScript: Show alert: `"Book not found in main tab: {title}"`
   - Do NOT write to main tab
   - CLI: Still saves to 暫貼區 (preserves work)

**Rationale**: 暫貼區 enriches *existing* books only. New books need full metadata (author, category, description), not just links.

**Applies to:**
- CLI: All merge operations
- AppScript: Both approval buttons

## Error Handling

### Search Failures
- **"I'm Feeling Lucky" fails**: Fallback to bookstore search page URL
- **No search page defined**: Mark as "NOT_FOUND"
- **Network timeout**: Retry with exponential backoff (3 attempts)

### Sheet Errors
- **Book not found in main tab**: Error message (see Rule 2)
- **Invalid sheet structure**: Clear error with expected columns
- **API rate limits**: Batch operations with delays
- **Concurrent edits**: Detect conflicts, warn user

### CLI Errors
- **Google Sheets API auth failure**: Clear setup instructions
- **Browser launch failure**: Fallback to showing URLs in console
- **Keyboard interrupt (Ctrl+C)**: Save progress, exit gracefully

### AppScript Errors
- **Execution timeout (6 min)**: Process in smaller batches
- **No selection**: Show helpful message
- **Invalid selection**: Validate cell/row is in 暫貼區

## Testing Strategy

### Manual Testing
- Test with real spreadsheet (暫貼區 + main tabs)
- Verify all bookstores generate correct links
- Test approval workflows (CLI Y/N, AppScript buttons)
- Verify rules: no overwrites, validate book exists

### Test Cases
1. **Empty links**: Book with no links → all fields filled
2. **Partial links**: Book with some links → only fill empty ones
3. **No match in main tab**: Error shown, no merge
4. **"NOT_FOUND" in main tab**: Replaced with new link
5. **All bookstores**: Verify each bookstore config works
6. **Search fallback**: When "Feeling Lucky" fails → search page URL
7. **Edge cases**: Special characters in titles, long titles

### Search Engine Testing
- Test both Google and DuckDuckGo search
- Verify switching between engines via config
- Check fallback logic works

## Configuration & Extensibility

### Adding New Bookstores
1. Add entry to `scripts/bookstores.config.json`:
   ```json
   {
     "id": "newstore",
     "name": "New Store",
     "domain": "newstore.com.tw",
     "columnName": "New Store",
     "searchUrl": "https://newstore.com.tw/search?q={title}"
   }
   ```
2. Add column "New Store" to 暫貼區 and main tabs
3. Run `npm run review-links` - automatically includes new store

### Switching Search Engines
Edit `searchEngine` in config:
```json
{ "searchEngine": "duckduckgo" }
```

Options: `"google"`, `"duckduckgo"`

## Implementation Phases

See separate implementation plan document.

## Future Enhancements

- [ ] Auto-retry failed links periodically
- [ ] Link validation (check if URLs still work)
- [ ] Confidence scoring for auto-generated links
- [ ] Batch import from ISBN list
- [ ] Export staging area as CSV for offline review

## Appendices

### Google Sheets API Setup
1. Enable Google Sheets API in Google Cloud Console
2. Create service account credentials
3. Save credentials to `scripts/.credentials.json`
4. Share spreadsheet with service account email

### AppScript Deployment
1. Open Google Sheet → Extensions → Apps Script
2. Copy `appscript/approve-links.gs` content
3. Save and refresh spreadsheet
4. "Book Links" menu appears

### Column Name Mapping

| Chinese | English Variable | Bookstore |
|---------|-----------------|-----------|
| 博客來 | books | books.com.tw |
| 金石堂 | kingstone | kingstone.com.tw |
| 誠品 | eslite | eslite.com |
| momo | momo | momoshop.com.tw |
| Kobo | kobo | kobo.com |
| readmoo | readmoo | readmoo.com |
| tazze | taaze | taaze.tw |
