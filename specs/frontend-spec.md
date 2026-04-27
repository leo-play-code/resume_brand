# Frontend Spec

## Design System
深色霓虹主題 (`--background: #050510`)，紫色 accent (`--accent-purple: #8b5cf6`)。
所有 admin 組件沿用現有 dark glass 風格。

---

## Feature 1: Cursor Pointer on Hover (全域)

**修改檔案**: `src/app/globals.css`

在 `/* ─── Base ─── */` 區塊加入：

```css
button, a, select,
[role="button"], [role="tab"], [role="option"],
label[for], summary {
  cursor: pointer;
}
```

這樣確保所有互動元素都顯示正確 cursor，不需要逐個加 `cursor-pointer` class。

---

## Feature 2: ComboboxSelect Component (共用)

**新建**: `src/components/ui/ComboboxSelect.tsx`

可搜尋的下拉選擇器，支援：
- 鍵入過濾
- 選中後顯示選取值
- 支援 "允許自由輸入" 模式（allowFreeInput prop）
- keyboard navigation

```tsx
interface Props {
  label: string
  name: string           // form field name
  options: { value: string; labelZh: string; labelEn?: string }[]
  placeholder?: string
  allowFreeInput?: boolean  // 允許不在清單中的值（for 系所、自訂）
  defaultValue?: string
  required?: boolean
}
```

**Behavior**:
- 點擊 → 展開 dropdown
- 輸入文字 → 即時過濾（中文 + 英文 ILIKE）
- 選中 → 關閉 dropdown，顯示選取值
- allowFreeInput=true 時 → 若搜尋無結果，顯示 "使用 [輸入值]" 選項
- 點擊外部 → 收合

---

## Feature 3: UniversityPicker (學校選擇器)

**新建**: `src/components/ui/UniversityPicker.tsx`

組合多個 ComboboxSelect：
1. **學歷層級** — 高中 / 學士 / 碩士 / 博士（select，必填）
2. **學校名稱** — ComboboxSelect，資料來自 `src/lib/data/universities.ts`
   - 顯示中文名 + 英文名作為 subtitle
   - allowFreeInput=true（支援不在清單的學校）
3. **系所** — ComboboxSelect，資料來自 `src/lib/data/departments.ts`
   - allowFreeInput=true（支援自訂系所名）

**Hidden inputs**: 分別輸出 `degree_level`, `school_name_zh`, `school_name_en`, `department`

---

## Feature 4: SkillPicker Component

**新建**: `src/components/ui/SkillPicker.tsx`

從技能庫選技能（含搜尋 + 新增自訂）。

```tsx
interface Props {
  name: string        // form field name（comma-separated 技能名稱）
  defaultValue?: string[]
}
```

**Behavior**:
- 上方顯示已選 tags（可 X 移除）
- 搜尋框即時呼叫 `/api/skills?q=...`（debounce 200ms）
- 結果以 category 分組顯示
- 若搜尋無結果 → 顯示 "新增自訂技能：[輸入值]" 按鈕
  - 點擊 → 呼叫 `addSkill` server action → 自動加入選擇
- 選取後加入 tags
- value 以逗號串接輸出到隱藏 input

---

## Modified Components

### ExperienceAdminClient
**修改**: `src/app/admin/experience/ExperienceAdminClient.tsx`

- 表單內「Company / School」和「Role / Degree」文字輸入，**當 type=education 時**改用 `UniversityPicker`
- 當 type=work 時維持原有文字輸入（不變）
- 需要 controlled select for type，動態切換 UI

```
type === "education" → 顯示 UniversityPicker
type === "work"      → 顯示原本 Company/Role 文字輸入
```

### TechAdminClient
**修改**: `src/app/admin/tech\TechAdminClient.tsx`

- 「Name」輸入欄改用 `SkillPicker`（單選模式，name="name"）
- 在表單下方加 "管理自訂技能" 區塊（列出 isCustom=true 的技能，可刪除）

### ProjectsAdminClient
**修改**: `src/app/admin/projects/ProjectsAdminClient.tsx`

- 「Tech stack」欄改用 `SkillPicker`（多選，輸出逗號串接）

---

## File Structure

