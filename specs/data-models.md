# Data Models Spec

## Existing Models (Prisma)

### Project
`id`, `name`, `description`, `longDescription`, `videoUrl`, `githubUrl?`, `liveUrl?`, `techStack: String[]`, `featured`, `displayOrder`, `createdAt`

### TechStack
`id`, `name`, `color`, `rowNumber`, `displayOrder`

### Experience
`id`, `company`, `role`, `period`, `description: String[]`, `type` ("work"|"education"), `displayOrder`

---

## New Models

### Skill
儲存技能庫（預設 + 使用者自訂）

```prisma
model Skill {
  id         String   @id @default(uuid())
  nameZh     String   @map("name_zh")          // 中文名稱，e.g. "Python"
  nameEn     String   @map("name_en")          // 英文名稱，e.g. "Python"
  category   String                            // 分類，e.g. "程式語言"
  isCustom   Boolean  @default(false) @map("is_custom")  // 使用者自訂
  isActive   Boolean  @default(true)  @map("is_active")
  createdAt  DateTime @default(now())  @map("created_at")

  @@map("skills")
}
```

**Seed 資料分類**:
- 程式語言 (Python, JavaScript, TypeScript, Java, C, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, R, MATLAB, Scala, Bash/Shell)
- 前端框架 (React, Vue.js, Angular, Next.js, Nuxt.js, Svelte, Tailwind CSS, Bootstrap, jQuery, Redux)
- 後端框架 (Node.js, Express.js, FastAPI, Django, Flask, Spring Boot, Laravel, Rails, NestJS, tRPC)
- 資料庫 (MySQL, PostgreSQL, MongoDB, Redis, SQLite, Oracle, MS SQL Server, Firebase, Supabase, Prisma)
- 雲端 / DevOps (AWS, Azure, Google Cloud, Docker, Kubernetes, GitHub Actions, Jenkins, Terraform, Linux, CI/CD)
- AI / 資料科學 (TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, Matplotlib, LangChain, OpenAI API, Hugging Face, Jupyter)
- 辦公室工具 (Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Microsoft Access, Google Docs, Google Sheets, Google Slides, Notion, Airtable)
- 設計工具 (Figma, Adobe Photoshop, Adobe Illustrator, Adobe XD, Adobe InDesign, Canva, Sketch, Blender, AutoCAD, SolidWorks, Revit)
- 版本控制 (Git, GitHub, GitLab, Bitbucket, SVN)
- 測試工具 (Jest, Vitest, Cypress, Playwright, Pytest, Selenium, JUnit)
- 其他工具 (Jira, Confluence, Postman, Insomnia, VS Code, IntelliJ IDEA, Xcode, Figma)
- 軟技能 / 方法論 (Scrum / Agile, 專案管理, UX/UI 設計, SEO, 數位行銷, 數據分析, 財務分析, 會計)

---

## Static Data Files (No DB Required)

### src/lib/data/universities.ts
全台大學清單（中英文）。資料穩定，用靜態 TS 檔即可。

```ts
export interface University {
  id: string        // 縮寫 e.g. "ntu"
  nameZh: string   // 國立臺灣大學
  nameEn: string   // National Taiwan University
  type: "national" | "private"
}
```

**涵蓋範圍** (約 160 所):
- 國立大學 ~50 所
- 私立大學 ~70 所
- 科技大學 ~40 所

### src/lib/data/departments.ts
常見系所清單，按學院分類。

```ts
export interface Department {
  id: string
  nameZh: string
  nameEn: string
  college: string  // 學院分類
}
```

**學院分類**: 理工、商管、文學外語、法律、醫學、農業、藝術、社會科學、教育、其他

### src/lib/data/degree-levels.ts
學歷層級。

```ts
export const degreeLevels = [
  { value: "高中",  labelZh: "高中",  labelEn: "High School" },
  { value: "學士",  labelZh: "學士",  labelEn: "Bachelor's" },
  { value: "碩士",  labelZh: "碩士",  labelEn: "Master's" },
  { value: "博士",  labelZh: "博士",  labelEn: "PhD" },
] as const
```

---

## Migration

```
Migration name: add_skills_table
Changes:
- Create skills table with Skill model fields
- Seed script: prisma/seed.ts — insert all preset skills
```

---

## Task Status

### Pending

### Done
- [x] Add `Skill` model to `prisma/schema.prisma`
- [x] Create migration `add_skills_table`
- [x] Write seed script `prisma/seed.ts` with ~150 preset skills across all categories
- [x] Create `src/lib/data/universities.ts` (160 Taiwan universities, zh+en)
- [x] Create `src/lib/data/departments.ts` (common departments, zh+en)
- [x] Create `src/lib/data/degree-levels.ts`
