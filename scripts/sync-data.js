import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHEET_ID = '1Z0JUS0fw5SFaX1-oht6jEx5i8XI888vx5F9jm9BEggI';
const ADULT_SHEET_GID = '0';
const CHILDREN_SHEET_GID = '1880693572';

const ADULT_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${ADULT_SHEET_GID}`;
const CHILDREN_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${CHILDREN_SHEET_GID}`;

const CACHE_PATH = path.join(__dirname, 'cover_cache.json');

function loadCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading cache:', err);
  }
  return {};
}

function saveCache(cache) {
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
const getNlpiLink = (title) => `https://ebook.nlpi.edu.tw/search?search_field=TI&search_input=${encodeURIComponent(title)}`;
const getEsliteSearch = (title) => `https://www.eslite.com/Search?q=${encodeURIComponent(title)}`;
const getKingstoneSearch = (title) => `https://www.kingstone.com.tw/search/search?q=${encodeURIComponent(title)}`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCoverFromGoogle(title, author) {
  // Clean title: remove 《 》 and other common punctuation
  const cleanTitle = title.replace(/[《》【】「」]/g, '').trim();
  // Take only the first author if there are multiple or if it's a category
  const cleanAuthor = author.split(',')[0].replace(/[未知作者]/g, '').trim();

  async function search(q) {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=1${apiKey ? `&key=${apiKey}` : ''}`;

    return new Promise((resolve) => {
      https.get(url, (res) => {
        if (res.statusCode !== 200) {
          console.error(`    API Error: ${res.statusCode} for ${q}`);
          resolve(null);
          return;
        }
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.items && json.items[0]?.volumeInfo?.imageLinks) {
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
      }).on('error', (err) => {
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

  // Adult Header: 分類中排序,書名,分類,作者,出版年,初中高階,博客來,簡介,金石堂,誠品,是否列入
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
    // Col 0 is "分類中排序"
    // Adult Header indices: 0:排序, 1:書名, 2:分類, 3:作者, 4:出版年, 5:初中高階, 6:博客來, 7:簡介, 8:金石堂, 9:誠品, 10:是否列入
    const [sortOrderStr, title, category, author, year, level, booksUrl, description, kingstoneUrl, esliteUrl, include] = cols;

    if (!title || title === '書名' || title.includes('新增以下書目')) continue;

    // Use booksUrl from CSV (Column G)
    const coverUrl = getCoverFromUrl(booksUrl);

    // Parse sort order, default to a high number if missing to put at the end
    const sortOrder = parseInt(sortOrderStr, 10);
    const validSortOrder = isNaN(sortOrder) ? 999999 : sortOrder;

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
      tags: category ? category.split(',').map(t => t.trim()) : [],
      links: {
        books: booksUrl || `https://search.books.com.tw/search/query/key/${encodeURIComponent(title)}`,
        eslite: esliteUrl || getEsliteSearch(title),
        kingstone: kingstoneUrl || getKingstoneSearch(title),
        nlpi: getNlpiLink(title)
      }
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

    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
    const [source, title, author, year, booksUrl, category, subcat1, subcat2] = cols;

    if (!title || title === '書名') continue;

    const coverUrl = getCoverFromUrl(booksUrl);

    const book = {
      id: `child-sheet-${i}`,
      title: title,
      author: author || '不詳',
      description: subcat2 || category || '相關繪本',
      coverImage: coverUrl || undefined,
      level: 'basic',
      tags: category ? category.split(',').map(t => t.trim()) : [],
      links: {
        books: booksUrl || `https://search.books.com.tw/search/query/key/${encodeURIComponent(title)}`,
        eslite: getEsliteSearch(title),
        kingstone: getKingstoneSearch(title),
        nlpi: getNlpiLink(title)
      }
    };
    books.push(book);
  }
  return books;
}


function fetchSheet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        return resolve(fetchSheet(res.headers.location));
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

async function sync() {
  console.log('Fetching data from Google Sheets...');

  try {
    const [adultsCsv, childrenCsv] = await Promise.all([
      fetchSheet(ADULT_CSV_URL),
      fetchSheet(CHILDREN_CSV_URL)
    ]);

    let books = parseAdultCsv(adultsCsv);
    let childrenBooks = parseChildrenCsv(childrenCsv);

    // Sort books by Level (basic -> intermediate -> advanced) then by _sortOrder
    const levelOrder = { 'basic': 1, 'intermediate': 2, 'advanced': 3 };

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

    const output = {
      lastUpdated: new Date().toISOString(),
      books,
      childrenBooks
    };

    const content = `export const sheetData = ${JSON.stringify(output, null, 2)};`;
    fs.writeFileSync(
      path.join(__dirname, '../books_data.ts'),
      content
    );

    console.log(`Successfully synced ${books.length} books and ${childrenBooks.length} children books to books_data.ts.`);
    process.exit(0);

  } catch (err) {
    console.error('Error syncing sheets:', err);
    process.exit(1);
  }
}
sync();
