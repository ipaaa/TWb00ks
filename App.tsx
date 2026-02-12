
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BookCard from './components/BookCard';
import DocCard from './components/DocCard';
import { BOOKS, CHILDREN_BOOKS, DOCUMENTARIES } from './constants';
import { BookMarked, GraduationCap, Compass, Palette, Star, Pencil, Quote, X, Hash, Search, ExternalLink } from 'lucide-react';
import { Book, ReadingLevel } from './types';

const BooksView: React.FC = () => {
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBooks = useMemo(() => {
    let books = BOOKS;

    // 1. Tag Filter
    if (filterTag) {
      books = books.filter(book => book.tags?.includes(filterTag));
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }

    return books;
  }, [filterTag, searchQuery]);

  const basicBooks = filteredBooks.filter(b => b.level === 'basic');
  const intermediateBooks = filteredBooks.filter(b => b.level === 'intermediate');
  const advancedBooks = filteredBooks.filter(b => b.level === 'advanced');

  return (
    <section className="animate-in fade-in duration-700">
      {/* Intro Section - Only show when not filtering */}
      {!filterTag && !searchQuery && (
        <div className="mb-16 bg-white/50 border border-rose-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-rose-100/30">
            <Quote size={120} strokeWidth={1} />
          </div>
          <div className="max-w-3xl relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 serif mb-6 flex items-center gap-3">
              <span className="w-10 h-1 bg-rose-600 rounded-full inline-block"></span>
              承接自由的家業
            </h2>
            <div className="space-y-4 text-stone-700 leading-relaxed serif text-lg">
              <p>
                在這裡，我們將自由視為一份珍貴的家業。身處於權利與選擇都相對充裕的時代，我們就像是承接了一份豐厚遺產的「民主富二代」。
              </p>
              <p>
                這份遺產並非憑空而降，而是由無數前輩在歷史的轉角處，憑藉韌性與對理想的堅持，一棒接一棒傳遞至今。
              </p>
              <p className="font-bold text-stone-900">
                本站的成立，是為了讓我們不同世代能共同認識這份遺產的來歷。像在時光岩壁徒手攀登，我們在史料間尋找支點，憑藉著對真相的渴望，換取一份俯瞰當代社會的清澈視野。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 serif mb-6">
          {filterTag ? `標籤搜尋：#${filterTag}` : '精選書單：分階補課計畫'}
        </h2>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-stone-200 rounded-full leading-5 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-shadow shadow-sm"
            placeholder="搜尋書名、作者..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {!filterTag && !searchQuery ? (
          <p className="text-stone-600 text-base leading-relaxed italic">
            「歷史是一場記憶與遺忘的鬥爭。」—— 米蘭・昆德拉
          </p>
        ) : (
          (filterTag || searchQuery) && (
            <div className="flex items-center justify-center mt-4 gap-2">
              {filterTag && (
                <button
                  onClick={() => setFilterTag(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-bold hover:bg-rose-200 transition-colors"
                >
                  <X size={16} />
                  清除標籤: #{filterTag}
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* 第一階段 */}
      {basicBooks.length > 0 && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6 border-b border-rose-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-rose-100 rounded text-rose-800">
                <Compass size={20} />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-0.5">
                  <h3 className="text-xl font-bold text-stone-900 serif">初階：從聽故事開始</h3>
                </div>
                <p className="text-stone-500 text-xs font-medium">那些課本沒說清楚的台灣大小事</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {basicBooks.map((book) => (
              <BookCard key={book.id} book={book} onTagClick={setFilterTag} />
            ))}
          </div>
        </div>
      )}

      {/* 第二階段 */}
      {intermediateBooks.length > 0 && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-center space-x-3 mb-6 border-b border-amber-100 pb-3">
            <div className="p-1.5 bg-amber-100 rounded text-amber-800">
              <BookMarked size={20} />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                <h3 className="text-xl font-bold text-stone-900 serif">中階：原來是這樣</h3>
              </div>
              <p className="text-stone-500 text-xs font-medium">把零散的歷史碎片拼成大藍圖</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {intermediateBooks.map((book) => (
              <BookCard key={book.id} book={book} onTagClick={setFilterTag} />
            ))}
          </div>
        </div>
      )}

      {/* 第三階段 */}
      {advancedBooks.length > 0 && (
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center space-x-3 mb-6 border-b border-red-100 pb-3">
            <div className="p-1.5 bg-red-100 rounded text-red-800">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                <h3 className="text-xl font-bold text-stone-900 serif">進階：思辨大補帖</h3>
              </div>
              <p className="text-stone-500 text-xs font-medium">練就一身史料判讀力與深度深度政經分析</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {advancedBooks.map((book) => (
              <BookCard key={book.id} book={book} onTagClick={setFilterTag} />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200">
          <Search size={48} className="mx-auto text-stone-300 mb-4" />
          <p className="text-stone-500 serif text-lg">
            找不到與 {filterTag ? `#${filterTag}` : ''} {searchQuery ? `"${searchQuery}"` : ''} 相關的書籍。
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {filterTag && (
              <button
                onClick={() => setFilterTag(null)}
                className="text-rose-700 font-bold hover:underline"
              >
                清除標籤
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-rose-700 font-bold hover:underline"
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
    if (!filterTag) return CHILDREN_BOOKS;
    return CHILDREN_BOOKS.filter(book => book.tags?.includes(filterTag));
  }, [filterTag]);

  return (
    <section className="animate-in fade-in duration-700">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-4">
          <Star size={14} fill="currentColor" />
          <span>親子共讀・歷史啟蒙</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 serif mb-4 flex items-center justify-center space-x-3">
          <Palette className="text-amber-600" />
          <span>{filterTag ? `標籤搜尋：#${filterTag}` : '兒童與青少年書房'}</span>
        </h2>
        {filterTag && (
          <button
            onClick={() => setFilterTag(null)}
            className="flex items-center gap-2 px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold mx-auto mb-4 hover:bg-rose-100 hover:text-rose-700 transition-colors"
          >
            <X size={12} />
            清除篩選
          </button>
        )}
        <p className="text-stone-600 text-base leading-relaxed">
          從溫柔的筆觸開始，讓孩子透過繪本看見土地的故事。
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredChildrenBooks.map((book) => (
          <BookCard key={book.id} book={book} onTagClick={setFilterTag} />
        ))}
      </div>
      {filteredChildrenBooks.length === 0 && (
        <div className="text-center py-20 text-stone-400 serif">
          目前該標籤下沒有童書推薦。
        </div>
      )}
    </section>
  );
};

const DocumentariesView: React.FC = () => (
  <section className="animate-in fade-in duration-700">
    <div className="mb-12 text-center max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-black text-stone-900 serif mb-4">光影紀實：看見真實的面容</h2>
      <p className="text-stone-600 text-base leading-relaxed">
        文字之外，紀錄片用最直觀的方式，保存了那些被遺忘的聲音與影像。
      </p>
    </div>
    <div className="grid grid-cols-1 gap-8">
      {DOCUMENTARIES.map((doc) => (
        <DocCard key={doc.id} doc={doc} />
      ))}
    </div>
  </section>
);

const ShareView: React.FC = () => {
  return (
    <section className="animate-in fade-in duration-700 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 p-6 bg-rose-50 text-rose-700 rounded-full inline-block">
        <Pencil size={48} strokeWidth={2} />
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-stone-900 serif mb-6">
        我要推薦：民主共編
      </h2>
      <p className="text-stone-600 text-lg mb-8 max-w-2xl leading-relaxed">
        我們相信，每個人都能成為民主記憶的守護者。<br />
        歡迎透過下方表單分享您心目中的補課好書，我們將會定期整理並更新至這份書單中。
      </p>

      <a
        href="https://docs.google.com/forms/d/1HZPkLNFjrCWHlJ5qjLVhf6sM5AFGG5-w12R71jqt_PQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-rose-700 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600 hover:bg-rose-800 hover:scale-105 shadow-xl"
      >
        <span>前往填寫推薦表單</span>
        <ExternalLink size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </a>

      <p className="mt-8 text-stone-400 text-sm">
        * 點擊按鈕將開啟 Google Form 頁面
      </p>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<BooksView />} />
          <Route path="/children" element={<ChildrenView />} />
          <Route path="/documentaries" element={<DocumentariesView />} />
          <Route path="/share" element={<ShareView />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
