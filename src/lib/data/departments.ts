export interface Department {
  id: string;
  nameZh: string;
  nameEn: string;
  college: string;
}

export const departments: Department[] = [
  // ── 理工 ────────────────────────────────────────────
  {
    id: "cs",
    nameZh: "資訊工程學系",
    nameEn: "Department of Computer Science and Engineering",
    college: "理工",
  },
  {
    id: "ee",
    nameZh: "電機工程學系",
    nameEn: "Department of Electrical Engineering",
    college: "理工",
  },
  {
    id: "me",
    nameZh: "機械工程學系",
    nameEn: "Department of Mechanical Engineering",
    college: "理工",
  },
  {
    id: "che",
    nameZh: "化學工程學系",
    nameEn: "Department of Chemical Engineering",
    college: "理工",
  },
  {
    id: "ce",
    nameZh: "土木工程學系",
    nameEn: "Department of Civil Engineering",
    college: "理工",
  },
  {
    id: "ie",
    nameZh: "工業工程學系",
    nameEn: "Department of Industrial Engineering",
    college: "理工",
  },
  {
    id: "mse",
    nameZh: "材料科學與工程學系",
    nameEn: "Department of Materials Science and Engineering",
    college: "理工",
  },
  {
    id: "enve",
    nameZh: "環境工程學系",
    nameEn: "Department of Environmental Engineering",
    college: "理工",
  },
  {
    id: "aae",
    nameZh: "航空太空工程學系",
    nameEn: "Department of Aeronautics and Astronautics",
    college: "理工",
  },
  {
    id: "bme",
    nameZh: "生醫工程學系",
    nameEn: "Department of Biomedical Engineering",
    college: "理工",
  },
  {
    id: "csci",
    nameZh: "電腦科學系",
    nameEn: "Department of Computer Science",
    college: "理工",
  },
  {
    id: "amath",
    nameZh: "應用數學系",
    nameEn: "Department of Applied Mathematics",
    college: "理工",
  },
  {
    id: "phys",
    nameZh: "物理學系",
    nameEn: "Department of Physics",
    college: "理工",
  },
  {
    id: "chem",
    nameZh: "化學系",
    nameEn: "Department of Chemistry",
    college: "理工",
  },
  {
    id: "stat",
    nameZh: "統計學系",
    nameEn: "Department of Statistics",
    college: "理工",
  },
  {
    id: "im",
    nameZh: "資訊管理學系",
    nameEn: "Department of Information Management",
    college: "理工",
  },

  // ── 商管 ────────────────────────────────────────────
  {
    id: "ba",
    nameZh: "企業管理學系",
    nameEn: "Department of Business Administration",
    college: "商管",
  },
  {
    id: "bba",
    nameZh: "工商管理學系",
    nameEn: "Department of Business and Management",
    college: "商管",
  },
  {
    id: "fin",
    nameZh: "財務金融學系",
    nameEn: "Department of Finance",
    college: "商管",
  },
  {
    id: "acc",
    nameZh: "會計學系",
    nameEn: "Department of Accounting",
    college: "商管",
  },
  {
    id: "itrade",
    nameZh: "國際貿易學系",
    nameEn: "Department of International Trade",
    college: "商管",
  },
  {
    id: "mktg",
    nameZh: "行銷管理學系",
    nameEn: "Department of Marketing Management",
    college: "商管",
  },
  {
    id: "im2",
    nameZh: "資訊管理學系",
    nameEn: "Department of Information Management",
    college: "商管",
  },
  {
    id: "hrm",
    nameZh: "人力資源管理學系",
    nameEn: "Department of Human Resource Management",
    college: "商管",
  },
  {
    id: "econ",
    nameZh: "經濟學系",
    nameEn: "Department of Economics",
    college: "商管",
  },
  {
    id: "tlm",
    nameZh: "運輸與物流管理學系",
    nameEn: "Department of Transportation and Logistics Management",
    college: "商管",
  },

  // ── 文學外語 ─────────────────────────────────────────
  {
    id: "chin",
    nameZh: "中國文學系",
    nameEn: "Department of Chinese Literature",
    college: "文學外語",
  },
  {
    id: "eng",
    nameZh: "英國語文學系",
    nameEn: "Department of English",
    college: "文學外語",
  },
  {
    id: "jpn",
    nameZh: "日本語文學系",
    nameEn: "Department of Japanese",
    college: "文學外語",
  },
  {
    id: "fre",
    nameZh: "法國語文學系",
    nameEn: "Department of French",
    college: "文學外語",
  },
  {
    id: "ger",
    nameZh: "德國語文學系",
    nameEn: "Department of German",
    college: "文學外語",
  },
  {
    id: "spa",
    nameZh: "西班牙語文學系",
    nameEn: "Department of Spanish",
    college: "文學外語",
  },
  {
    id: "hist",
    nameZh: "歷史學系",
    nameEn: "Department of History",
    college: "文學外語",
  },
  {
    id: "phil",
    nameZh: "哲學系",
    nameEn: "Department of Philosophy",
    college: "文學外語",
  },
  {
    id: "twlit",
    nameZh: "台灣文學系",
    nameEn: "Department of Taiwanese Literature",
    college: "文學外語",
  },

  // ── 法律 ─────────────────────────────────────────────
  {
    id: "law",
    nameZh: "法律學系",
    nameEn: "Department of Law",
    college: "法律",
  },

  // ── 醫學 ─────────────────────────────────────────────
  {
    id: "med",
    nameZh: "醫學系",
    nameEn: "School of Medicine",
    college: "醫學",
  },
  {
    id: "dent",
    nameZh: "牙醫學系",
    nameEn: "School of Dentistry",
    college: "醫學",
  },
  {
    id: "phar",
    nameZh: "藥學系",
    nameEn: "School of Pharmacy",
    college: "醫學",
  },
  {
    id: "nurs",
    nameZh: "護理學系",
    nameEn: "Department of Nursing",
    college: "醫學",
  },
  {
    id: "mlt",
    nameZh: "醫學技術學系",
    nameEn: "Department of Medical Laboratory Science",
    college: "醫學",
  },
  {
    id: "pt",
    nameZh: "物理治療學系",
    nameEn: "Department of Physical Therapy",
    college: "醫學",
  },
  {
    id: "ot",
    nameZh: "職能治療學系",
    nameEn: "Department of Occupational Therapy",
    college: "醫學",
  },
  {
    id: "ph",
    nameZh: "公共衛生學系",
    nameEn: "Department of Public Health",
    college: "醫學",
  },

  // ── 農業 ─────────────────────────────────────────────
  {
    id: "agron",
    nameZh: "農藝學系",
    nameEn: "Department of Agronomy",
    college: "農業",
  },
  {
    id: "vet",
    nameZh: "獸醫學系",
    nameEn: "Department of Veterinary Medicine",
    college: "農業",
  },
  {
    id: "for",
    nameZh: "森林學系",
    nameEn: "Department of Forestry",
    college: "農業",
  },
  {
    id: "agchem",
    nameZh: "農業化學系",
    nameEn: "Department of Agricultural Chemistry",
    college: "農業",
  },
  {
    id: "biotech",
    nameZh: "生物科技學系",
    nameEn: "Department of Biotechnology",
    college: "農業",
  },
  {
    id: "fsci",
    nameZh: "食品科技學系",
    nameEn: "Department of Food Science and Technology",
    college: "農業",
  },

  // ── 藝術 ─────────────────────────────────────────────
  {
    id: "music",
    nameZh: "音樂學系",
    nameEn: "Department of Music",
    college: "藝術",
  },
  {
    id: "farts",
    nameZh: "美術學系",
    nameEn: "Department of Fine Arts",
    college: "藝術",
  },
  {
    id: "design",
    nameZh: "設計學系",
    nameEn: "Department of Design",
    college: "藝術",
  },
  {
    id: "drama",
    nameZh: "戲劇學系",
    nameEn: "Department of Theatre Arts",
    college: "藝術",
  },
  {
    id: "vcd",
    nameZh: "視覺傳達設計學系",
    nameEn: "Department of Visual Communication Design",
    college: "藝術",
  },
  {
    id: "id",
    nameZh: "工業設計學系",
    nameEn: "Department of Industrial Design",
    college: "藝術",
  },
  {
    id: "arch",
    nameZh: "建築學系",
    nameEn: "Department of Architecture",
    college: "藝術",
  },
  {
    id: "intd",
    nameZh: "室內設計學系",
    nameEn: "Department of Interior Design",
    college: "藝術",
  },

  // ── 社會科學 ─────────────────────────────────────────
  {
    id: "soc",
    nameZh: "社會學系",
    nameEn: "Department of Sociology",
    college: "社會科學",
  },
  {
    id: "psyc",
    nameZh: "心理學系",
    nameEn: "Department of Psychology",
    college: "社會科學",
  },
  {
    id: "pols",
    nameZh: "政治學系",
    nameEn: "Department of Political Science",
    college: "社會科學",
  },
  {
    id: "dipl",
    nameZh: "外交學系",
    nameEn: "Department of Diplomacy",
    college: "社會科學",
  },
  {
    id: "sw",
    nameZh: "社會工作學系",
    nameEn: "Department of Social Work",
    college: "社會科學",
  },
  {
    id: "journ",
    nameZh: "新聞學系",
    nameEn: "Department of Journalism",
    college: "社會科學",
  },
  {
    id: "comm",
    nameZh: "傳播學系",
    nameEn: "Department of Communications",
    college: "社會科學",
  },

  // ── 教育 ─────────────────────────────────────────────
  {
    id: "edu",
    nameZh: "教育學系",
    nameEn: "Department of Education",
    college: "教育",
  },
  {
    id: "pe",
    nameZh: "體育學系",
    nameEn: "Department of Physical Education",
    college: "教育",
  },
  {
    id: "ece",
    nameZh: "幼兒教育學系",
    nameEn: "Department of Early Childhood Education",
    college: "教育",
  },
  {
    id: "sped",
    nameZh: "特殊教育學系",
    nameEn: "Department of Special Education",
    college: "教育",
  },
  {
    id: "curr",
    nameZh: "課程與教學學系",
    nameEn: "Department of Curriculum and Instruction",
    college: "教育",
  },
];

export default departments;
