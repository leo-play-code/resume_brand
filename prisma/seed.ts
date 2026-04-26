import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SkillSeed {
  nameZh: string;
  nameEn: string;
  category: string;
}

const skills: SkillSeed[] = [
  // 程式語言
  { nameZh: "Python", nameEn: "Python", category: "程式語言" },
  { nameZh: "JavaScript", nameEn: "JavaScript", category: "程式語言" },
  { nameZh: "TypeScript", nameEn: "TypeScript", category: "程式語言" },
  { nameZh: "Java", nameEn: "Java", category: "程式語言" },
  { nameZh: "C", nameEn: "C", category: "程式語言" },
  { nameZh: "C++", nameEn: "C++", category: "程式語言" },
  { nameZh: "C#", nameEn: "C#", category: "程式語言" },
  { nameZh: "Go", nameEn: "Go", category: "程式語言" },
  { nameZh: "Rust", nameEn: "Rust", category: "程式語言" },
  { nameZh: "PHP", nameEn: "PHP", category: "程式語言" },
  { nameZh: "Ruby", nameEn: "Ruby", category: "程式語言" },
  { nameZh: "Swift", nameEn: "Swift", category: "程式語言" },
  { nameZh: "Kotlin", nameEn: "Kotlin", category: "程式語言" },
  { nameZh: "R", nameEn: "R", category: "程式語言" },
  { nameZh: "MATLAB", nameEn: "MATLAB", category: "程式語言" },
  { nameZh: "Scala", nameEn: "Scala", category: "程式語言" },
  { nameZh: "Bash/Shell", nameEn: "Bash/Shell", category: "程式語言" },
  { nameZh: "Dart", nameEn: "Dart", category: "程式語言" },
  { nameZh: "Lua", nameEn: "Lua", category: "程式語言" },

  // 前端框架
  { nameZh: "React", nameEn: "React", category: "前端框架" },
  { nameZh: "Vue.js", nameEn: "Vue.js", category: "前端框架" },
  { nameZh: "Angular", nameEn: "Angular", category: "前端框架" },
  { nameZh: "Next.js", nameEn: "Next.js", category: "前端框架" },
  { nameZh: "Nuxt.js", nameEn: "Nuxt.js", category: "前端框架" },
  { nameZh: "Svelte", nameEn: "Svelte", category: "前端框架" },
  { nameZh: "Tailwind CSS", nameEn: "Tailwind CSS", category: "前端框架" },
  { nameZh: "Bootstrap", nameEn: "Bootstrap", category: "前端框架" },
  { nameZh: "jQuery", nameEn: "jQuery", category: "前端框架" },
  { nameZh: "Redux", nameEn: "Redux", category: "前端框架" },
  { nameZh: "Zustand", nameEn: "Zustand", category: "前端框架" },
  { nameZh: "SWR", nameEn: "SWR", category: "前端框架" },
  { nameZh: "React Query", nameEn: "React Query", category: "前端框架" },

  // 後端框架
  { nameZh: "Node.js", nameEn: "Node.js", category: "後端框架" },
  { nameZh: "Express.js", nameEn: "Express.js", category: "後端框架" },
  { nameZh: "FastAPI", nameEn: "FastAPI", category: "後端框架" },
  { nameZh: "Django", nameEn: "Django", category: "後端框架" },
  { nameZh: "Flask", nameEn: "Flask", category: "後端框架" },
  { nameZh: "Spring Boot", nameEn: "Spring Boot", category: "後端框架" },
  { nameZh: "Laravel", nameEn: "Laravel", category: "後端框架" },
  { nameZh: "Rails", nameEn: "Rails", category: "後端框架" },
  { nameZh: "NestJS", nameEn: "NestJS", category: "後端框架" },
  { nameZh: "tRPC", nameEn: "tRPC", category: "後端框架" },
  { nameZh: "Hono", nameEn: "Hono", category: "後端框架" },
  { nameZh: "Gin", nameEn: "Gin", category: "後端框架" },
  { nameZh: "Echo", nameEn: "Echo", category: "後端框架" },

  // 資料庫
  { nameZh: "MySQL", nameEn: "MySQL", category: "資料庫" },
  { nameZh: "PostgreSQL", nameEn: "PostgreSQL", category: "資料庫" },
  { nameZh: "MongoDB", nameEn: "MongoDB", category: "資料庫" },
  { nameZh: "Redis", nameEn: "Redis", category: "資料庫" },
  { nameZh: "SQLite", nameEn: "SQLite", category: "資料庫" },
  { nameZh: "Oracle", nameEn: "Oracle", category: "資料庫" },
  { nameZh: "MS SQL Server", nameEn: "MS SQL Server", category: "資料庫" },
  { nameZh: "Firebase", nameEn: "Firebase", category: "資料庫" },
  { nameZh: "Supabase", nameEn: "Supabase", category: "資料庫" },
  { nameZh: "Prisma", nameEn: "Prisma", category: "資料庫" },
  { nameZh: "Drizzle", nameEn: "Drizzle", category: "資料庫" },
  { nameZh: "TypeORM", nameEn: "TypeORM", category: "資料庫" },

  // 雲端 / DevOps
  { nameZh: "AWS", nameEn: "AWS", category: "雲端 / DevOps" },
  { nameZh: "Azure", nameEn: "Azure", category: "雲端 / DevOps" },
  { nameZh: "Google Cloud", nameEn: "Google Cloud", category: "雲端 / DevOps" },
  { nameZh: "Docker", nameEn: "Docker", category: "雲端 / DevOps" },
  { nameZh: "Kubernetes", nameEn: "Kubernetes", category: "雲端 / DevOps" },
  { nameZh: "GitHub Actions", nameEn: "GitHub Actions", category: "雲端 / DevOps" },
  { nameZh: "Jenkins", nameEn: "Jenkins", category: "雲端 / DevOps" },
  { nameZh: "Terraform", nameEn: "Terraform", category: "雲端 / DevOps" },
  { nameZh: "Linux", nameEn: "Linux", category: "雲端 / DevOps" },
  { nameZh: "CI/CD", nameEn: "CI/CD", category: "雲端 / DevOps" },
  { nameZh: "Nginx", nameEn: "Nginx", category: "雲端 / DevOps" },
  { nameZh: "Vercel", nameEn: "Vercel", category: "雲端 / DevOps" },
  { nameZh: "Cloudflare", nameEn: "Cloudflare", category: "雲端 / DevOps" },

  // AI / 資料科學
  { nameZh: "TensorFlow", nameEn: "TensorFlow", category: "AI / 資料科學" },
  { nameZh: "PyTorch", nameEn: "PyTorch", category: "AI / 資料科學" },
  { nameZh: "Scikit-learn", nameEn: "Scikit-learn", category: "AI / 資料科學" },
  { nameZh: "Pandas", nameEn: "Pandas", category: "AI / 資料科學" },
  { nameZh: "NumPy", nameEn: "NumPy", category: "AI / 資料科學" },
  { nameZh: "Matplotlib", nameEn: "Matplotlib", category: "AI / 資料科學" },
  { nameZh: "Seaborn", nameEn: "Seaborn", category: "AI / 資料科學" },
  { nameZh: "LangChain", nameEn: "LangChain", category: "AI / 資料科學" },
  { nameZh: "OpenAI API", nameEn: "OpenAI API", category: "AI / 資料科學" },
  { nameZh: "Hugging Face", nameEn: "Hugging Face", category: "AI / 資料科學" },
  { nameZh: "Jupyter", nameEn: "Jupyter", category: "AI / 資料科學" },
  { nameZh: "CUDA", nameEn: "CUDA", category: "AI / 資料科學" },

  // 辦公室工具
  { nameZh: "Microsoft Word", nameEn: "Microsoft Word", category: "辦公室工具" },
  { nameZh: "Microsoft Excel", nameEn: "Microsoft Excel", category: "辦公室工具" },
  { nameZh: "Microsoft PowerPoint", nameEn: "Microsoft PowerPoint", category: "辦公室工具" },
  { nameZh: "Microsoft Access", nameEn: "Microsoft Access", category: "辦公室工具" },
  { nameZh: "Google Docs", nameEn: "Google Docs", category: "辦公室工具" },
  { nameZh: "Google Sheets", nameEn: "Google Sheets", category: "辦公室工具" },
  { nameZh: "Google Slides", nameEn: "Google Slides", category: "辦公室工具" },
  { nameZh: "Notion", nameEn: "Notion", category: "辦公室工具" },
  { nameZh: "Airtable", nameEn: "Airtable", category: "辦公室工具" },
  { nameZh: "Microsoft Outlook", nameEn: "Microsoft Outlook", category: "辦公室工具" },
  { nameZh: "LibreOffice", nameEn: "LibreOffice", category: "辦公室工具" },

  // 設計工具
  { nameZh: "Figma", nameEn: "Figma", category: "設計工具" },
  { nameZh: "Adobe Photoshop", nameEn: "Adobe Photoshop", category: "設計工具" },
  { nameZh: "Adobe Illustrator", nameEn: "Adobe Illustrator", category: "設計工具" },
  { nameZh: "Adobe XD", nameEn: "Adobe XD", category: "設計工具" },
  { nameZh: "Adobe InDesign", nameEn: "Adobe InDesign", category: "設計工具" },
  { nameZh: "Canva", nameEn: "Canva", category: "設計工具" },
  { nameZh: "Sketch", nameEn: "Sketch", category: "設計工具" },
  { nameZh: "Blender", nameEn: "Blender", category: "設計工具" },
  { nameZh: "AutoCAD", nameEn: "AutoCAD", category: "設計工具" },
  { nameZh: "SolidWorks", nameEn: "SolidWorks", category: "設計工具" },
  { nameZh: "Revit", nameEn: "Revit", category: "設計工具" },
  { nameZh: "3ds Max", nameEn: "3ds Max", category: "設計工具" },
  { nameZh: "Cinema 4D", nameEn: "Cinema 4D", category: "設計工具" },

  // 版本控制
  { nameZh: "Git", nameEn: "Git", category: "版本控制" },
  { nameZh: "GitHub", nameEn: "GitHub", category: "版本控制" },
  { nameZh: "GitLab", nameEn: "GitLab", category: "版本控制" },
  { nameZh: "Bitbucket", nameEn: "Bitbucket", category: "版本控制" },
  { nameZh: "SVN", nameEn: "SVN", category: "版本控制" },

  // 測試工具
  { nameZh: "Jest", nameEn: "Jest", category: "測試工具" },
  { nameZh: "Vitest", nameEn: "Vitest", category: "測試工具" },
  { nameZh: "Cypress", nameEn: "Cypress", category: "測試工具" },
  { nameZh: "Playwright", nameEn: "Playwright", category: "測試工具" },
  { nameZh: "Pytest", nameEn: "Pytest", category: "測試工具" },
  { nameZh: "Selenium", nameEn: "Selenium", category: "測試工具" },
  { nameZh: "JUnit", nameEn: "JUnit", category: "測試工具" },
  { nameZh: "Testing Library", nameEn: "Testing Library", category: "測試工具" },

  // 其他工具
  { nameZh: "Jira", nameEn: "Jira", category: "其他工具" },
  { nameZh: "Confluence", nameEn: "Confluence", category: "其他工具" },
  { nameZh: "Postman", nameEn: "Postman", category: "其他工具" },
  { nameZh: "Insomnia", nameEn: "Insomnia", category: "其他工具" },
  { nameZh: "VS Code", nameEn: "VS Code", category: "其他工具" },
  { nameZh: "IntelliJ IDEA", nameEn: "IntelliJ IDEA", category: "其他工具" },
  { nameZh: "Xcode", nameEn: "Xcode", category: "其他工具" },
  { nameZh: "Webpack", nameEn: "Webpack", category: "其他工具" },
  { nameZh: "Vite", nameEn: "Vite", category: "其他工具" },
  { nameZh: "ESLint", nameEn: "ESLint", category: "其他工具" },
  { nameZh: "Prettier", nameEn: "Prettier", category: "其他工具" },

  // 軟技能 / 方法論
  { nameZh: "Scrum/Agile", nameEn: "Scrum/Agile", category: "軟技能 / 方法論" },
  { nameZh: "專案管理", nameEn: "Project Management", category: "軟技能 / 方法論" },
  { nameZh: "UX/UI 設計", nameEn: "UX/UI Design", category: "軟技能 / 方法論" },
  { nameZh: "SEO", nameEn: "SEO", category: "軟技能 / 方法論" },
  { nameZh: "數位行銷", nameEn: "Digital Marketing", category: "軟技能 / 方法論" },
  { nameZh: "數據分析", nameEn: "Data Analytics", category: "軟技能 / 方法論" },
  { nameZh: "財務分析", nameEn: "Financial Analysis", category: "軟技能 / 方法論" },
  { nameZh: "會計", nameEn: "Accounting", category: "軟技能 / 方法論" },
  { nameZh: "簡報設計", nameEn: "Presentation Design", category: "軟技能 / 方法論" },
  { nameZh: "技術寫作", nameEn: "Technical Writing", category: "軟技能 / 方法論" },
];

async function main() {
  console.log(`Starting seed: ${skills.length} skills to insert...`);

  // Delete existing preset skills (isCustom=false) then re-insert for idempotency
  const deleted = await prisma.skill.deleteMany({ where: { isCustom: false } });
  console.log(`Deleted ${deleted.count} existing preset skills`);

  const created = await prisma.skill.createMany({
    data: skills.map((s) => ({ ...s, isCustom: false, isActive: true })),
  });

  console.log(`Seeded ${created.count} skills successfully`);

  // Upsert site settings singleton
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      backgroundDark: "#050510",
      backgroundLight: "#f4f1ff",
    },
  });

  console.log("Seeded SiteSettings singleton");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
