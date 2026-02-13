# 民主富二代補課小站 (Democracy Remedial Station)

這是一個關於台灣民主歷程與轉型正義的書籍/影音策展網站。網站將自由視為一份珍貴的家業，並將當代享受民主自由的人們稱為「民主富二代」。本站旨在透過分階的閱讀計畫，幫助使用者認識這份遺產的來歷。

This is a curated website for books and documentaries related to Taiwan's democratic history and transitional justice. The website views freedom as a precious family legacy and refers to people today who enjoy democracy and freedom as "Second Generation Democracy Heirs" (民主富二代). The site aims to help users understand the origins of this legacy through a tiered reading plan.

## 功能特色 / Features

- **分階書單 (Tiered Book Lists):**
    - **初階 (Basic):** 從聽故事開始，適合歷史小白。
    - **中階 (Intermediate):** 把零散的歷史碎片拼成大藍圖。
    - **進階 (Advanced):** 史料判讀與深度政經分析。
- **兒童與青少年專區 (Children & Youth Section):** 親子共讀、歷史啟蒙書單。
- **紀錄片專區 (Documentaries):** 影像紀錄。
- **社群共編 (Community Contribution):** 連結至 Google Form 收集推薦書單。
- **標籤篩選 (Tag Filtering):** 可透過標籤快速尋找相關書籍。

## 技術棧 / Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router DOM

## 本地開發 / Development

1.  **安裝依賴 / Install Dependencies:**
    ```bash
    npm install
    ```

2.  **啟動開發伺服器 / Start Dev Server:**
    ```bash
    npm run dev
    ```

3.  **建置 / Build:**
    ```bash
    npm run build
    ```

## 資料來源與排序邏輯 / Data Source & Sorting

本專案的所有書籍與影音資料皆以 **Google Sheet** 為單一真理來源 (Single Source of Truth, SSOT)，請勿直接修改 `books_data.ts`。

- **資料來源 (Source):** [Google Sheet Link](https://docs.google.com/spreadsheets/d/1Z0JUS0fw5SFaX1-oht6jEx5i8XI888vx5F9jm9BEggI/edit?gid=0#gid=0)
- **同步方式 (Sync):** 執行 `npm run sync` 可將試算表資料同步至本地專案。

### 排序邏輯 (Sorting Logic)

書籍排列採用 **兩級排序 (Two-Level Sorting)** 機制，以確保學習路徑的循序漸進：

1.  **第一級：難易度分組 (Primary: Level Mapping)**
    - 先依照「初中高階」欄位進行分組。
    - **順序：** 初階 (Basic) -> 中階 (Intermediate) -> 高階 (Advanced)。

2.  **第二級：自訂順序 (Secondary: Sort Order)**
    - 在同一個難易度群組內，依照試算表中的「排序」欄位 (數字) 進行升冪排列。
    - 數字越小，排序越前。

## 待辦事項 / Todo List

- [x] **推薦功能改版 (Revamp Recommendation):** 將「我要推薦」功能改成使用 Google Form: [Link](https://docs.google.com/forms/d/1HZPkLNFjrCWHlJ5qjLVhf6sM5AFGG5-w12R71jqt_PQ/edit)
- [x] **紀錄片資料維護 (Documentary Data):** 修正《牽阮的手》等紀錄片的 thumbnail 連結，改用官方海報或可靠來源。
- [x] **搜尋功能優化 (Enhanced Search):**
    - 增加對書名、作者的關鍵字搜尋功能 (目前僅支援標籤篩選)。
- [/] **書籍封面精準度 (Book Cover Accuracy):**
    - **現狀:** 部分書籍使用 Unsplash 預設圖。 -> which is unreliable
    - **發現:** 博客來封面圖具有規律的 Sharding 邏輯：`https://www.books.com.tw/img/[ID前3碼]/[ID中3碼]/[ID 7-8碼]/[完整ID].jpg`。 the product url should be already available in the sheet, eg: https://www.books.com.tw/products/0010910448?sloc=main
    - **進度:** 已建立 `utils/bookCover.ts` 處理博客來圖片邏輯，下一步需確保 Google Sheet 中包含正確的產品 ID。
- [ ] **多平台購書連結 (Multi-platform Purchase Links):** 新增網路書店和電子書按鈕（金石堂、誠品、momo、讀冊、kobo、讀墨）。
- [ ] **影音資料 SSOT 同步 (Video Data SSOT Sync):** 從 SSOT 匯入紀錄片影視片單，具有分類、說明、tag。
- [ ] **新增「關於本站」分頁 (About Page):** 新增關於本站的介紹與說明頁面。
- [ ] **細部 UI/UX 優化:**
    - 增加深色模式 (Dark Mode)。
    - 優化行動裝置體驗。
- [ ] **SEO 優化:**
    - 為每個頁面添加適當的 Meta Tags。

