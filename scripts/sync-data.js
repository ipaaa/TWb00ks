import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHEET_ID = '1Z0JUS0fw5SFaX1-oht6jEx5i8XI888vx5F9jm9BEggI';
const ADULT_SHEET_GID = '0';
const CHILDREN_SHEET_GID = '1880693572';
const DOC_SHEET_GID = '2093490158';

const ADULT_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${ADULT_SHEET_GID}`;
const CHILDREN_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${CHILDREN_SHEET_GID}`;
const DOC_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${DOC_SHEET_GID}`;

const CACHE_PATH = path.join(__dirname, 'cover_cache.json');

function _loadCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading cache:', err);
  }
  return {};
}

function _saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch (err) {
    console.error('Error saving cache:', err);
  }
}

// 輔助函式：從博客來網址提取封面圖
function getCoverFromUrl(url) {
  if (!url || !url.includes('products/')) return null;
  const match = url.match(/products\/(\d+)/);
  if (!match) return null;
  const id = match[1];
  const p1 = id.substring(0, 3);
  const p2 = id.substring(3, 6);
  const p3 = id.substring(6, 8);
  return `https://www.books.com.tw/img/${p1}/${p2}/${p3}/${id}.jpg`;
}

// 輔助函式：產生搜尋連結
const getNlpiLink = (title) =>
  `https://ebook.nlpi.edu.tw/search?search_field=TI&search_input=${encodeURIComponent(title)}`;
const getEsliteSearch = (title) => `https://www.eslite.com/Search?q=${encodeURIComponent(title)}`;
const getKingstoneSearch = (title) => `https://www.kingstone.com.tw/search/search?q=${encodeURIComponent(title)}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadFile(url, dest) {
  if (!url) return null;

  return new Promise((resolve) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        },
        (res) => {
          if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
            return resolve(downloadFile(res.headers.location, dest));
          }

          if (res.statusCode !== 200) {
            console.error(`    Download failed: ${res.statusCode} for ${url}`);
            resolve(false);
            return;
          }

          // Validate Content-Type: must be an image
          const contentType = res.headers['content-type'];
          if (!contentType || !contentType.startsWith('image/')) {
            console.error(`    Validation failed: Expected image, got ${contentType} for ${url}`);
            resolve(false);
            return;
          }

          const fileStream = fs.createWriteStream(dest);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(true);
          });
          fileStream.on('error', (err) => {
            console.error(`    Stream error for ${url}: ${err.message}`);
            resolve(false);
          });
        },
      )
      .on('error', (err) => {
        console.error(`    Network error downloading ${url}: ${err.message}`);
        resolve(false);
      });
  });
}

async function _fetchCoverFromGoogle(title, author) {
  // Clean title: remove 《 》 and other common punctuation
  const cleanTitle = title.replace(/[《》【】「」]/g, '').trim();
  // Take only the first author if there are multiple or if it's a category
  const cleanAuthor = author
    .split(',')[0]
    .replace(/[未知作者]/g, '')
    .trim();

  async function search(q) {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=1${apiKey ? `&key=${apiKey}` : ''}`;

    return new Promise((resolve) => {
      https
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            console.error(`    API Error: ${res.statusCode} for ${q}`);
            resolve(null);
            return;
          }
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              if (json.items?.[0]?.volumeInfo?.imageLinks) {
                const links = json.items[0].volumeInfo.imageLinks;
                resolve(links.thumbnail || links.smallThumbnail || null);
              } else {
                resolve(null);
              }
            } catch (e) {
              console.error(`    JSON Error: ${e.message}`);
              resolve(null);
            }
          });
        })
        .on('error', (err) => {
          console.error(`    Network Error: ${err.message}`);
          resolve(null);
        });
    });
  }

  // Try 1: Title + Author
  let cover = await search(`intitle:${cleanTitle} inauthor:${cleanAuthor}`);
  if (cover) return cover;

  await sleep(500); // Rate limit between searches for the same book

  // Try 2: Title only
  cover = await search(`intitle:${cleanTitle}`);
  return cover;
}

