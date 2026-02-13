
import { Book, Documentary } from './types';
// 從 .ts 檔案匯入 sheetData
import { sheetData } from './books_data';

// Fix: Use type assertion to cast imported data to Book[] as the literal strings in level property are compatible with ReadingLevel
export const BOOKS: Book[] = sheetData.books as unknown as Book[];
export const CHILDREN_BOOKS: Book[] = sheetData.childrenBooks as unknown as Book[];

export const DOCUMENTARIES: Documentary[] = [
  {
    id: 'd1',
    title: '牽阮的手',
    director: '莊益增、顏蘭權',
    year: '2010',
    description: '以田朝明醫師與田孟淑女士的愛情故事為線索，交織出台灣民主運動歷程。',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/zh/e/e5/%E7%89%BD%E9%98%AE%E7%9A%84%E6%89%8B.jpg'
  }
];
