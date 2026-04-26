export const degreeLevels = [
  { value: "高中", labelZh: "高中", labelEn: "High School" },
  { value: "學士", labelZh: "學士", labelEn: "Bachelor's" },
  { value: "碩士", labelZh: "碩士", labelEn: "Master's" },
  { value: "博士", labelZh: "博士", labelEn: "PhD" },
] as const;

export type DegreeLevel = (typeof degreeLevels)[number]["value"];