```
src/
  components/
    ui/
      ComboboxSelect.tsx    ← 新建（共用可搜尋下拉）
      UniversityPicker.tsx  ← 新建（大學 + 系所 + 學歷）
      SkillPicker.tsx       ← 新建（技能選擇 + 自訂新增）
  lib/
    data/
      universities.ts       ← 新建（160 台灣大學 zh+en）
      departments.ts        ← 新建（系所清單）
      degree-levels.ts      ← 新建（學歷層級）
  app/
    admin/
      experience/
        ExperienceAdminClient.tsx  ← 修改
      tech/
        TechAdminClient.tsx        ← 修改
      projects/
        ProjectsAdminClient.tsx    ← 修改
    api/
      skills/
        route.ts            ← 新建（GET /api/skills）
```

---

## Acceptance Criteria

- [ ] 所有 button / a / select / role=button 元素 hover 時顯示 pointer cursor
- [ ] ExperienceAdmin 切到 education type 時，School 和 Degree 欄變為 picker
- [ ] UniversityPicker 可搜尋中文或英文校名
- [ ] UniversityPicker 支援填入清單外的學校
- [ ] 學歷層級包含：高中、學士、碩士、博士
- [ ] TechAdmin 和 ProjectAdmin 的技能欄可搜尋技能庫
- [ ] 技能庫包含程式語言、辦公室工具（Word, Excel, AutoCAD...）、設計工具等跨領域技能
- [ ] 使用者可新增自訂技能（自動儲存 DB）
- [ ] 技能 picker 顯示分類標籤分組
- [ ] 所有新元件 mobile responsive
- [ ] 與現有深色霓虹主題視覺一致

---

---

## Feature 5: Admin 背景色與前台同步（Fix）

**修改**: `src/app/admin/layout.tsx`

Admin layout 目前硬編碼 `bg-[#07070f]`，與前台 `--background: #050510` 不一致。
改為使用 `bg-base` (`background: var(--background)`) 讓兩者共用同一個 CSS 變數。

同時 sidebar 的 `bg-[#050510]` 也改為 `bg-base`，border 統一改用 `border-theme`。

---

## Feature 6: 全站背景色設定（Admin Settings 頁）

### 新建 `src/app/admin/settings/page.tsx`
Admin 側欄加入 "Settings" 連結。Settings 頁面包含：
- 背景色區塊：Dark 模式背景色 + Light 模式背景色，各有一個 `<input type="color">` + hex 文字輸入框
- 儲存後呼叫 `updateSiteSettings` action
- 儲存成功顯示 toast/成功訊息

### 新建 `src/app/admin/settings/SettingsAdminClient.tsx`
Client component，Props:
```ts
interface Props {
  settings: { backgroundDark: string; backgroundLight: string }
  updateSettings: (formData: FormData) => Promise<void>
}
```
- 兩個顏色欄位：color picker + hex input 雙向同步
- `useTransition` 處理儲存 loading
- 儲存成功後顯示 "✓ Saved" feedback（2 秒後消失）

### 修改 `src/app/layout.tsx`
從 DB 讀取 `SiteSettings`，將 `backgroundDark` / `backgroundLight` 注入為 inline CSS 覆蓋 `:root` 變數：
```tsx
// 在 <html> 上加 style prop
style={{
  '--background': settings.backgroundDark,  // 或根據 theme 選擇
} as React.CSSProperties}
```
實際上需要同時設定 dark 和 light 的值，可以在 `<head>` 裡注入一段 `<style>` 標籤：
```html
<style>{`:root { --background: ${settings.backgroundDark}; } [data-theme="light"] { --background: ${settings.backgroundLight}; }`}</style>
```

### 修改 `src/app/admin/layout.tsx`
在 NAV 陣列加入 Settings 連結：
```ts
{ href: "/admin/settings", label: "Settings" }
```

---

## Feature 7: Loading States（骨架屏 + 導航進度）

### 新建 `src/components/ui/LoadingSpinner.tsx`
通用 loading spinner 元件，可傳入 size prop（sm / md / lg）。
Deep glass 風格，使用 CSS `border` 旋轉動畫，紫色 accent。

### 新建 `src/components/ui/NavigationProgress.tsx`
頁面路由切換時顯示頂部進度條（NProgress 風格）。
- `"use client"` 元件
- 使用 `usePathname()` + `useEffect` 偵測路由變化
- 路由開始切換 → 顯示頂部紫色進度條，0% → 80%（緩慢）
- 路由完成 → 快速到 100% 後淡出
- 加入 `src/app/layout.tsx` 的 `<Providers>` 內部

### loading.tsx 檔案（Next.js App Router Suspense）

**`src/app/loading.tsx`** — 首頁 loading skeleton  
顯示一個全螢幕佔位動畫（pulse skeleton）。