function parseAdultCsv(csvData) {
  const lines = csvData.split(/\r?\n/);
  const books = [];

  // Adult Header Update:
  // 0: 分類中排序, 1: 書名, 2: 分類, 3: 作者, 4: 出版年, 5: 初中高階, 6: 博客來, 7: 金石堂, 8: 誠品, 9: momo, 10: tazze, 11: Kobo, 12: readmoo, 13: 簡介, 14: 金石堂(unused), 15: 誠品(unused), 16: 是否列入
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());

    const [
      sortOrderStr,
      title,
      category,
      author,
      _year,
      level,
      booksUrl,
      kingstoneUrl,
      esliteUrl,
      momoUrl,
      _tazzeUrl,
      koboUrl,
      readmooUrl,
      description,
      _ks_unused,
      _es_unused,
      include,
    ] = cols;

    if (!title || title === '書名' || title.includes('新增以下書目')) continue;
    if (include === '否') continue;

    // Use booksUrl from CSV (Column G)
    const coverUrl = getCoverFromUrl(booksUrl);

    // Parse sort order, default to a high number if missing to put at the end
    const sortOrder = parseInt(sortOrderStr, 10);
    const validSortOrder = Number.isNaN(sortOrder) ? 999999 : sortOrder;

    // Map Chinese level to English
    let mappedLevel = 'basic';
    if (level === '中') mappedLevel = 'intermediate';
    else if (level === '高') mappedLevel = 'advanced';

    const book = {
      _sortOrder: validSortOrder, // Temporary property for sorting
      id: `sheet-${i}`,
      title: title,
      author: author || '未知作者',
      description: description || `${title} - ${category || ''}`,
      coverImage: coverUrl || undefined,
      level: mappedLevel,
      tags: category ? category.split(',').map((t) => t.trim()) : [],
      links: {
        books: booksUrl || `https://search.books.com.tw/search/query/key/${encodeURIComponent(title)}`,
        eslite: esliteUrl || getEsliteSearch(title),
        kingstone: kingstoneUrl || getKingstoneSearch(title),
        momo: momoUrl || undefined,
        kobo: koboUrl || undefined,
        readmoo: readmooUrl || undefined,
        nlpi: getNlpiLink(title),
      },
    };
    books.push(book);
  }
  return books;
}

function parseChildrenCsv(csvData) {
  const lines = csvData.split(/\r?\n/);
  const books = [];

  // Children Header: 來源,書名,作者,出版年,博客來,分類,,
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());
    const [_source, title, author, _year, booksUrl, category, _subcat1, subcat2] = cols;

    if (!title || title === '書名') continue;

    const coverUrl = getCoverFromUrl(booksUrl);

    const book = {
      id: `child-sheet-${i}`,
      title: title,
      author: author || '不詳',
      description: subcat2 || category || '相關繪本',
      coverImage: coverUrl || undefined,
      level: 'basic',
      tags: category ? category.split(',').map((t) => t.trim()) : [],
      links: {
        books: booksUrl || `https://search.books.com.tw/search/query/key/${encodeURIComponent(title)}`,
        eslite: getEsliteSearch(title),
        kingstone: getKingstoneSearch(title),
        nlpi: getNlpiLink(title),
      },
    };
    books.push(book);
  }
  return books;
}

function parseDocCsv(csvData) {
  const lines = csvData.split(/\r?\n/);
  const docs = [];

  // Documentary Header:
  // 0: 排序, 1: 標籤, 2: 片名, 3: 首映年份, 4: 導演, 5: 圖片, 6: 說明 48字內
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());
    const [sortOrderStr, tagsStr, title, year, director, thumbnail, description] = cols;

    if (!title || title === '片名') continue;

    // Parse sort order, default to a high number if missing
    const sortOrder = parseInt(sortOrderStr, 10);
    const validSortOrder = Number.isNaN(sortOrder) ? 999999 : sortOrder;

    const doc = {
      _sortOrder: validSortOrder, // Temporary property for sorting
      id: `doc-sheet-${i}`,
      title: title,
      director: director || '未知',
      year: year || '未知',
      description: description || title,
      thumbnail: thumbnail || '',
      tags: tagsStr ? tagsStr.split(',').map((t) => t.trim()) : [],
    };
    docs.push(doc);
  }
  return docs;
}

