# API Contracts Spec

## Existing Endpoints

All CRUD is done via **Next.js Server Actions** (not REST), located in `src/lib/actions/`.

| Action File | Functions |
|---|---|
| `src/lib/actions/projects.ts` | `addProject`, `deleteProject` |
| `src/lib/actions/experience.ts` | `addExperience`, `deleteExperience` |
| `src/lib/actions/tech-stack.ts` | `addTechItem`, `deleteTechItem` |

---

## New Endpoints / Actions

### GET /api/skills
讓前端即時搜尋技能庫（含自訂技能）。

```
GET /api/skills?q=python&category=程式語言

Auth: public (read-only)
Query params:
  q?        string  — 搜尋關鍵字（nameZh 或 nameEn ILIKE）
  category? string  — 篩選分類
  limit?    number  — 預設 50

Response 200:
{
  data: Array<{
    id: string
    nameZh: string
    nameEn: string
    category: string
    isCustom: boolean
  }>
}

Business logic:
- 若 q 有值，WHERE nameZh ILIKE %q% OR nameEn ILIKE %q%
- 按 isCustom ASC (預設排前), nameZh ASC 排序
- isActive = true only
```

---

### Server Action: addSkill
使用者補充自訂技能（存入 DB，isCustom=true）。

```
Action: src/lib/actions/skills.ts → addSkill(formData: FormData)

Auth: Admin only (受 session 保護)
FormData fields:
  nameZh: string  — 必填
  nameEn: string  — 可選（預設同 nameZh）
  category: string — 必填

Business logic:
- 驗證 nameZh 不為空
- 檢查 nameZh 或 nameEn 是否已存在（防重複）
- 若已存在 → revalidatePath and return (no-op)
- 新增 Skill with isCustom=true
- revalidatePath('/admin/tech')

Error:
- 若重複，回傳 { error: "技能已存在" }
```

---

### Server Action: deleteSkill
管理員刪除自訂技能（只能刪 isCustom=true 的）。

```
Action: src/lib/actions/skills.ts → deleteSkill(id: string)

Auth: Admin only
Business logic:
- 查找 skill by id
- 若 isCustom=false → throw Error("Cannot delete preset skills")
- 刪除 skill
- revalidatePath('/admin/tech')
```

---

---

## New Actions (Round 2)

### Server Action: getSiteSettings
讀取全站設定（供 layout.tsx server side 呼叫）。

```
Action: src/lib/actions/settings.ts → getSiteSettings()

Auth: public (read-only, called by server component)
Returns: SiteSettings object
Business logic:
- prisma.siteSettings.findUnique({ where: { id: "singleton" } })
- 若不存在 → return default values { backgroundDark: "#050510", backgroundLight: "#f4f1ff" }
```

### Server Action: updateSiteSettings
管理員更新全站外觀設定。

```
Action: src/lib/actions/settings.ts → updateSiteSettings(formData: FormData)

Auth: Admin only
FormData fields:
  backgroundDark:  string — hex color, e.g. "#050510"
  backgroundLight: string — hex color, e.g. "#f4f1ff"

Business logic:
- Validate both are valid hex colors (#rrggbb format)
- prisma.siteSettings.upsert({ where: { id: "singleton" }, ... })
- revalidatePath('/') and revalidatePath('/admin/settings')
- return { success: true }
```

---

---

## New Endpoints (Round 3)

### GET /api/demo/[projectId]
將 DB 中儲存的 JS 元件程式碼包裝成完整 HTML，供 ProjectCard `<iframe>` 嵌入。

```
GET /api/demo/[projectId]

Auth: public
Response: text/html

Business logic:
1. prisma.project.findUnique({ where: { id: projectId } })
2. 若 heroType !== "js-demo" 或 heroJsCode 為空 → 回傳 404
3. 將 heroJsCode 嵌入 HTML template：
   - importmap: react, react-dom/client, framer-motion, lucide-react → esm.sh CDN
   - <div id="root" />
   - <script type="module">：動態偵測 default export，用 ReactDOM.createRoot 渲染
4. 回傳 200 Content-Type: text/html，Cache-Control: public, max-age=60

HTML template 注意事項：
- body background: transparent（配合 ProjectCard 主題）
- overflow: hidden（配合 aspect-video 容器）
- 包含 CSP meta 允許 esm.sh
```

