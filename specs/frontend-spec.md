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

## Task Status

### Pending

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
