# MASTER_SPEC.md — Resume Brand Portfolio

## Project Overview
個人作品集網站。深色霓虹主題，基於 Next.js + Tailwind CSS + Prisma + PostgreSQL。
管理員可透過 `/admin` 後台 CRUD 管理專案、技術棧、工作/學歷。

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, GSAP / Lenis
- **Backend**: Next.js Server Actions, NextAuth.js
- **Database**: PostgreSQL (Supabase), Prisma ORM
- **Deployment**: Vercel

## Core Features

### ✅ 已完成
- 首頁 Portfolio (Hero / TechStack Marquee / Projects / Timeline / Contact)
- Admin 後台：Projects CRUD, TechStack CRUD, Experience CRUD
- NextAuth 登入保護 Admin

### ✅ 已完成（Round 2）
- **[UX] Cursor pointer on hover** — 所有可點擊元素 hover 時顯示 cursor:pointer
- **[DATA] 台灣大學 + 系所 Picker** — 全台大學（中英文）、系所、學歷層級靜態清單
- **[DATA] 技能庫 + 自訂補充** — 140 筆預設技能（DB）+ 使用者自訂新增
- **[UI] ExperienceAdmin 學歷 Picker** — education 切換 UniversityPicker
- **[UI] SkillPicker Component** — TechAdmin + ProjectAdmin 可搜尋技能選擇器

### ✅ 已完成（Round 3）
- **[SETTINGS] 全站背景色管理** — Admin Settings 頁面可自訂 Dark/Light 背景色，存 DB，注入前台 CSS var
- **[UX] Admin 背景色同步** — Admin layout 改用 `var(--background)` 與前台一致
- **[PERF] Loading States** — `loading.tsx` 骨架屏 + NavigationProgress 頂部進度條
- **[PERF] Mutation feedback 優化** — Admin 表單 isPending 時顯示 LoadingSpinner

### ✅ 已完成（Round 4）
- **[THEME] Adaptive Text Color** — `buildCssVars()` 根據背景亮度自動計算 16 個 CSS vars；Admin 全站改用 `text-fg`/`bg-surface`

### ✅ 已完成（Round 5）
- **[MEDIA] JS Demo Hero** — Project 支援 heroType: "mp4" | "js-demo"，Admin 可貼入 React 元件程式碼，前台以 sandboxed `<iframe>` + `/api/demo/[id]` 渲染；Babel standalone 轉譯 JSX，絕對 CDN URL 解決 Blob URL importmap 限制
- **[ADMIN] Edit Projects** — Admin Projects 頁面每筆資料有 Pencil 按鈕，展開 inline 編輯表單（全欄位預填，含 heroType/heroJsCode）

### ✅ 已完成（Round 6）
- **[SYNC] Project Tech → TechStack Auto-Sync** — 儲存 project 時，techStack 陣列自動同步到 TechStack 表（case-insensitive dedup）；新技術自動補 Simple Icons slug + 品牌色
- **[UI] TechStack Icon Display** — TechMarquee 改顯示 Simple Icons icon（`https://cdn.simpleicons.org/{slug}`），無 icon 的技術 fallback 顯示 color dot

### 🚧 規劃中（Round 7）
- **[I18N] 中英文切換** — `next-intl` + URL locale routing（`/zh`, `/en`）；靜態 UI 文字用 translation files；DB 動態內容（Project/Experience）新增 EN 欄位，無 EN 時 fallback 中文；Navbar 加語言切換按鈕；Admin 表單加 EN 欄位輸入

## Spec Files
- [specs/data-models.md](specs/data-models.md)
- [specs/api-contracts.md](specs/api-contracts.md)
- [specs/frontend-spec.md](specs/frontend-spec.md)
- [specs/testing-spec.md](specs/testing-spec.md)
