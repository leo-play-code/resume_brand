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

### 🟡 進行中 / Pending
- **[UX] Cursor pointer on hover** — 所有可點擊元素 hover 時顯示 cursor:pointer
- **[DATA] 台灣大學 + 系所 Picker** — 提供全台大學（中英文）、系所、學歷層級的可選清單（靜態資料）
- **[DATA] 技能庫 + 自訂補充** — 內建全領域技能預設清單（DB 儲存，支援使用者新增自訂技能）
- **[UI] ExperienceAdmin 學歷 Picker** — type=education 時改用大學/系所 combobox
- **[UI] SkillPicker Component** — TechAdmin 和 ProjectAdmin 使用可搜尋技能選擇器

## Spec Files
- [specs/data-models.md](specs/data-models.md)
- [specs/api-contracts.md](specs/api-contracts.md)
- [specs/frontend-spec.md](specs/frontend-spec.md)
- [specs/testing-spec.md](specs/testing-spec.md)
