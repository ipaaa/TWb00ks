
export interface PurchaseLinks {
  books: string;
  eslite: string;
  kingstone: string;
  nlpi?: string;
  readmoo?: string;
  kobo?: string;
}

export type ReadingLevel = 'basic' | 'intermediate' | 'advanced';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  links: PurchaseLinks;
  level: ReadingLevel;
  contributor?: string;
  tags?: string[];
}

export interface Documentary {
  id: string;
  title: string;
  director: string;
  year: string;
  description: string;
  thumbnail: string;
  youtubeId?: string;
}
