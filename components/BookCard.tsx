
import React, { useState, useRef, useEffect } from 'react';
import { Book } from '../types';
import { Library, ExternalLink, Hash, ShoppingCart, ChevronDown } from 'lucide-react';
import { getBookCoverUrl } from '../utils/bookCover';

interface BookCardProps {
  book: Book;
  onTagClick?: (tag: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onTagClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const purchaseOptions = [
    { name: '博客來', url: book.links.books },
    ...(book.links.readmoo ? [{ name: 'Readmoo 讀墨', url: book.links.readmoo }] : []),
    ...(book.links.kobo ? [{ name: 'Kobo', url: book.links.kobo }] : []),
  ];
  return (
    <div className="group bg-white dark:bg-stone-800 rounded-lg shadow-sm hover:shadow-md dark:shadow-stone-900/50 transition-all duration-300 overflow-hidden border border-stone-200 dark:border-stone-700 flex flex-col h-full relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 dark:bg-stone-700">
        <img
          src={getBookCoverUrl(book)}
          alt={book.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
      </div>

      <div className="p-3.5 flex flex-col flex-grow">
        <span className="text-rose-700 dark:text-rose-400 text-[9px] font-bold tracking-widest uppercase mb-1">{book.author}</span>
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 serif mb-1.5 group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors leading-tight line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>

        {/* Tags Section - Clickable */}
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {book.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  onTagClick?.(tag);
                }}
                className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 text-[8px] font-bold rounded hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-700 dark:hover:text-rose-400 transition-colors flex items-center gap-0.5"
              >
                <Hash size={7} />
                {tag}
              </button>
            ))}
          </div>
        )}

        <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed mb-3 line-clamp-3 flex-grow">
          {book.description}
        </p>

        <div className="pt-2.5 border-t border-stone-100 dark:border-stone-700">
          <div className="grid grid-cols-2 gap-2">
            {purchaseOptions.length === 1 ? (
              <a
                href={book.links.books}
                target="_blank"
                rel="noopener noreferrer"
                className="flex py-1.5 bg-stone-900 dark:bg-rose-700 hover:bg-rose-800 dark:hover:bg-rose-600 text-white text-[9px] font-bold rounded items-center justify-center space-x-1 transition-colors shadow-sm"
              >
                <ShoppingCart size={10} />
                <span>網路購書</span>
              </a>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex py-1.5 bg-stone-900 dark:bg-rose-700 hover:bg-rose-800 dark:hover:bg-rose-600 text-white text-[9px] font-bold rounded items-center justify-center space-x-1 transition-colors shadow-sm"
                >
                  <ShoppingCart size={10} />
                  <span>網路購書</span>
                  <ChevronDown size={10} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-stone-800 rounded shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden z-10">
                    {purchaseOptions.map((option, index) => (
                      <a
                        key={index}
                        href={option.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-[10px] font-medium transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span>{option.name}</span>
                        <ExternalLink size={9} className="ml-1" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <a
              href={book.links.nlpi}
              target="_blank"
              rel="noopener noreferrer"
              className="flex py-1.5 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 text-[9px] font-bold rounded items-center justify-center space-x-1 transition-colors border border-stone-200 dark:border-stone-600"
            >
              <Library size={10} />
              <span>國資圖借閱</span>
              <ExternalLink size={8} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
