
const fs = require('fs');
const https = require('https');
const path = require('path');

const SHEET_ID = '1Z0JUS0fw5SFaX1-oht6jEx5i8XI888vx5F9jm9BEggI';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

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

async function sync() {
  console.log('Fetching data from Google Sheets...');
  
  https.get(CSV_URL, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      const lines = data.split(/\r?\n/);
      const books = [];
      const childrenBooks = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
        const [source, title, author, year, booksUrl, category, type, memo] = cols;

        if (!title || title === '書名' || title.includes('新增以下書目')) continue;

        const book = {
          id: `sheet-${i}`,
          title: title,
          author: author || '未知作者',
          description: memo || `${title} - ${category || ''}`,
          coverImage: getCoverFromUrl(booksUrl) || 'https://images.unsplash.com/photo-1544648156-5388451882c5?q=80&w=400',
          level: 'basic',
          tags: category ? category.split(',').map(t => t.trim()) : [],
          links: {
            books: booksUrl || `https://search.books.com.tw/search/query/key/${encodeURIComponent(title)}`,
            eslite: getEsliteSearch(title),
            kingstone: getKingstoneSearch(title),
            nlpi: getNlpiLink(title)
          }
        };

        const isChildren = (category && (category.includes('繪本') || category.includes('漫畫'))) || 
                           (type && type.includes('繪本'));

        if (isChildren) {
          childrenBooks.push(book);
        } else {
          books.push(book);
        }
      }

      const output = {
        lastUpdated: new Date().toISOString(),
        books,
        childrenBooks
      };

      // 輸出為 TypeScript 檔案，避免 JSON 匯入的問題
      const content = `export const sheetData = ${JSON.stringify(output, null, 2)};`;
      fs.writeFileSync(
        path.join(__dirname, '../books_data.ts'),
        content
      );
      
      console.log(`Successfully synced ${books.length} books and ${childrenBooks.length} children books to books_data.ts.`);
    });
  }).on('error', (err) => {
    console.error('Error fetching sheet:', err);
    process.exit(1);
  });
}

sync();
