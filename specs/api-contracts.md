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

## No Changes to Existing Actions

- `addExperience` / `deleteExperience` — 不需改 (UI 層 picker 組好資料後仍走 FormData)
- `addTechItem` / `deleteTechItem` — 不需改
- `addProject` / `deleteProject` — 不需改

---

## Task Status

### Pending

### Done
- [x] Create `src/app/api/skills/route.ts` — GET handler with search + category filter
- [x] Create `src/lib/actions/skills.ts` — `addSkill`, `deleteSkill` server actions
- [x] Create `src/lib/actions/settings.ts` — `getSiteSettings`, `updateSiteSettings`