**`src/app/admin/loading.tsx`** — Admin 通用 loading  
```tsx
// 顯示 sidebar skeleton + content skeleton
// LoadingSpinner 置中
```

**`src/app/admin/projects/loading.tsx`** — Projects 頁面 loading  
**`src/app/admin/tech/loading.tsx`** — Tech 頁面 loading  
**`src/app/admin/experience/loading.tsx`** — Experience 頁面 loading  
**`src/app/admin/settings/loading.tsx`** — Settings 頁面 loading

每個 admin loading.tsx 顯示統一的 skeleton card 列表（3 個虛線 placeholder cards）。

### 優化現有 Admin mutation feedback
確認所有 admin client 的 `isPending` 狀態下，Submit 按鈕顯示 spinner icon 而非只是文字 "Saving…"。
修改：`ExperienceAdminClient`, `TechAdminClient`, `ProjectsAdminClient`，在 isPending 時 button 加上 `<LoadingSpinner size="sm" />` + 文字。

---

## File Structure（新增）

```
src/
  app/
    loading.tsx                        ← 新建
    admin/
      loading.tsx                      ← 新建
      settings/
        page.tsx                       ← 新建
        SettingsAdminClient.tsx        ← 新建
        loading.tsx                    ← 新建
      projects/loading.tsx             ← 新建
      tech/loading.tsx                 ← 新建
      experience/loading.tsx           ← 新建
      layout.tsx                       ← 修改（顏色 + Settings nav link）
    layout.tsx                         ← 修改（注入 DB 背景色）
  components/
    ui/
      LoadingSpinner.tsx               ← 新建
      NavigationProgress.tsx           ← 新建
  lib/
    actions/
      settings.ts                      ← 新建
```

---

---

## Feature 11: TechStack Icons + Auto-Sync from Projects

### 修改 `src/lib/data/tech-stack.ts`
`TechItem` 介面加入 `icon?: string`：
```ts
export interface TechItem {
  name: string;
  color: string;
  icon?: string;   // Simple Icons slug
}
```

### 修改 `src/app/page.tsx`
DB TechStack mapping 加入 `icon` 欄位：
```ts
dbTech.map(t => ({ name: t.name, color: t.color, icon: t.icon ?? undefined }))
```

### 修改 `src/components/ui/TechMarquee.tsx`
將 color dot 改為：
- `icon` 有值 → `<img src="https://cdn.simpleicons.org/{icon}" alt={name} className="w-4 h-4 object-contain" />`
- `icon` 為 null/undefined → 保留原有 color dot（fallback）

```tsx
{tech.icon ? (
  <img
    src={`https://cdn.simpleicons.org/${tech.icon}`}
    alt={tech.name}
    className="w-4 h-4 object-contain shrink-0"
  />
) : (
  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tech.color }} />
)}
```

---

---

## Feature 12: Bilingual Support（中英切換）

### 依賴安裝
```bash
npm install next-intl
```

### 新建 `messages/zh.json` 與 `messages/en.json`
靜態翻譯文字，結構：
```json
{
  "nav": { "about": "關於/About", "projects": "作品/Projects", "experience": "經歷/Experience", "contact": "聯絡/Contact" },
  "hero": {
    "greeting": "你好，我是 / Hello, I'm",
    "roles": ["全端工程師/Full Stack Engineer", "AI 工具開發者/AI Tools Builder", "開源貢獻者/Open Source Contributor"],
    "cta_projects": "查看作品/View Projects",
    "cta_contact": "聯絡我/Contact Me",
    "scroll": "滾動/SCROLL",
    "tagline": "[中文 tagline] / [English tagline]"
  },
  "projects": { "eyebrow": "作品集/Work", "title": "精選作品/Featured Projects", "subtitle": "..." },
  "experience": { "eyebrow": "旅程/Journey", "title": "工作經歷/Experience" },
  "contact": { "eyebrow": "聯絡/Contact", "title_1": "一起/Let's work", "title_2": "合作/together.", "subtitle": "...", "footer": "Built with Next.js & GSAP." }
}
```

### 新建 `src/i18n/request.ts`
next-intl server 設定檔（getRequestConfig）。

### 新建 `src/middleware.ts`
```ts
// next-intl createNavigation + 排除 /admin, /api, /_next, /favicon.ico
export const config = {
  matcher: ['/((?!admin|api|_next|favicon.ico|videos|.*\\..*).*)']
}
```
支援 locales: ['zh', 'en']，defaultLocale: 'zh'。

### 遷移 `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- 接收 `{ params: { locale } }` 參數
- getData(locale) 回傳 locale-aware 資料
- setRequestLocale(locale) (next-intl static rendering)

