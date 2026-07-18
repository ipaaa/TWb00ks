import {
  BookMarked,
  Compass,
  ExternalLink,
  GraduationCap,
  Palette,
  Pencil,
  Quote,
  Search,
  Star,
  X,
} from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BookCard from './components/BookCard';
import DocCard from './components/DocCard';
import Layout from './components/Layout';
import NotFoundView from './components/NotFoundView';
import SEO from './components/SEO';
import { BOOKS, CHILDREN_BOOKS, DOCUMENTARIES } from './constants';
import { routes } from './routes';

const hasDisplayImage = (image: string | undefined): boolean => Boolean(image?.trim());

const BooksView: React.FC = () => {
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBooks = useMemo(() => {
    let books = BOOKS.filter((book) => hasDisplayImage(book.coverImage));

    // 1. Tag Filter
    if (filterTag) {
      books = books.filter((book) => book.tags?.includes(filterTag));
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query),
      );
    }

    return books;
  }, [filterTag, searchQuery]);

  const basicBooks = filteredBooks.filter((b) => b.level === 'basic');
  const intermediateBooks = filteredBooks.filter((b) => b.level === 'intermediate');
  const advancedBooks = filteredBooks.filter((b) => b.level === 'advanced');

  return (
    <section className="animate-in fade-in duration-700">
      {/* Intro Section - Only show when not filtering */}
      {!filterTag && !searchQuery && (
        <div className="mb-16 bg-white/50 dark:bg-stone-800/50 border border-rose-100 dark:border-rose-900/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 right-0 p-8 text-rose-100/30 dark:text-rose-900/30">
            <Quote size={120} strokeWidth={1} />
          </div>
          <div className="max-w-3xl relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 serif mb-6 flex items-center gap-3">
              <span className="w-10 h-1 bg-rose-600 dark:bg-rose-500 rounded-full inline-block"></span>
              承接自由的家業
            </h2>
            <div className="space-y-4 text-stone-700 dark:text-stone-300 leading-relaxed serif text-lg">
              <p>
                在這裡，我們將自由視為一份珍貴的家業。這份遺產並非憑空而降，而是由無數前輩在歷史的轉角處，憑藉韌性與對理想的堅持，一棒接一棒傳遞至今。
              </p>
              <p className="font-bold text-stone-900 dark:text-stone-100">
                本站的成立，是為了讓我們不同世代能共同認識這份遺產的來歷。像在時光岩壁徒手攀登，在史料間尋找支點，憑藉著對真相的渴望，換取一份俯瞰當代社會的清澈視野。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 serif mb-6">
          {filterTag ? `標籤搜尋：#${filterTag}` : '精選書單：分階補課計畫'}
        </h2>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400 dark:text-stone-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-stone-200 dark:border-stone-600 rounded-full leading-5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-rose-500 dark:focus:border-rose-400 sm:text-sm transition-shadow shadow-sm"
            placeholder="搜尋書名、作者..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {(filterTag || searchQuery) && (
          <div className="flex items-center justify-center mt-4 gap-2">
            {filterTag && (
              <button
                type="button"
                onClick={() => setFilterTag(null)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 rounded-full text-sm font-bold hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
              >
                <X size={16} />
                清除標籤: #{filterTag}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 第一階段 */}
      {basicBooks.length > 0 && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6 border-b border-rose-100 dark:border-rose-900/30 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 rounded text-rose-800 dark:text-rose-400">
                <Compass size={20} />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-0.5">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 serif">初階：從聽故事開始</h3>
                </div>
                <p className="text-stone-500 dark:text-stone-400 text-xs font-medium">那些課本沒說清楚的台灣大小事</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {basicBooks.map((book) => (
              <BookCard key={book.id} book={book} onTagClick={setFilterTag} />
            ))}
          </div>
        </div>
      )}

      {/* 第二階段 */}
      {intermediateBooks.length > 0 && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-center space-x-3 mb-6 border-b border-amber-100 dark:border-amber-900/30 pb-3">
            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded text-amber-800 dark:text-amber-400">
              <BookMarked size={20} />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 serif">中階：原來是這樣</h3>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-xs font-medium">把零散的歷史碎片拼成大藍圖</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {intermediateBooks.map((book) => (
              <BookCard key={book.id} book={book} onTagClick={setFilterTag} />
            ))}
          </div>
        </div>
      )}

      {/* 第三階段 */}
      {advancedBooks.length > 0 && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center space-x-3 mb-6 border-b border-red-100 dark:border-red-900/30 pb-3">
            <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded text-red-800 dark:text-red-400">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 serif">進階：思辨大補帖</h3>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-xs font-medium">練就一身史料判讀力與深度政經分析</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {advancedBooks.map((book) => (
              <BookCard key={book.id} book={book} onTagClick={setFilterTag} />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-stone-800 rounded-3xl border border-dashed border-stone-200 dark:border-stone-700">
          <Search size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
          <p className="text-stone-500 dark:text-stone-400 serif text-lg">
            找不到與 {filterTag ? `#${filterTag}` : ''} {searchQuery ? `"${searchQuery}"` : ''} 相關的書籍。
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {filterTag && (
              <button
                type="button"
                onClick={() => setFilterTag(null)}
                className="text-rose-700 dark:text-rose-400 font-bold hover:underline"
              >
                清除標籤
              </button>
            )}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-rose-700 dark:text-rose-400 font-bold hover:underline"
              >
                清除搜尋
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

const ChildrenView: React.FC = () => {
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const filteredChildrenBooks = useMemo(() => {
    const booksWithCovers = CHILDREN_BOOKS.filter((book) => hasDisplayImage(book.coverImage));
    if (!filterTag) return booksWithCovers;
    return booksWithCovers.filter((book) => book.tags?.includes(filterTag));
  }, [filterTag]);

  return (
    <section className="animate-in fade-in duration-700">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold mb-4">
          <Star size={14} fill="currentColor" />
          <span>親子共讀・歷史啟蒙</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 serif mb-4 flex items-center justify-center space-x-3">
          <Palette className="text-amber-600 dark:text-amber-400" />
          <span>{filterTag ? `標籤搜尋：#${filterTag}` : '兒童與青少年書房'}</span>
        </h2>
        {filterTag && (
          <button
            type="button"
            onClick={() => setFilterTag(null)}
            className="flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full text-xs font-bold mx-auto mb-4 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
          >
            <X size={12} />
            清除篩選
          </button>
        )}
        <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
          從溫柔的筆觸開始，讓孩子透過繪本看見土地的故事。
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
        {filteredChildrenBooks.map((book) => (
          <BookCard key={book.id} book={book} onTagClick={setFilterTag} />
        ))}
      </div>
      {filteredChildrenBooks.length === 0 && (
        <div className="text-center py-20 text-stone-400 dark:text-stone-500 serif">目前該標籤下沒有童書推薦。</div>
      )}
    </section>
  );
};

const DocumentariesView: React.FC = () => {
  const groupedDocs = useMemo(() => {
    const groups: Record<string, typeof DOCUMENTARIES> = {};

    DOCUMENTARIES.filter((doc) => hasDisplayImage(doc.thumbnail)).forEach((doc) => {
      const tags = doc.tags && doc.tags.length > 0 ? doc.tags : ['其他影片'];
      tags.forEach((tag) => {
        if (!groups[tag]) groups[tag] = [];
        // Avoid duplicate in same tag if somehow tags repeat
        if (!groups[tag].some((d) => d.id === doc.id)) {
          groups[tag].push(doc);
        }
      });
    });

    // Sort tag names: "民主運動" first, then others alphabetically
    const sortedTags = Object.keys(groups).sort((a, b) => {
      if (a === '民主運動') return -1;
      if (b === '民主運動') return 1;
      if (a === '其他影片') return 1; // Put "Others" at the end
      if (b === '其他影片') return -1;
      return a.localeCompare(b, 'zh-TW');
    });

    return sortedTags.map((tag) => ({
      tag,
      docs: groups[tag],
    }));
  }, []);

  return (
    <section className="animate-in fade-in duration-700">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 serif mb-4">
          光影紀實：看見真實的面容
        </h2>
        <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed">
          文字之外，紀錄片用最直觀的方式，保存了那些被遺忘的聲音與影像。
          <br />
          <span className="text-sm opacity-80 mt-2 block">
            首批片單引自廖建華導演
            <a
              href="https://www.threads.net/@liao.jian.hua/post/DUllOVlk2pX?xmt=AQF0bz_K0JcwcJb0jleetYGkIpdFoX3EVmUhUogRTDcx6A"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-rose-600 transition-colors"
            >
              整理清單
            </a>
          </span>
        </p>
      </div>

      {groupedDocs.map(({ tag, docs }) => (
        <div key={tag} className="mb-16">
          <div className="flex items-center space-x-3 mb-6 border-b border-rose-100 dark:border-rose-900/30 pb-3">
            <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 rounded text-rose-800 dark:text-rose-400">
              <Star size={20} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 serif">{tag}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {docs.map((doc) => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

const ShareView: React.FC = () => {
  return (
    <section className="animate-in fade-in duration-700 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 p-6 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full inline-block">
        <Pencil size={48} strokeWidth={2} />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 serif mb-6">
        我要推薦：民主共編
      </h2>
      <p className="text-stone-600 dark:text-stone-300 text-lg mb-8 max-w-2xl leading-relaxed">
        我們相信，每個人都能成為民主記憶的守護者。
        <br />
        歡迎透過下方表單分享您心目中的補課好書，我們將會定期整理並更新至這份書單中。
      </p>

      <a
        href="https://docs.google.com/forms/d/1HZPkLNFjrCWHlJ5qjLVhf6sM5AFGG5-w12R71jqt_PQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-rose-700 dark:bg-rose-600 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600 dark:focus:ring-rose-500 dark:focus:ring-offset-stone-900 hover:bg-rose-800 dark:hover:bg-rose-500 hover:scale-105 shadow-xl"
      >
        <span>前往填寫推薦表單</span>
        <ExternalLink size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </a>

      <p className="mt-8 text-stone-400 dark:text-stone-500 text-sm">* 點擊按鈕將開啟 Google Form 頁面</p>
    </section>
  );
};

const viewComponents: Record<string, React.FC> = {
  '/': BooksView,
  '/children': ChildrenView,
  '/documentaries': DocumentariesView,
  '/share': ShareView,
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {routes.map(({ path, title, description }) => {
            const View = viewComponents[path];
            return (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <SEO title={title} description={description} path={path} />
                    <View />
                  </>
                }
              />
            );
          })}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
