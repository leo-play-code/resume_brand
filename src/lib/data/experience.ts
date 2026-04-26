export interface Experience {
  company: string;
  role: string;
  /** Format: "YYYY.MM — YYYY.MM" or "YYYY.MM — Present" */
  period: string;
  description: string[];
  type: "work" | "education";
}

export const experiences: Experience[] = [
  {
    company: "Company Name",
    role: "Full Stack Engineer",
    period: "2024.01 — Present",
    description: [
      "Built and maintained scalable web applications serving 10k+ users",
      "Led migration from REST to tRPC, reducing API boilerplate by 40%",
      "Implemented AI-powered features using OpenAI API and LangChain",
    ],
    type: "work",
  },
  {
    company: "Another Company",
    role: "Frontend Developer Intern",
    period: "2023.06 — 2023.12",
    description: [
      "Developed responsive UI components with React and Tailwind CSS",
      "Improved page load performance by 35% through code splitting and lazy loading",
      "Collaborated with design team to ship 5 new product features",
    ],
    type: "work",
  },
  {
    company: "University Name",
    role: "B.S. Computer Science",
    period: "2020.09 — 2024.06",
    description: [
      "Coursework: Algorithms, Operating Systems, Database Systems, Machine Learning",
      "Dean's List for academic excellence",
      "Teaching assistant for Introduction to Programming",
    ],
    type: "education",
  },
];