---

## Modified Actions (Round 3)

### addProject（修改）
在 `src/lib/actions/projects.ts` 的 `addProject` function 加入：
- `formData.get('hero_type')` → 存入 `heroType`（預設 "mp4"）
- `formData.get('hero_js_code')` → 存入 `heroJsCode`（可 null）

## No Changes to Existing Actions

- `addExperience` / `deleteExperience` — 不需改 (UI 層 picker 組好資料後仍走 FormData)
- `addTechItem` / `deleteTechItem` — 不需改

---

---

## Modified Actions (Round 4)

### addProject / updateProject（修改）
在 `src/lib/actions/projects.ts` 的 `addProject` 和 `updateProject` 完成 DB 寫入後，呼叫 `syncProjectTechToStack(techStack)`：

```
Business logic of syncProjectTechToStack(names: string[]):
1. prisma.techStack.findMany() 取得所有現有 TechStack 名稱
2. 對每個 name in names:
   - case-insensitive 比對，若已存在 → skip
   - 若不存在 → 從 TECH_ICON_MAP 查找 { slug, color }
     - 有 map → 建立 TechStack { name, icon: slug, color, rowNumber, displayOrder }
     - 無 map → 建立 TechStack { name, icon: null, color: '#8b5cf6' (purple fallback), rowNumber, displayOrder }
   - rowNumber 交替：現有 row1 count <= row2 count → 加到 row1，否則 row2
   - displayOrder = 現有同 row 的最大 displayOrder + 1
3. revalidatePath('/')
```

---

---

## Modified Actions (Round 5 — i18n)

### addProject / updateProject（修改）
新增 EN 欄位支援：
```
新增 FormData fields:
  name_en:             String? — 英文名稱
  description_en:      String? — 英文 tagline
  long_description_en: String? — 英文 long description

業務邏輯：存入 nameEn / descriptionEn / longDescriptionEn
```

### addExperience（修改）
```
新增 FormData fields:
  role_en:        String? — 英文職稱
  description_en: String  — 英文 bullet points（換行分隔），存為 String[]

業務邏輯：
- description_en.split('\n').filter(Boolean) → descriptionEn 陣列
```

### getData() in src/app/[locale]/page.tsx（修改）
```
接收 locale: 'zh' | 'en' 參數
Project mapping：
  name = locale === 'en' ? (p.nameEn || p.name) : p.name
  description = locale === 'en' ? (p.descriptionEn || p.description) : p.description
  longDescription = locale === 'en' ? (p.longDescriptionEn || p.longDescription) : p.longDescription

Experience mapping：
  role = locale === 'en' ? (e.roleEn || e.role) : e.role
  description = locale === 'en' && e.descriptionEn.length > 0 ? e.descriptionEn : e.description
```

---

## Task Status

### Pending
- [x] 修改 `src/lib/actions/projects.ts` — addProject + updateProject 新增 nameEn / descriptionEn / longDescriptionEn 欄位
- [x] 修改 `src/lib/actions/experience.ts` — addExperience 新增 roleEn / descriptionEn 欄位

### Done
- [x] 新建 `src/lib/tech-icon-map.ts` — TECH_ICON_MAP：tech name → { slug, color }（涵蓋 60+ 常見技術）
- [x] 修改 `src/lib/actions/projects.ts` — `addProject` + `updateProject` 結尾呼叫 `syncProjectTechToStack`
- [x] 新增 `syncProjectTechToStack` 函式（可放在 `src/lib/actions/tech-stack.ts`）
- [x] Create `src/app/api/skills/route.ts` — GET handler with search + category filter
- [x] Create `src/lib/actions/skills.ts` — `addSkill`, `deleteSkill` server actions
- [x] Create `src/lib/actions/settings.ts` — `getSiteSettings`, `updateSiteSettings`
- [x] 新建 `src/app/api/demo/[projectId]/route.ts` — GET → 回傳 HTML with embedded JS component
- [x] 修改 `src/lib/actions/projects.ts` → `addProject` 加入 heroType + heroJsCode 欄位
- [x] 新建 `src/lib/demo-template.ts` — buildDemoHtml() Blob URL approach