### 新建 `src/app/[locale]/layout.tsx`
```tsx
import { NextIntlClientProvider } from 'next-intl'
// 載入對應 messages，包裹 children
// setRequestLocale(locale)
```

### 修改 `src/app/layout.tsx`（根 layout）
移除直接 render 內容，改為提供最小 html/body 包裹（locale layout 負責 NextIntlClientProvider）。

### 修改 `src/components/sections/HeroSection.tsx`
- `useTranslations('hero')` 替換所有硬編碼字串
- ROLES 陣列改從 `t.raw('roles')` 讀取（陣列型翻譯）

### 修改 `src/components/sections/ProjectsSection.tsx`
- `useTranslations('projects')` 替換 eyebrow、title、subtitle

### 修改 `src/components/sections/TimelineSection.tsx`
- `useTranslations('experience')` 替換 eyebrow、title

### 修改 `src/components/sections/ContactSection.tsx`
- `useTranslations('contact')` 替換所有靜態文字

### 修改 `src/components/layout/Navbar.tsx`
- `useTranslations('nav')` 替換 NAV_LINKS 的 label
- 加入語言切換按鈕（`ZH | EN`）在 theme toggle 旁
  - 讀取目前 locale（`useLocale()` from next-intl）
  - 點擊切換 → `router.replace(pathname, { locale: 'en' | 'zh' })`

### 修改 `src/app/admin/projects/ProjectsAdminClient.tsx`
Add / Edit 表單各加三個 EN 欄位（可選）：
- Name (EN)：`name_en`
- Short description (EN)：`description_en`
- Long description (EN)：`long_description_en`
放在對應 ZH 欄位下方，標記 `(English, optional)`

### 修改 `src/app/admin/experience/ExperienceAdminClient.tsx`
Add 表單加兩個 EN 欄位：
- Role (EN)：`role_en`
- Description bullets (EN)：`description_en`（textarea，一行一個 bullet）

### File Structure（新增）
```
messages/
  zh.json
  en.json
src/
  middleware.ts              ← 新建
  i18n/
    request.ts               ← 新建
  app/
    [locale]/
      layout.tsx             ← 新建
      page.tsx               ← 移動自 app/page.tsx
    layout.tsx               ← 修改（只保留根 html/body）
```

---

## Task Status

### Done (Feature 12 — Bilingual i18n)
- [x] [i18n] 安裝 `next-intl`
- [x] [i18n] 新建 `messages/zh.json` + `messages/en.json`（含所有靜態文字中英對照）
- [x] [i18n] 新建 `src/i18n/request.ts`（next-intl getRequestConfig）
- [x] [i18n] 新建 `src/middleware.ts`（locale routing，排除 /admin /api /_next）
- [x] [i18n] 新建 `src/app/[locale]/layout.tsx`（NextIntlClientProvider）
- [x] [i18n] 遷移 `src/app/page.tsx` → `src/app/[locale]/page.tsx`（接收 locale param，getData(locale)）
- [x] [i18n] 修改 `src/app/layout.tsx`（根 layout 最小化）
- [x] [i18n] 修改 `HeroSection.tsx` — useTranslations('hero')
- [x] [i18n] 修改 `ProjectsSection.tsx` — useTranslations('projects')
- [x] [i18n] 修改 `TimelineSection.tsx` — useTranslations('experience')
- [x] [i18n] 修改 `ContactSection.tsx` — useTranslations('contact')
- [x] [i18n] 修改 `Navbar.tsx` — useTranslations('nav') + ZH/EN 切換按鈕
- [x] [i18n] 修改 `ProjectsAdminClient.tsx` — 加入 nameEn / descriptionEn / longDescriptionEn 欄位
- [x] [i18n] 修改 `ExperienceAdminClient.tsx` — 加入 roleEn / descriptionEn 欄位

### Done (Feature 11 — TechStack Icons)
- [x] [Feature 11] 修改 `src/lib/data/tech-stack.ts` — TechItem 加 `icon?: string`
- [x] [Feature 11] 修改 `src/app/page.tsx` — DB TechStack mapping 帶入 icon 欄位
- [x] [Feature 11] 修改 `src/components/ui/TechMarquee.tsx` — icon 有值時顯示 Simple Icons img

