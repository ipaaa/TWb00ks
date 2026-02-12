
import { Book, Documentary } from './types';

// 輔助函式：產生國資圖搜尋連結
const getNlpiLink = (title: string) => `https://ebook.nlpi.edu.tw/search?search_field=TI&search_input=${encodeURIComponent(title)}`;
// 輔助函式：產生誠品搜尋連結
const getEsliteSearch = (title: string) => `https://www.eslite.com/Search?q=${encodeURIComponent(title)}`;
// 輔助函式：產生金石堂搜尋連結
const getKingstoneSearch = (title: string) => `https://www.kingstone.com.tw/search/search?q=${encodeURIComponent(title)}`;

export const BOOKS: Book[] = [
  // 初階：從聽故事開始 (#歷史小白友善)

   {
    id: 'csv-06',
    title: '少年臺灣史',
    author: '周婉窈',
    description: '以簡明易懂的語言，梳理了臺灣從史前時期到現代的完整脈絡。',
    coverImage: 'https://www.books.com.tw/img/001/083/43/0010834309.jpg',
    level: 'basic',
    tags: ['通論', '歷史啟蒙'],
    links: {
      books: 'https://www.books.com.tw/products/0010834309',
      eslite: getEsliteSearch('少年臺灣史'),
      kingstone: getKingstoneSearch('少年臺灣史'),
      nlpi: getNlpiLink('少年臺灣史')
    }
  },
  {
    id: 'csv-01',
    title: '台灣人四百年史',
    author: '史明',
    description: '史明老前輩的經典著作，從被統治者的視角出發，重新建構台灣民族的歷史主體性。',
    coverImage: 'https://www.books.com.tw/img/001/076/86/0010768686.jpg',
    level: 'basic',
    tags: ['通論', '民族史'],
    links: {
      books: 'https://www.books.com.tw/products/0010768686',
      eslite: getEsliteSearch('台灣人四百年史'),
      kingstone: getKingstoneSearch('台灣人四百年史'),
      nlpi: getNlpiLink('台灣人四百年史')
    }
  },

  {
    id: 'csv-04',
    title: '一個春天的童話：小說亮均、亭均',
    author: '李敏勇',
    description: '詩人李敏勇以文學筆觸講述二二八與白色恐怖下的家族傷痕與希望。',
    coverImage: 'https://www.books.com.tw/img/001/104/24/0011042499.jpg',
    level: 'basic',
    tags: ['民主運動', '文學'],
    links: {
      books: 'https://www.books.com.tw/products/0011042499',
      eslite: getEsliteSearch('一個春天的童話'),
      kingstone: getKingstoneSearch('一個春天的童話'),
      nlpi: getNlpiLink('一個春天的童話')
    }
  },
    {
    id: 'csv-03',
    title: '義光教會相關人物訪談錄',
    author: '陳儀深等',
    description: '2024年最新出版，透過第一手訪談紀錄，還原義光教會在民主運動中的關鍵角色。',
    coverImage: 'https://www.books.com.tw/img/001/099/25/0010992500.jpg',
    level: 'basic',
    tags: ['民主運動', '口述歷史'],
    links: {
      books: 'https://www.books.com.tw/products/0010992500',
      eslite: getEsliteSearch('義光教會相關人物訪談錄'),
      kingstone: getKingstoneSearch('義光教會相關人物訪談錄'),
      nlpi: getNlpiLink('義光教會相關人物訪談錄')
    }
  },
  {
    id: 'csv-09',
    title: '無法送達的遺書',
    author: '呂蒼一',
    description: '記那些在恐怖年代失落的人，透過遺書重建受難者的面貌與心聲。',
    coverImage: 'https://www.books.com.tw/img/001/092/65/0010926548.jpg',
    level: 'basic',
    tags: ['白恐', '書信'],
    links: {
      books: 'https://www.books.com.tw/products/0010926548',
      eslite: getEsliteSearch('無法送達的遺書'),
      kingstone: getKingstoneSearch('無法送達的遺書'),
      nlpi: getNlpiLink('無法送達的遺書')
    }
  },
  {
    id: 'csv-10',
    title: '自治之夢：日治時期到二二八',
    author: '陳翠蓮',
    description: '探討台灣人民爭取政治主體性的漫長夢想。',
    coverImage: 'https://www.books.com.tw/img/001/086/47/0010864745.jpg',
    level: 'basic',
    tags: ['日治', '民主運動'],
    links: {
      books: 'https://www.books.com.tw/products/0010864745',
      eslite: getEsliteSearch('自治之夢'),
      kingstone: getKingstoneSearch('自治之夢'),
      nlpi: getNlpiLink('自治之夢')
    }
  },
    {
    id: 'csv-13',
    title: '台灣之春：解嚴前的台灣民主運動',
    author: '胡慧玲',
    description: '詳細紀錄解嚴前夕風起雲湧的民主運動與歷史轉折。',
    coverImage: 'https://www.books.com.tw/img/001/086/82/0010868260.jpg',
    level: 'basic',
    tags: ['民主運動', '解嚴'],
    links: {
      books: 'https://www.books.com.tw/products/0010868260',
      eslite: getEsliteSearch('台灣之春'),
      kingstone: getKingstoneSearch('台灣之春'),
      nlpi: getNlpiLink('台灣之春')
    }
  },
  {
    id: 'csv-11',
    title: '百年追求：台灣民主運動的故事',
    author: '陳翠蓮、吳乃德、胡慧玲',
    description: '全景式紀錄台灣民主化的艱辛歷程，三卷本深度剖析。',
    coverImage: 'https://www.books.com.tw/img/001/061/12/0010611223.jpg',
    level: 'basic',
    tags: ['通論', '民主運動'],
    links: {
      books: 'https://www.books.com.tw/products/0010611223',
      eslite: getEsliteSearch('百年追求'),
      kingstone: getKingstoneSearch('百年追求'),
      nlpi: getNlpiLink('百年追求')
    }
  },
  {
    id: 'csv-05',
    title: '臺灣歷史圖說',
    author: '周婉窈',
    description: '臺灣史研究的經典入門書，提供宏觀且紮實的歷史觀察框架。',
    coverImage: 'https://www.books.com.tw/img/001/002/40/0010024026.jpg',
    level: 'basic',
    tags: ['通論', '學術基礎'],
    links: {
      books: 'https://www.books.com.tw/products/0010024026',
      eslite: getEsliteSearch('臺灣歷史圖說'),
      kingstone: getKingstoneSearch('臺灣歷史圖說'),
      nlpi: getNlpiLink('臺灣歷史圖說')
    }
  },

  {
    id: 'csv-07',
    title: '三代臺灣人：百年追求的現實與理想',
    author: '李筱峰',
    description: '跨越三代人的生命敘事，呈現台灣近代史的劇烈變動與追求。',
    coverImage: 'https://www.books.com.tw/img/001/077/31/0010773174.jpg',
    level: 'basic',
    tags: ['民主運動', '生命史'],
    links: {
      books: 'https://www.books.com.tw/products/0010773174',
      eslite: getEsliteSearch('三代臺灣人'),
      kingstone: getKingstoneSearch('三代臺灣人'),
      nlpi: getNlpiLink('三代臺灣人')
    }
  },
      {
    id: 'csv-new-01',
    title: '回家是一趟沒有線性終點的旅程：白色恐怖與我的左派阿公',
    author: '呂美親',
    description: '透過尋訪「左派阿公」的生命足跡，重新梳理白色恐怖對家族、土地與認同的深遠影響，是一段溫柔而堅定的記憶修補之旅。',
    coverImage: 'https://www.books.com.tw/img/001/101/32/0011013229.jpg',
    level: 'basic',
    tags: ['白恐', '家族史', '認同'],
    links: {
      books: 'https://www.books.com.tw/products/0011013229?sloc=main',
      eslite: getEsliteSearch('回家是一趟沒有線性終點的旅程'),
      kingstone: getKingstoneSearch('回家是一趟沒有線性終點的旅程'),
      nlpi: getNlpiLink('回家是一趟沒有線性終點的旅程')
    }
  },
 
  {
    id: 'csv-24',
    title: '此地即世界',
    author: 'StoryStudio',
    description: '從全球視野重新解讀台灣歷史中的重要事件。',
    coverImage: 'https://www.books.com.tw/img/001/102/65/0011026528.jpg',
    level: 'intermediate',
    tags: ['通論', '科普'],
    links: {
      books: 'https://www.books.com.tw/products/0011026528',
      eslite: getEsliteSearch('此地即世界'),
      kingstone: getKingstoneSearch('此地即世界'),
      nlpi: getNlpiLink('此地即世界')
    }
  },


  // 中階：原來是這樣 (#看懂社會的形狀)

   {
    id: 'csv-08',
    title: '二二八反抗運動：台灣爭取民主之路',
    author: '黃惠君',
    description: '重現二二八事件中的民間反抗力量，反思台灣民主化的根源。',
    coverImage: 'https://www.books.com.tw/img/001/091/67/0010916707.jpg',
    level: 'basic',
    tags: ['二二八', '反抗史'],
    links: {
      books: 'https://www.books.com.tw/products/0010916707',
      eslite: getEsliteSearch('二二八反抗運動'),
      kingstone: getKingstoneSearch('二二八反抗運動'),
      nlpi: getNlpiLink('二二八反抗運動')
    }
  },
  
  {
    id: 'csv-12',
    title: '反抗的意志：美麗島民主運動影像史',
    author: '邱萬興',
    description: '透過珍貴影像，重現 1977-1979 年間美麗島民主運動的現場。',
    coverImage: 'https://www.books.com.tw/img/001/065/74/0010657465.jpg',
    level: 'basic',
    tags: ['民主運動', '影像史'],
    links: {
      books: 'https://www.books.com.tw/products/0010657465',
      eslite: getEsliteSearch('反抗的意志'),
      kingstone: getKingstoneSearch('反抗的意志'),
      nlpi: getNlpiLink('反抗的意志')
    }
  },

  {
    id: 'csv-14',
    title: '臺灣史是什麼？',
    author: '吳密察',
    description: '由歷史權威吳密察帶路，重新定義台灣史的視界。',
    coverImage: 'https://www.books.com.tw/img/001/101/19/0011011987.jpg',
    level: 'basic',
    tags: ['通論', '史學概論'],
    links: {
      books: 'https://www.books.com.tw/products/0011011987',
      eslite: getEsliteSearch('臺灣史是什麼'),
      kingstone: getKingstoneSearch('臺灣史是什麼'),
      nlpi: getNlpiLink('臺灣史是什麼')
    }
  },
  {
    id: 'csv-16',
    title: '讓過去成為此刻：台灣白色恐怖小說選',
    author: '胡淑雯、童偉格',
    description: '透過文學選集，讓歷史的痛點在文字中甦醒。',
    coverImage: 'https://www.books.com.tw/img/001/084/56/0010845692.jpg',
    level: 'intermediate',
    tags: ['白恐', '文學'],
    links: {
      books: 'https://www.books.com.tw/products/0010845692',
      eslite: getEsliteSearch('讓過去成為此刻'),
      kingstone: getKingstoneSearch('讓過去成為此刻'),
      nlpi: getNlpiLink('讓過去成為此刻')
    }
  },
  {
    id: 'csv-17',
    title: '天猶未光：二二八事件的真相',
    author: '薛化元',
    description: '深入探究二二八事件的歷史真相、紀念與責任究責。',
    coverImage: 'https://www.books.com.tw/img/001/074/45/0010744574.jpg',
    level: 'intermediate',
    tags: ['白恐', '二二八'],
    links: {
      books: 'https://www.books.com.tw/products/0010744574',
      eslite: getEsliteSearch('天猶未光'),
      kingstone: getKingstoneSearch('天猶未光'),
      nlpi: getNlpiLink('天猶未光')
    }
  },
  {
    id: 'csv-18',
    title: '轉型正義之路：島嶼的過去與未來',
    author: '周婉窈',
    description: '2022年出版。對台灣轉型正義進程的深刻反思與展望。',
    coverImage: 'https://www.books.com.tw/img/001/094/40/0010944069.jpg',
    level: 'intermediate',
    tags: ['日治', '轉型正義'],
    links: {
      books: 'https://www.books.com.tw/products/0010944069',
      eslite: getEsliteSearch('轉型正義之路'),
      kingstone: getKingstoneSearch('轉型正義之路'),
      nlpi: getNlpiLink('轉型正義之路')
    }
  },
  {
    id: 'csv-19',
    title: '台海・冷戰・蔣介石',
    author: '林孝庭',
    description: '解密檔案中消失的台灣史，解析國際地緣政治如何決定台灣命運。',
    coverImage: 'https://www.books.com.tw/img/001/068/04/0010680467.jpg',
    level: 'intermediate',
    tags: ['通論', '冷戰'],
    links: {
      books: 'https://www.books.com.tw/products/0010680467',
      eslite: getEsliteSearch('台海冷戰蔣介石'),
      kingstone: getKingstoneSearch('台海冷戰蔣介石'),
      nlpi: getNlpiLink('台海冷戰蔣介石')
    }
  },
  {
    id: 'csv-20',
    title: '福爾摩沙紀事',
    author: '馬偕',
    description: '馬偕博士親筆記錄在台傳教與生活的見聞錄。',
    coverImage: 'https://www.books.com.tw/img/001/036/60/0010366083.jpg',
    level: 'intermediate',
    tags: ['通論', '日治'],
    links: {
      books: 'https://www.books.com.tw/products/0010366083',
      eslite: getEsliteSearch('福爾摩沙紀事'),
      kingstone: getKingstoneSearch('福爾摩沙紀事'),
      nlpi: getNlpiLink('福爾摩沙紀事')
    }
  },
  {
    id: 'csv-21',
    title: '透光的暗暝：政治受難者口訪紀錄',
    author: '許雪姬',
    description: '臺中政治受難者暨相關人士口訪紀錄，還原被遮蔽的生命。',
    coverImage: 'https://search.books.com.tw/search/query/key/透光的暗暝',
    level: 'intermediate',
    tags: ['日治', '白恐', '口訪'],
    links: {
      books: 'https://search.books.com.tw/search/query/key/透光的暗暝',
      eslite: getEsliteSearch('透光的暗暝'),
      kingstone: getKingstoneSearch('透光的暗暝'),
      nlpi: getNlpiLink('透光的暗暝')
    }
  },
  {
    id: 'csv-22',
    title: '一甲子的未亡人',
    author: '呂培苓',
    description: '講述王培五女士與她的 6 個子女在恐怖年代的遭遇。',
    coverImage: 'https://www.books.com.tw/img/001/067/63/0010676365.jpg',
    level: 'intermediate',
    tags: ['白恐', '家族史'],
    links: {
      books: 'https://www.books.com.tw/products/0010676365',
      eslite: getEsliteSearch('一甲子的未亡人'),
      kingstone: getKingstoneSearch('一甲子的未亡人'),
      nlpi: getNlpiLink('一甲子的未亡人')
    }
  },
  {
    id: 'csv-23',
    title: '茶金歲月',
    author: '廖運潘',
    description: '北埔姜家在茶業盛世中的起落，展現戰後社會真實面貌。',
    coverImage: 'https://www.books.com.tw/img/001/090/76/0010907623.jpg',
    level: 'intermediate',
    tags: ['文學', '產業史'],
    links: {
      books: 'https://www.books.com.tw/products/0010907623',
      eslite: getEsliteSearch('茶金歲月'),
      kingstone: getKingstoneSearch('茶金歲月'),
      nlpi: getNlpiLink('茶金歲月')
    }
  },


  // 進階：思辨大補帖 (#直視歷史痛點)
  {
    id: 'csv-25',
    title: '被出賣的台灣',
    author: 'George H. Kerr',
    description: '揭露二二八事件真相的重量級紀錄，深刻分析地緣政治。',
    coverImage: 'https://www.books.com.tw/img/001/000/87/0010008706.jpg',
    level: 'advanced',
    tags: ['通論', '外部觀點'],
    links: {
      books: 'https://www.books.com.tw/products/0010008706',
      eslite: getEsliteSearch('被出賣的台灣'),
      kingstone: getKingstoneSearch('被出賣的台灣'),
      nlpi: getNlpiLink('被出賣的台灣')
    }
  },
  {
    id: 'csv-26',
    title: '記憶與遺忘的鬥爭',
    author: '台灣民間真相與和解促進會',
    description: '臺灣轉型正義階段報告，是直視威權壓迫結構的必讀教材。',
    coverImage: 'https://www.books.com.tw/img/001/069/20/0010692067.jpg',
    level: 'advanced',
    tags: ['轉型正義', '報告書'],
    links: {
      books: 'https://www.books.com.tw/products/0010692067',
      eslite: getEsliteSearch('記憶與遺忘的鬥爭'),
      kingstone: getKingstoneSearch('記憶與遺忘的鬥爭'),
      nlpi: getNlpiLink('記憶與遺忘的鬥爭')
    }
  },
  {
    id: 'csv-27',
    title: '帝國主義下的臺灣',
    author: '矢內原忠雄',
    description: '經典的殖民經濟分析，揭露帝國主義如何改造台灣社會。',
    coverImage: 'https://www.books.com.tw/img/001/093/66/0010936624.jpg',
    level: 'advanced',
    tags: ['通論', '殖民經濟'],
    links: {
      books: 'https://www.books.com.tw/products/0010936624',
      eslite: getEsliteSearch('帝國主義下的臺灣'),
      kingstone: getKingstoneSearch('帝國主義下的臺灣'),
      nlpi: getNlpiLink('帝國主義下的臺灣')
    }
  },
  {
    id: 'csv-28',
    title: '台灣經濟四百年',
    author: '吳聰敏',
    description: '從經濟史角度剖析台灣演變，提供紮實的數據支撐。',
    coverImage: 'https://www.books.com.tw/img/001/094/91/0010949161.jpg',
    level: 'advanced',
    tags: ['通論', '經濟史'],
    links: {
      books: 'https://www.books.com.tw/products/0010949161',
      eslite: getEsliteSearch('台灣經濟四百年'),
      kingstone: getKingstoneSearch('台灣經濟四百年'),
      nlpi: getNlpiLink('台灣經濟四百年')
    }
  },
  {
    id: 'csv-29',
    title: '他們沒在寫小說的時候',
    author: '朱宥勳',
    description: '戒嚴台灣小說家群像，探討文學與政治的生存角力。',
    coverImage: 'https://www.books.com.tw/img/001/090/06/0010900615.jpg',
    level: 'basic',
    tags: ['文學', '白恐', '人物'],
    links: {
      books: 'https://www.books.com.tw/products/0010900615',
      eslite: getEsliteSearch('他們沒在寫小說的時候'),
      kingstone: getKingstoneSearch('他們沒在寫小說的時候'),
      nlpi: getNlpiLink('他們沒在寫小說的時候')
    }
  },
  {
    id: 'csv-30',
    title: '重構二二八：戰後美中體制',
    author: '陳翠蓮',
    description: '透過解密檔案，重新解讀二二八事件的國際背景。',
    coverImage: 'https://www.books.com.tw/img/001/074/39/0010743933.jpg',
    level: 'advanced',
    tags: ['通論', '二二八'],
    links: {
      books: 'https://www.books.com.tw/products/0010743933',
      eslite: getEsliteSearch('重構二二八'),
      kingstone: getKingstoneSearch('重構二二八'),
      nlpi: getNlpiLink('重構二二八')
    }
  },
  {
    id: 'csv-31',
    title: '激越與死滅：二二八世代民主路',
    author: '黃惠君',
    description: '深度紀錄二二八世代精英的追求與結局。',
    coverImage: 'https://www.books.com.tw/img/001/074/33/0010743399.jpg',
    level: 'advanced',
    tags: ['通論', '二二八'],
    links: {
      books: 'https://www.books.com.tw/products/0010743399',
      eslite: getEsliteSearch('激越與死滅'),
      kingstone: getKingstoneSearch('激越與死滅'),
      nlpi: getNlpiLink('激越與死滅')
    }
  },
  {
    id: 'csv-32',
    title: '政治檔案會說話：自由時代公民指南',
    author: '陳昱齊',
    description: '教導如何閱讀與判讀政治檔案，是實踐轉型正義的工具。',
    coverImage: 'https://www.books.com.tw/img/001/088/97/0010889799.jpg',
    level: 'advanced',
    tags: ['白恐', '檔案判讀'],
    links: {
      books: 'https://www.books.com.tw/products/0010889799',
      eslite: getEsliteSearch('政治檔案會說話'),
      kingstone: getKingstoneSearch('政治檔案會說話'),
      nlpi: getNlpiLink('政治檔案會說話')
    }
  },
  {
    id: 'csv-33',
    title: '永遠不再：威權體制下的壓迫與抵抗',
    author: '國家人權博物館',
    description: '2023年出版。集體記憶的威權歷史研究報告。',
    coverImage: 'https://www.books.com.tw/img/001/096/86/0010968624.jpg',
    level: 'advanced',
    tags: ['通論', '人權史'],
    links: {
      books: 'https://www.books.com.tw/products/0010968624',
      eslite: getEsliteSearch('永遠不再'),
      kingstone: getKingstoneSearch('永遠不再'),
      nlpi: getNlpiLink('永遠不再')
    }
  }
];

export const CHILDREN_BOOKS: Book[] = [
  {
    id: 'c1',
    title: '愛唱歌的小熊',
    author: '吳易蓁',
    description: '以柔和的筆觸講述受難者阿寬的故事，帶領孩子認識歷史傷痕。',
    coverImage: 'https://www.books.com.tw/img/001/068/36/0010683679.jpg',
    level: 'basic',
    tags: ['文學', '白恐', '兒童繪本'],
    links: {
      books: 'https://search.books.com.tw/search/query/key/愛唱歌的小熊',
      eslite: getEsliteSearch('愛唱歌的小熊'),
      kingstone: getKingstoneSearch('愛唱歌的小熊'),
      nlpi: getNlpiLink('愛唱歌的小熊')
    }
  }
];

export const DOCUMENTARIES: Documentary[] = [
  {
    id: 'd1',
    title: '牽阮的手',
    director: '莊益增、顏蘭權',
    year: '2010',
    description: '以田朝明醫師與田孟淑女士的愛情故事為線索，交織出台灣民主運動歷程。',
    thumbnail: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1000'
  }
];
