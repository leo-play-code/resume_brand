<div align="center">

**Language / 語言**

[English](#english) · [中文](#中文)

</div>

---

<h2 id="english">English</h2>

# resume_brand — Full-Stack Personal Portfolio

A full-stack personal portfolio & resume website with a CMS-style admin dashboard. Built with Next.js App Router, GSAP animations, and a Terminal Manifesto dark-neon aesthetic. Content is managed through a protected admin panel backed by PostgreSQL.

## Features

- **Bilingual UI** — URL-based i18n routing (`/zh`, `/en`) via next-intl
- **GSAP Animations** — Scroll-triggered reveals, marquee, custom neon cursor
- **Smooth Scrolling** — Lenis-powered buttery scroll
- **Admin Dashboard** — GitHub OAuth protected CMS for all content sections
  - Projects — CRUD with drag-and-drop reordering, hero video or live JS demo
  - Experience — Work & education timeline management
  - Tech Stack — Auto-synced from projects, with Simple Icons & brand colors
  - Settings — Site-wide theme color configuration
- **Live JS Demo Sandbox** — Renders React JSX demos in-browser via Babel
- **File Upload** — Video hosting via Vercel Blob
- **140+ Preset Skills** — Searchable skill picker with category filtering

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Animation | GSAP 3.15, Lenis 1.3 |
| Icons | Lucide React, Simple Icons (CDN) |
| Drag & Drop | dnd-kit |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 6 |
| Auth | NextAuth.js 4 (GitHub OAuth) |
| i18n | next-intl 4.9 |
| File Storage | Vercel Blob |
| Testing | Vitest 4, Testing Library |
| Deployment | Vercel |

## Prerequisites

- Node.js 20+
- PostgreSQL database (local or [Supabase](https://supabase.com))
- GitHub OAuth App (for admin login)
- Vercel Blob token (for video uploads)

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/leo-play-code/resume_brand.git
cd resume_brand
npm install
```

### 2. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```env
DATABASE_URL=postgresql://...

NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

GITHUB_CLIENT_ID=<from GitHub OAuth App>
GITHUB_CLIENT_SECRET=<from GitHub OAuth App>

BLOB_READ_WRITE_TOKEN=<from Vercel Blob>
```

### 3. Database Setup

```bash
# Push schema to database
npx prisma db push

# Seed with default content
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

Admin dashboard: [http://localhost:3002/admin](http://localhost:3002/admin)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3002 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run type-check` | TypeScript type check |
| `npm test` | Run Vitest test suite |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db seed` | Seed database with default data |

## Project Structure

```
resume_brand/
├── prisma/
│   ├── schema.prisma        # Database models
│   ├── seed.ts              # Seed data
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── [locale]/        # Public portfolio (/zh, /en)
│   │   ├── admin/           # Protected CMS dashboard
│   │   │   ├── projects/
│   │   │   ├── experience/
│   │   │   ├── tech/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── auth/        # NextAuth handler
│   │       ├── demo/        # Live JS sandbox renderer
│   │       ├── skills/      # Skills API
│   │       └── upload/      # Vercel Blob upload
│   ├── components/
│   │   ├── layout/          # Navbar
│   │   ├── providers/       # Session, Theme, Lenis
│   │   ├── sections/        # Hero, Projects, TechStack, Timeline, Contact
│   │   └── ui/              # 20+ reusable components
│   ├── lib/
│   │   ├── actions/         # Server Actions (CRUD)
│   │   ├── data/            # Static seed data
│   │   └── utils/           # Color, auth, prisma helpers
│   ├── i18n/                # next-intl config
│   └── types/               # Shared TypeScript types
└── specs/                   # Project specification docs
```

## Database Models

| Model | Description |
|---|---|
| `Project` | Portfolio projects with bilingual content, hero type, links |
| `TechStack` | Technologies with Simple Icons slug and brand color |
| `Experience` | Work and education timeline entries |
| `Skill` | 140+ preset skills with categories (custom + presets) |
| `SiteSettings` | Global theme colors (dark/light backgrounds) |

## Deployment

Deploy to Vercel with one click:

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set all environment variables in Vercel dashboard
4. Add Vercel Blob storage to your project
5. Run `npx prisma db push` against your production database

## Contact

- Email: leo56029132@gmail.com
- GitHub: [leo-play-code](https://github.com/leo-play-code)

---

<h2 id="中文">中文</h2>

# resume_brand — 全端個人作品集

具備 CMS 後台管理的全端個人作品集 & 履歷網站。以 Next.js App Router 建構，搭配 GSAP 動畫與 Terminal Manifesto 深色霓虹美學。所有內容透過 GitHub OAuth 保護的後台管理介面進行管理，資料庫使用 PostgreSQL。

## 功能特色

- **雙語介面** — 透過 next-intl 實現 URL 路由式 i18n（`/zh`、`/en`）
- **GSAP 動畫** — 滾動觸發進場動畫、跑馬燈、霓虹自訂游標
- **絲滑滾動** — Lenis 提供流暢的滾動體驗
- **後台管理** — GitHub OAuth 保護的 CMS，管理所有內容區塊
  - 作品集 — 支援拖放排序的 CRUD，可設定 Hero 為影片或即時 JS Demo
  - 工作經歷 — 工作與學歷時間軸管理
  - 技術棧 — 從作品集自動同步，含 Simple Icons 與品牌色
  - 設定 — 全站主題顏色配置
- **即時 JS Demo 沙盒** — 透過 Babel 在瀏覽器中渲染 React JSX Demo
- **檔案上傳** — 影片透過 Vercel Blob 儲存
- **140+ 預設技能** — 支援搜尋與分類篩選的技能選擇器

## 技術棧

| 層級 | 技術 |
|---|---|
| 框架 | Next.js 16（App Router、Server Components） |
| 語言 | TypeScript 5 |
| UI | React 19、Tailwind CSS 4 |
| 動畫 | GSAP 3.15、Lenis 1.3 |
| 圖示 | Lucide React、Simple Icons（CDN） |
| 拖放 | dnd-kit |
| 資料庫 | PostgreSQL（Supabase） |
| ORM | Prisma 6 |
| 驗證 | NextAuth.js 4（GitHub OAuth） |
| 多語言 | next-intl 4.9 |
| 檔案儲存 | Vercel Blob |
| 測試 | Vitest 4、Testing Library |
| 部署 | Vercel |

## 開發前置需求

- Node.js 20+
- PostgreSQL 資料庫（本地或 [Supabase](https://supabase.com)）
- GitHub OAuth App（用於後台登入）
- Vercel Blob token（用於影片上傳）

## 快速開始

### 1. 克隆並安裝

```bash
git clone https://github.com/leo-play-code/resume_brand.git
cd resume_brand
npm install
```

### 2. 環境變數

複製範例檔並填入你的設定：

```bash
cp .env.example .env.local
```

必填變數：

```env
DATABASE_URL=postgresql://...

NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=<使用此指令產生：openssl rand -base64 32>

GITHUB_CLIENT_ID=<來自 GitHub OAuth App>
GITHUB_CLIENT_SECRET=<來自 GitHub OAuth App>

BLOB_READ_WRITE_TOKEN=<來自 Vercel Blob>
```

### 3. 資料庫設定

```bash
# 推送 schema 到資料庫
npx prisma db push

# 填入預設資料
npx prisma db seed
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

在瀏覽器開啟 [http://localhost:3002](http://localhost:3002)。

後台管理：[http://localhost:3002/admin](http://localhost:3002/admin)

## 指令

| 指令 | 說明 |
|---|---|
| `npm run dev` | 啟動開發伺服器（port 3002） |
| `npm run build` | 建置正式版本 |
| `npm run start` | 啟動正式伺服器 |
| `npm run type-check` | TypeScript 型別檢查 |
| `npm test` | 執行 Vitest 測試套件 |
| `npx prisma studio` | 開啟 Prisma 資料庫 GUI |
| `npx prisma db seed` | 填入預設資料 |

## 專案結構

```
resume_brand/
├── prisma/
│   ├── schema.prisma        # 資料庫模型
│   ├── seed.ts              # 預設資料
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── [locale]/        # 公開作品集頁面（/zh、/en）
│   │   ├── admin/           # 受保護的後台
│   │   │   ├── projects/
│   │   │   ├── experience/
│   │   │   ├── tech/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── auth/        # NextAuth 處理器
│   │       ├── demo/        # 即時 JS 沙盒渲染
│   │       ├── skills/      # 技能 API
│   │       └── upload/      # Vercel Blob 上傳
│   ├── components/
│   │   ├── layout/          # Navbar
│   │   ├── providers/       # Session、Theme、Lenis
│   │   ├── sections/        # Hero、Projects、TechStack、Timeline、Contact
│   │   └── ui/              # 20+ 可重用元件
│   ├── lib/
│   │   ├── actions/         # Server Actions（CRUD）
│   │   ├── data/            # 靜態預設資料
│   │   └── utils/           # 顏色、auth、prisma 工具
│   ├── i18n/                # next-intl 設定
│   └── types/               # 共用 TypeScript 型別
└── specs/                   # 專案規格文件
```

## 資料庫模型

| 模型 | 說明 |
|---|---|
| `Project` | 作品集項目，含雙語內容、Hero 類型、連結 |
| `TechStack` | 技術項目，含 Simple Icons slug 與品牌色 |
| `Experience` | 工作與學歷時間軸條目 |
| `Skill` | 140+ 預設技能，含分類（自訂 + 預設） |
| `SiteSettings` | 全站主題顏色（深色/淺色背景） |

## 部署

部署到 Vercel：

1. Push 到 GitHub
2. 在 [vercel.com](https://vercel.com) 匯入 repo
3. 在 Vercel dashboard 設定所有環境變數
4. 為專案新增 Vercel Blob 儲存
5. 對正式資料庫執行 `npx prisma db push`

## 聯絡

- Email: leo56029132@gmail.com
- GitHub: [leo-play-code](https://github.com/leo-play-code)