### Done (Feature 10 — Edit Projects + JS Demo JSX Fix)
- [x] 修改 `src/app/admin/projects/page.tsx` — 傳入 `updateProject` prop 至 ProjectsAdminClient
- [x] 修改 `src/app/admin/projects/ProjectsAdminClient.tsx` — 加入 Pencil 編輯按鈕 + inline 編輯表單（含 heroType/heroJsCode 欄位預填）
- [x] 修改 `src/lib/demo-template.ts` — 加入 Babel standalone 轉譯 JSX；改用絕對 CDN URL 取代 importmap（解決 Blob URL 不繼承 importmap 的問題）
- [x] 修改 `src/app/api/demo/[projectId]/route.ts` — 移除 as any cast（需 prisma generate 後生效）

### Done (Feature 9 — JS Demo Hero)
- [x] 修改 `src/app/admin/projects/ProjectsAdminClient.tsx` — 加入 heroType toggle (mp4/js-demo) + heroJsCode 程式碼 textarea
- [x] 修改 `src/components/ui/ProjectCard.tsx` — media 區塊：heroType==="js-demo" 時渲染 `<iframe src="/api/demo/[id]" />`
- [x] 新建 `src/lib/demo-template.ts` — `buildDemoHtml(jsCode: string): string` 工具函式

### Done (Feature 8 — Adaptive Theme Colors)
- [x] 新建 `src/lib/utils/color.ts` — `isLightColor(hex)` + `buildCssVars(bg, isLight)` 工具函式
- [x] 修改 `src/app/layout.tsx` — 用 `buildCssVars` 注入完整 CSS vars（包含 `--foreground`、`--fg-*`、`--surface`、`--border`）
- [x] 修改 `src/app/globals.css` — 移除 `.admin-shell` 硬覆蓋區塊
- [x] 修改 `src/app/admin/layout.tsx` — 移除 `admin-shell` class
- [x] 取代 Admin 全站 `text-white` → `text-fg`（所有 admin 子檔案）
- [x] 取代 Admin 全站 `text-white/50` / `text-white/35` / `text-white/30` / `text-white/25` / `text-white/20` → `text-fg-50` / `text-fg-35` / `text-fg-35` / `text-fg-25` / `text-fg-20`
- [x] 取代 Admin 全站 `hover:text-white` → `hover:text-fg`
- [x] 取代 Admin 全站 `bg-white/[0.02]` / `bg-white/[0.03]` / `bg-white/[0.04]` → `bg-surface` / `bg-surface` / `bg-surface-2`

### Done (Feature 5–7)
- [x] 修改 `src/app/admin/layout.tsx` — 硬編碼色改用 `bg-base` / `border-theme`，加 Settings nav
- [x] 新建 `src/app/admin/settings/page.tsx` + `SettingsAdminClient.tsx`
- [x] 修改 `src/app/layout.tsx` — 讀 DB SiteSettings，注入背景色為 CSS var
- [x] 新建 `src/components/ui/LoadingSpinner.tsx`
- [x] 新建 `src/components/ui/NavigationProgress.tsx`，加入 `layout.tsx`
- [x] 新建 `src/app/loading.tsx`
- [x] 新建 `src/app/admin/loading.tsx`
- [x] 新建 `src/app/admin/projects/loading.tsx`
- [x] 新建 `src/app/admin/tech/loading.tsx`
- [x] 新建 `src/app/admin/experience/loading.tsx`
- [x] 新建 `src/app/admin/settings/loading.tsx`
- [x] 優化 mutation feedback — 三個 Admin client 的 isPending button 加 LoadingSpinner

### Done
- [x] `src/app/globals.css` — 加入 cursor:pointer 全域規則
- [x] 新建 `src/components/ui/ComboboxSelect.tsx`
- [x] 新建 `src/components/ui/UniversityPicker.tsx`
- [x] 新建 `src/components/ui/SkillPicker.tsx`
- [x] 新建 `src/lib/data/universities.ts` (160 所台灣大學)
- [x] 新建 `src/lib/data/departments.ts`
- [x] 新建 `src/lib/data/degree-levels.ts`
- [x] 修改 `ExperienceAdminClient.tsx` — 加入 education picker 切換邏輯
- [x] 修改 `TechAdminClient.tsx` — Name 欄改用 SkillPicker
- [x] 修改 `ProjectsAdminClient.tsx` — Tech stack 欄改用 SkillPicker
