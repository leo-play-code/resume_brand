# Testing Spec

## Test Stack
- **Unit / Integration**: Vitest + React Testing Library
- **E2E**: Playwright (if configured)
- **API Tests**: Vitest + supertest or direct fetch

---

## New Tests Required

### Unit Tests — ComboboxSelect

**File**: `src/components/ui/__tests__/ComboboxSelect.test.tsx`

```
- renders with label and placeholder
- clicking opens dropdown with all options
- typing filters options (中文 match)
- typing filters options (英文 match)
- selecting an option closes dropdown and updates value
- allowFreeInput=true: "使用 [輸入值]" shows when no match
- allowFreeInput=true: free input sets value correctly
- pressing Escape closes dropdown
- clicking outside closes dropdown
- name input has correct form value after selection
```

---

### Unit Tests — UniversityPicker

**File**: `src/components/ui/__tests__/UniversityPicker.test.tsx`

```
- renders 學歷層級 select with 4 options (高中/學士/碩士/博士)
- renders 學校 combobox with placeholder
- renders 系所 combobox with placeholder
- searching "台灣大學" returns NTU in results
- searching "national" returns English-name universities
- selecting school sets hidden input values (zh + en)
- free input school name works
- all 3 fields are present in form output
```

---

### Unit Tests — SkillPicker

**File**: `src/components/ui/__tests__/SkillPicker.test.tsx`

```
- renders empty state with search box
- mock GET /api/skills → displays results grouped by category
- selecting a skill adds a tag
- clicking X on a tag removes it
- hidden input value equals comma-joined selected skills
- "新增自訂技能" button shown when search has no results
- adding custom skill calls addSkill action
- debounce: API not called on every keystroke
```

---

### Integration Tests — Skills API

**File**: `src/app/api/skills/__tests__/route.test.ts`

```
- GET /api/skills returns all active skills
- GET /api/skills?q=python returns filtered results
- GET /api/skills?category=程式語言 returns only that category
- GET /api/skills?q=xyz returns empty array
- results sorted: preset before custom, then alphabetical
```

---

### Integration Tests — addSkill / deleteSkill Actions

**File**: `src/lib/actions/__tests__/skills.test.ts`

```
- addSkill creates new skill with isCustom=true
- addSkill with duplicate nameZh returns error without creating
- addSkill with empty nameZh throws validation error
- deleteSkill removes isCustom=true skill
- deleteSkill on preset skill (isCustom=false) throws error
```

---

### Integration Tests — ExperienceAdminClient

**File**: `src/app/admin/experience/__tests__/ExperienceAdminClient.test.tsx`

```
- type=work: shows Company and Role text inputs
- type=education: shows UniversityPicker (not plain inputs)
- switching type between work/education re-renders correct fields
- form submission with education type includes degree_level, school, department
```

---

## Acceptance Criteria Summary

- [x] ComboboxSelect unit tests pass (min 10 cases)
- [x] UniversityPicker unit tests pass (includes zh + en search)
- [x] SkillPicker unit tests pass (includes custom add flow)
- [x] Skills API route integration tests pass
- [x] addSkill / deleteSkill action tests pass
- [x] ExperienceAdminClient education/work switch tests pass

---

## Task Status

### Pending
- [ ] [Integration] Admin layout 背景色與前台 `--background` CSS var 一致
- [ ] [Regression] Prisma Client stale after migration — 確認新增 model 後 `npx prisma generate` 已執行，`prisma.siteSettings.findUnique` 不再拋出 undefined error

### Done
- [x] `demo-template.test.ts` — `buildDemoHtml(code)` 回傳字串包含 <!DOCTYPE html>、react esm.sh CDN、framer-motion、lucide-react、`<div id="root">`；包含傳入的 code；backtick 和 ${} sanitization 不 crash (10 cases; completed: 2026-04-26)
- [x] `GET /api/demo/[projectId]` — heroType==="js-demo" 回傳 200 text/html；heroType==="mp4" 回傳 404；heroJsCode===null 回傳 404；projectId 不存在回傳 404；200 Content-Type 含 text/html (5 cases; completed: 2026-04-26)
- [x] `LoadingSpinner.test.tsx` — unit tests (5 cases; completed: 2026-04-26)
- [x] `NavigationProgress.test.tsx` — unit tests (3 cases; completed: 2026-04-26)
- [x] `SettingsAdminClient.test.tsx` — unit tests (5 cases; completed: 2026-04-26)
- [x] `ComboboxSelect.test.tsx` — unit tests (11 cases; completed: 2026-04-26)
- [x] `UniversityPicker.test.tsx` — unit tests (8 cases; completed: 2026-04-26)
- [x] `SkillPicker.test.tsx` — unit tests (8 cases; completed: 2026-04-26)
- [x] `api/skills/route.test.ts` — integration tests (5 cases; completed: 2026-04-26)
- [x] `actions/skills.test.ts` — integration tests (8 cases; completed: 2026-04-26)
- [x] `ExperienceAdminClient.test.tsx` — integration tests (8 cases; completed: 2026-04-26)
- [x] `actions/settings.test.ts` — integration tests (5 cases: getSiteSettings DB record, getSiteSettings null→defaults, updateSiteSettings valid hex, updateSiteSettings invalid hex, updateSiteSettings no session; completed: 2026-04-26)
- [x] `app/__tests__/layout.test.tsx` — [Regression] HTML theme hydration mismatch — Manual verification only; `suppressHydrationWarning` added to `<html>` in layout.tsx + inline script restores `data-theme`; full test requires browser/Playwright (completed: 2026-04-26)
- [x] `color.test.ts` — `isLightColor` + `buildCssVars` unit tests (12 cases: pure white, lavender-white, near-black, deep-blue-black, boundary #808080, dark bg foreground, light bg foreground, --background injection, --surface/--border/--fg-60 presence for both modes) + 2 layout integration cases; completed: 2026-04-26
- [x] `layout 色彩注入` — isLightColor('#f4f1ff')===true → buildCssVars foreground=#13122a；isLightColor('#050510')===false → buildCssVars foreground=#ffffff (covered in color.test.ts; completed: 2026-04-26)
- [x] [Regression] Admin text invisible on light background — 已修復 — Admin 全站改用 text-fg/bg-surface 語意類，foreground 由 buildCssVars 動態計算 (completed: 2026-04-26)