function fetchSheet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
          return resolve(fetchSheet(res.headers.location));
        }
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', (err) => reject(err));
  });
}

async function sync() {
  console.log('Fetching data from Google Sheets...');

  try {
    const cache = _loadCache();

    const [adultsCsv, childrenCsv, docsCsv] = await Promise.all([
      fetchSheet(ADULT_CSV_URL),
      fetchSheet(CHILDREN_CSV_URL),
      fetchSheet(DOC_CSV_URL),
    ]);

    let books = parseAdultCsv(adultsCsv);
    const childrenBooks = parseChildrenCsv(childrenCsv);
    let documentaries = parseDocCsv(docsCsv);

    console.log('Downloading images...');

    // Helper function for incremental sync and image validation
    async function processImages(items, assetFolder) {
      for (const item of items) {
        const imgUrl = item.coverImage || item.thumbnail;
        if (imgUrl?.startsWith('http')) {
          const ext = path.extname(new URL(imgUrl).pathname) || '.jpg';
          const filename = `${item.id}${ext}`;
          const dest = path.join(__dirname, `../public/assets/${assetFolder}`, filename);

          // Skip if already in cache and file exists
          if (cache[item.id] === imgUrl && fs.existsSync(dest)) {
            if (item.coverImage) item.coverImage = `/assets/${assetFolder}/${filename}`;
            if (item.thumbnail) item.thumbnail = `/assets/${assetFolder}/${filename}`;
            continue;
          }

          console.log(`  Checking image for: ${item.title}`);
          const success = await downloadFile(imgUrl, dest);
          if (success) {
            cache[item.id] = imgUrl; // Store the remote URL
          }

          // Fallback: If local file exists (manually or from previous sync), use it!
          if (fs.existsSync(dest)) {
            if (item.coverImage) item.coverImage = `/assets/${assetFolder}/${filename}`;
            if (item.thumbnail) item.thumbnail = `/assets/${assetFolder}/${filename}`;
          }
        }
      }
    }

    await processImages(documentaries, 'posters');
    await processImages(books, 'covers');
    await processImages(childrenBooks, 'covers');

    // Sort books by Level (basic -> intermediate -> advanced) then by _sortOrder
    const levelOrder = { basic: 1, intermediate: 2, advanced: 3 };

    books.sort((a, b) => {
      // Primary sort: Level
      const levelA = levelOrder[a.level] || 99;
      const levelB = levelOrder[b.level] || 99;
      if (levelA !== levelB) {
        return levelA - levelB;
      }
      // Secondary sort: Sort Order
      return a._sortOrder - b._sortOrder;
    });

    // Remove _sortOrder property before saving
    books = books.map(({ _sortOrder, ...book }) => book);

    // Remove Google Books enrichment as per user request
    // "remove the existing google book api static covers. let's just use the ones from books.com.tw"

    documentaries.sort((a, b) => a._sortOrder - b._sortOrder);
    documentaries = documentaries.map(({ _sortOrder, ...doc }) => doc);

    const output = { books, childrenBooks, documentaries };

    const content = `export const sheetData = ${JSON.stringify(output, null, 2)};`;
    fs.writeFileSync(path.join(__dirname, '../books_data.ts'), content);

    _saveCache(cache);

    console.log(
      `Successfully synced ${books.length} books, ${childrenBooks.length} children books, and ${documentaries.length} documentaries to books_data.ts.`,
    );
    process.exit(0);
  } catch (err) {
    console.error('Error syncing sheets:', err);
    process.exit(1);
  }
}
sync();
