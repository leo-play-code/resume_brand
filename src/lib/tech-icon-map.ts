export interface TechIconEntry {
  slug: string;  // Simple Icons slug, used for https://cdn.simpleicons.org/{slug}
  color: string; // Brand hex color
}

export const TECH_ICON_MAP: Record<string, TechIconEntry> = {
  // 程式語言
  TypeScript:    { slug: "typescript",    color: "#3178C6" },
  JavaScript:    { slug: "javascript",    color: "#F7DF1E" },
  Python:        { slug: "python",        color: "#3776AB" },
  Java:          { slug: "java",          color: "#007396" },
  Go:            { slug: "go",            color: "#00ADD8" },
  Rust:          { slug: "rust",          color: "#000000" },
  PHP:           { slug: "php",           color: "#777BB4" },
  Ruby:          { slug: "ruby",          color: "#CC342D" },
  Swift:         { slug: "swift",         color: "#F05138" },
  Kotlin:        { slug: "kotlin",        color: "#7F52FF" },
  "C#":          { slug: "csharp",        color: "#239120" },
  Scala:         { slug: "scala",         color: "#DC322F" },

  // 前端
  React:         { slug: "react",         color: "#61DAFB" },
  "Vue.js":      { slug: "vuedotjs",      color: "#4FC08D" },
  Angular:       { slug: "angular",       color: "#DD0031" },
  "Next.js":     { slug: "nextdotjs",     color: "#000000" },
  "Nuxt.js":     { slug: "nuxtdotjs",     color: "#00DC82" },
  Svelte:        { slug: "svelte",        color: "#FF3E00" },
  "Tailwind CSS":{ slug: "tailwindcss",   color: "#06B6D4" },
  Bootstrap:     { slug: "bootstrap",     color: "#7952B3" },
  jQuery:        { slug: "jquery",        color: "#0769AD" },
  Redux:         { slug: "redux",         color: "#764ABC" },

  // 後端
  "Node.js":     { slug: "nodedotjs",     color: "#339933" },
  "Express.js":  { slug: "express",       color: "#000000" },
  FastAPI:       { slug: "fastapi",       color: "#009688" },
  Django:        { slug: "django",        color: "#092E20" },
  Flask:         { slug: "flask",         color: "#000000" },
  "Spring Boot": { slug: "springboot",    color: "#6DB33F" },
  Laravel:       { slug: "laravel",       color: "#FF2D20" },
  NestJS:        { slug: "nestjs",        color: "#E0234E" },

  // 資料庫
  MySQL:         { slug: "mysql",         color: "#4479A1" },
  PostgreSQL:    { slug: "postgresql",    color: "#4169E1" },
  MongoDB:       { slug: "mongodb",       color: "#47A248" },
  Redis:         { slug: "redis",         color: "#DC382D" },
  SQLite:        { slug: "sqlite",        color: "#003B57" },
  Firebase:      { slug: "firebase",      color: "#FFCA28" },
  Supabase:      { slug: "supabase",      color: "#3ECF8E" },
  Prisma:        { slug: "prisma",        color: "#2D3748" },

  // 雲端 / DevOps
  AWS:               { slug: "amazonwebservices", color: "#FF9900" },
  Azure:             { slug: "microsoftazure",    color: "#0078D4" },
  "Google Cloud":    { slug: "googlecloud",       color: "#4285F4" },
  Docker:            { slug: "docker",            color: "#2496ED" },
  Kubernetes:        { slug: "kubernetes",        color: "#326CE5" },
  "GitHub Actions":  { slug: "githubactions",     color: "#2088FF" },
  Terraform:         { slug: "terraform",         color: "#7B42BC" },
  Linux:             { slug: "linux",             color: "#FCC624" },
  Git:               { slug: "git",               color: "#F05032" },
  GitHub:            { slug: "github",            color: "#181717" },
  GitLab:            { slug: "gitlab",            color: "#FC6D26" },

  // AI / ML
  TensorFlow:    { slug: "tensorflow",    color: "#FF6F00" },
  PyTorch:       { slug: "pytorch",       color: "#EE4C2C" },
  OpenAI:        { slug: "openai",        color: "#412991" },
  Claude:        { slug: "anthropic",     color: "#D4A27F" },
  Anthropic:     { slug: "anthropic",     color: "#D4A27F" },
  LangChain:     { slug: "langchain",     color: "#1C3C3C" },
  "Hugging Face":{ slug: "huggingface",   color: "#FFD21E" },
  Pandas:        { slug: "pandas",        color: "#150458" },
  NumPy:         { slug: "numpy",         color: "#013243" },
  "scikit-learn":{ slug: "scikitlearn",   color: "#F7931E" },
  Jupyter:       { slug: "jupyter",       color: "#F37626" },
  Matplotlib:    { slug: "matplotlib",    color: "#11557C" },
  Gemini:        { slug: "googlegemini",  color: "#8E75B2" },

  // 工具
  Figma:          { slug: "figma",            color: "#F24E1E" },
  Vercel:         { slug: "vercel",           color: "#000000" },
  tRPC:           { slug: "trpc",             color: "#2596BE" },
  GraphQL:        { slug: "graphql",          color: "#E10098" },
  Zod:            { slug: "zod",              color: "#3E67B1" },
  Jira:           { slug: "jira",             color: "#0052CC" },
  Notion:         { slug: "notion",           color: "#000000" },
  "VS Code":      { slug: "visualstudiocode", color: "#007ACC" },
  GSAP:           { slug: "greensock",        color: "#88CE02" },
  "Framer Motion":{ slug: "framer",           color: "#0055FF" },
  Vite:           { slug: "vite",             color: "#646CFF" },
  Webpack:        { slug: "webpack",          color: "#8DD6F9" },
  ESLint:         { slug: "eslint",           color: "#4B32C3" },
  Prettier:       { slug: "prettier",         color: "#F7B93E" },
  Storybook:      { slug: "storybook",        color: "#FF4785" },
  Slack:          { slug: "slack",            color: "#4A154B" },
  Zoom:           { slug: "zoom",             color: "#2D8CFF" },
  Nginx:          { slug: "nginx",            color: "#009639" },
  Jenkins:        { slug: "jenkins",          color: "#D24939" },
  Ansible:        { slug: "ansible",          color: "#EE0000" },
  Prometheus:     { slug: "prometheus",       color: "#E6522C" },
  Grafana:        { slug: "grafana",          color: "#F46800" },
  Elasticsearch:  { slug: "elastic",          color: "#005571" },

  // 測試
  Jest:           { slug: "jest",             color: "#C21325" },
  Vitest:         { slug: "vitest",           color: "#6E9F18" },
  Cypress:        { slug: "cypress",          color: "#17202C" },
  Playwright:     { slug: "playwright",       color: "#2EAD33" },

  // 辦公室工具
  Excel:          { slug: "microsoftexcel",       color: "#217346" },
  PowerPoint:     { slug: "microsoftpowerpoint",  color: "#B7472A" },
  Word:           { slug: "microsoftword",        color: "#2B579A" },
  "Google Sheets":{ slug: "googlesheets",         color: "#34A853" },
  "Google Docs":  { slug: "googledocs",           color: "#4285F4" },
};

/**
 * Look up a tech icon entry by name (case-insensitive).
 * Returns null if the name is not found in TECH_ICON_MAP.
 */
export function getTechIcon(name: string): TechIconEntry | null {
  const key = Object.keys(TECH_ICON_MAP).find(
    (k) => k.toLowerCase() === name.toLowerCase()
  );
  return key ? TECH_ICON_MAP[key] : null;
}
