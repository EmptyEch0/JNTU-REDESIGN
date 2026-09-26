export interface DepartmentFacultyListItem {
  sNo: number;
  name: string;
  qualification: string;
  studiedUniversity: string;
  graduationYear: string;
  designation: string;
  dateOfJoining: string;
  subject: string;
  associationType: string;
  totalExperience?: string;
  id?: string | number;
}

export function formatCleanDesignation(raw: string = ""): string {
  if (!raw) return "Assistant Professor";
  let d = raw.trim();

  // 1. Remove administrative roles like "& HOD", "& Head", "& Principal", "& Vice Principal", etc.
  d = d.replace(/\s*&\s*(hod|head of the department|head of department|head|principal|vice principal|director|coordinator)\b/gi, "");
  d = d.replace(/\s*\/\s*(hod|head|principal|vice principal)\b/gi, "");
  d = d.replace(/^(hod|head|principal|vice principal)\s*&\s*/gi, "");
  d = d.replace(/\((hod|head|principal|vice principal)\)/gi, "");

  // 2. Remove contract / temporary markers like (c), (C), (Contract), (Ad-hoc), etc.
  d = d.replace(/\s*\((c|contract|ad-hoc|adhoc|temporary|temp|regular)\)/gi, "");
  d = d.replace(/\s*-\s*(contract|regular|adhoc|ad-hoc)\b/gi, "");
  d = d.replace(/\s*\b(contract|adhoc|ad-hoc)\b/gi, "");

  // 3. Normalize abbreviations & spacing
  d = d.replace(/^asst\.?\s*prof\.?/i, "Assistant Professor");
  d = d.replace(/^assistant\s*prof\.?$/i, "Assistant Professor");
  d = d.replace(/^assoc\.?\s*prof\.?/i, "Associate Professor");
  d = d.replace(/^associate\s*prof\.?$/i, "Associate Professor");
  d = d.replace(/^prof\.?$/i, "Professor");
  d = d.replace(/\s+/g, " ").trim();

  if (!d || d === "&" || d === "-") {
    return "Assistant Professor";
  }

  return d;
}

export function getCleanAssociationType(associationType: string = "", designation: string = ""): string {
  const a = (associationType || "").toLowerCase().trim();
  const d = (designation || "").toLowerCase().trim();

  if (a.includes("contract") || d.includes("(c)") || d.includes("contract") || d.includes("adhoc") || d.includes("ad-hoc")) {
    return "Contract";
  }
  if (a.includes("adjunct") || d.includes("adjunct")) {
    return "Adjunct";
  }
  return "Regular";
}

export function getFacultyRank(designation: string = "", associationType: string = ""): number {
  const d = designation.toLowerCase().trim();
  const a = associationType.toLowerCase().trim();

  // 1. Professor (Senior Professor, Professor & HOD, Professor)
  if (d.includes("professor") && !d.includes("associate") && !d.includes("assistant") && !d.includes("asst")) {
    return 1;
  }
  // 2. Associate Professor
  if (d.includes("associate") || d.includes("assoc")) {
    return 2;
  }
  // 3. Assistant Professor (Regular)
  if (
    (d.includes("assistant") || d.includes("asst")) &&
    (a.includes("regular") || (!d.includes("(c)") && !d.includes("contract") && !d.includes("ad-hoc") && !a.includes("contract") && !a.includes("ad-hoc")))
  ) {
    return 3;
  }
  // 4. Assistant Professor (Contract / Ad-hoc)
  if (
    d.includes("assistant") ||
    d.includes("asst") ||
    d.includes("(c)") ||
    d.includes("contract") ||
    d.includes("ad-hoc") ||
    a.includes("contract") ||
    a.includes("ad-hoc")
  ) {
    return 4;
  }
  // 5. Other Technical / Non-teaching / Staff
  return 5;
}

export function sortFacultyList<T extends { designation: string; associationType?: string; name: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const rankA = getFacultyRank(a.designation, a.associationType);
    const rankB = getFacultyRank(b.designation, b.associationType);
    if (rankA !== rankB) return rankA - rankB;
    return a.name.localeCompare(b.name);
  });
}

export interface DepartmentNonTeachingStaffItem {
  sNo: number;
  name: string;
  qualification: string;
  designation: string;
  dateOfJoining: string;
  association: string;
}

export interface DepartmentFacultyProfileItem {
  id: string | number;
  name: string;
  designation: string;
  photo_url?: string | null;
}

export const DEPARTMENT_FACULTY_LIST: Record<string, DepartmentFacultyListItem[]> = {
  eee: [
    {
      sNo: 1,
      name: "Dr. V.S. Vakula",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2013",
      designation: "Assistant Professor & HOD",
      dateOfJoining: "10.01.2013",
      subject: "Power Systems",
      associationType: "Regular",
      id: "28",
    },
    {
      sNo: 2,
      name: "Dr. A. Padmaja",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2023",
      designation: "Assistant Professor",
      dateOfJoining: "03.01.2013",
      subject: "Power Systems",
      associationType: "Regular",
      id: "32",
    },
    {
      sNo: 3,
      name: "Mr. A. Siva Sankar Naik",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2013",
      designation: "Assistant Professor",
      dateOfJoining: "10.07.2014",
      subject: "Advanced Power Systems",
      associationType: "Contract",
      id: "33",
    },
    {
      sNo: 4,
      name: "Mr. P. Srinivasula Reddy",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2012",
      designation: "Assistant Professor",
      dateOfJoining: "14.09.2016",
      subject: "Advanced Power Systems",
      associationType: "Contract",
      id: "34",
    },
    {
      sNo: 5,
      name: "Mrs. T. Sirisha",
      qualification: "M.Tech",
      studiedUniversity: "JNTUH",
      graduationYear: "2014",
      designation: "Assistant Professor",
      dateOfJoining: "14.07.2015",
      subject: "Power Electronics",
      associationType: "Contract",
      id: "35",
    },
    {
      sNo: 6,
      name: "Mrs. Y. Chittemma",
      qualification: "M.E",
      studiedUniversity: "AUCE",
      graduationYear: "2011",
      designation: "Assistant Professor",
      dateOfJoining: "31.07.2015",
      subject: "Power Systems & Automation",
      associationType: "Contract",
      id: "36",
    },
    {
      sNo: 7,
      name: "Mr. Ch. Venkataramana",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2013",
      designation: "Assistant Professor",
      dateOfJoining: "09.06.2016",
      subject: "Power Systems",
      associationType: "Contract",
      id: "37",
    },
    {
      sNo: 8,
      name: "Mr. P. Pavan Kumar",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2015",
      designation: "Assistant Professor",
      dateOfJoining: "25.06.2016",
      subject: "Power Electronics & Drives",
      associationType: "Contract",
      id: "38",
    },
    {
      sNo: 9,
      name: "Mr. P. Siva Kumar",
      qualification: "M.Tech",
      studiedUniversity: "AUCE",
      graduationYear: "2016",
      designation: "Assistant Professor",
      dateOfJoining: "17.06.2017",
      subject: "Power Systems & Automation",
      associationType: "Contract",
      id: "39",
    },
    {
      sNo: 10,
      name: "Mr. Venkata Satya Durga Manohar Sahu",
      qualification: "M.E",
      studiedUniversity: "AUCE",
      graduationYear: "2015",
      designation: "Assistant Professor",
      dateOfJoining: "24.07.2017",
      subject: "Control Systems",
      associationType: "Contract",
      id: "40",
    },
    {
      sNo: 11,
      name: "Mrs. S. Rajitha",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2008",
      designation: "Assistant Professor",
      dateOfJoining: "22.12.2017",
      subject: "Advanced Power Systems",
      associationType: "Contract",
      id: "41",
    },
  ],
  cse: [
    {
      sNo: 1,
      name: "Dr. R. RajyaLakshmi",
      qualification: "Ph.D",
      studiedUniversity: "JNTUH",
      graduationYear: "2009",
      designation: "Professor",
      dateOfJoining: "24.01.2013",
      subject: "Network Security, Image Processing and Soft computing",
      associationType: "Regular",
      id: "2",
    },
    {
      sNo: 2,
      name: "Dr. R. Rajeswara Rao",
      qualification: "Ph.D",
      studiedUniversity: "JNTUH",
      graduationYear: "2010",
      designation: "Professor & Vice Principal",
      dateOfJoining: "03.01.2013",
      subject: "Speech Processing, Pattern Recognition, and Cloud Computing",
      associationType: "Regular",
      id: "3",
    },
    {
      sNo: 3,
      name: "Dr. A.S.N. Chakravarthy",
      qualification: "Ph.D",
      studiedUniversity: "ANU",
      graduationYear: "2011",
      designation: "Professor",
      dateOfJoining: "01.01.2013",
      subject: "Cloud Privacy, Digital Forensics and Biometrics",
      associationType: "Regular",
      id: "4",
    },
    {
      sNo: 4,
      name: "Mr. N. Venkatesh",
      qualification: "M.Tech,(Ph.D)",
      studiedUniversity: "Indian Statistical Institute Kolkata",
      graduationYear: "2008",
      designation: "Assistant Professor",
      dateOfJoining: "09.01.2013",
      subject: "Compilers and Parallel Computing",
      associationType: "Regular",
      id: "5",
    },
    {
      sNo: 5,
      name: "Dr. T. SivaRamaKrishna",
      qualification: "M.Tech,Ph.D",
      studiedUniversity: "AU",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "02.01.2013",
      subject: "Cyber Security, Forensics",
      associationType: "Regular",
      id: "6",
    },
    {
      sNo: 6,
      name: "Dr. P. Arunakumari",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2020",
      designation: "Assistant Professor & HOD",
      dateOfJoining: "01.01.2013",
      subject: "Pattern Recognition, Data Mining, Biometrics, and Soft Computing",
      associationType: "Regular",
      id: "1",
    },
    {
      sNo: 7,
      name: "Dr. S. Radha Krishna",
      qualification: "M.Tech,Ph.D",
      studiedUniversity: "MKU",
      graduationYear: "1997",
      designation: "Assistant Professor",
      dateOfJoining: "03.01.2013",
      subject: "Pattern Recognition, Speech Processing, Data Mining, and DBMS",
      associationType: "Regular",
      id: "8",
    },
    {
      sNo: 8,
      name: "Dr. S. Surekha",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2021",
      designation: "Assistant Professor",
      dateOfJoining: "08.01.2013",
      subject: "Data Mining, Machine Learning, and Soft Computing",
      associationType: "Regular",
      id: "7",
    },
    {
      sNo: 9,
      name: "Mr. R.D.D.V. Sivaram",
      qualification: "M.Tech,(Ph.D)",
      studiedUniversity: "AU",
      graduationYear: "2006",
      designation: "Assistant Professor",
      dateOfJoining: "07.01.2013",
      subject: "Wireless Sensor Networks and Internet of Things",
      associationType: "Regular",
      id: "9",
    },
    {
      sNo: 10,
      name: "Mr. Y.V. Amardeep",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2010",
      designation: "Assistant Professor (C)",
      dateOfJoining: "20.02.2012",
      subject: "Cyber Security",
      associationType: "Contract",
      id: "10",
    },
    {
      sNo: 11,
      name: "Mr. S. Ashok",
      qualification: "M.Tech",
      studiedUniversity: "GITAM",
      graduationYear: "2013",
      designation: "Assistant Professor (C)",
      dateOfJoining: "01.10.2013",
      subject: "Data Analytics and Predictive Analytics",
      associationType: "Contract",
      id: "11",
    },
    {
      sNo: 12,
      name: "Mr. V. Laxmiprasad",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2014",
      designation: "Assistant Professor (C)",
      dateOfJoining: "25.02.2015",
      subject: "Wireless Sensor Networks",
      associationType: "Contract",
      id: "13",
    },
    {
      sNo: 13,
      name: "Mr. V. Narayana Rao",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2012",
      designation: "Assistant Professor (C)",
      dateOfJoining: "19.09.2016",
      subject: "Computer Networks",
      associationType: "Contract",
      id: "12",
    },
    {
      sNo: 14,
      name: "Ms. M. Geetha Madhuri",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2017",
      designation: "Assistant Professor (C)",
      dateOfJoining: "12.07.2017",
      subject: "Computer Networks, Machine Learning, Data Base Management Systems",
      associationType: "Contract",
      id: "14",
    },
  ],
  it: [
    {
      sNo: 1,
      name: "Dr. Ch BinduMadhuri",
      qualification: "Ph.D",
      studiedUniversity: "GITAM",
      graduationYear: "2014",
      designation: "Asst. Prof. & Head",
      dateOfJoining: "04-01-2013",
      subject: "IT",
      associationType: "Regular",
      id: "217",
    },
    {
      sNo: 2,
      name: "Dr. G. Jaya Suma",
      qualification: "Ph.D",
      studiedUniversity: "Andhra University",
      graduationYear: "2011",
      designation: "Professor",
      dateOfJoining: "10-01-2013",
      subject: "CSE",
      associationType: "Regular",
      id: "216",
    },
    {
      sNo: 3,
      name: "Dr. G. Madhavi",
      qualification: "Ph.D",
      studiedUniversity: "JNTUH",
      graduationYear: "2017",
      designation: "Asst. Prof.",
      dateOfJoining: "01-01-2013",
      subject: "CSE",
      associationType: "Regular",
      id: "218",
    },
    {
      sNo: 4,
      name: "Dr. B. TirimulaRao",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2020",
      designation: "Asst. Prof.",
      dateOfJoining: "04-01-2013",
      subject: "CSE",
      associationType: "Regular",
      id: "215",
    },
    {
      sNo: 5,
      name: "Mr. Anil Wurity",
      qualification: "M.Tech",
      studiedUniversity: "GITAM",
      graduationYear: "2011",
      designation: "Asst. Prof.",
      dateOfJoining: "04-01-2013",
      subject: "CSE",
      associationType: "Regular",
      id: "219",
    },
    {
      sNo: 6,
      name: "R.S.S. Jyothi",
      qualification: "M.Tech",
      studiedUniversity: "GITAM",
      graduationYear: "2009",
      designation: "Asst. Prof.",
      dateOfJoining: "18-06-2012",
      subject: "CST",
      associationType: "Contract",
      id: "220",
    },
    {
      sNo: 7,
      name: "P. Eswar",
      qualification: "M.Tech (Ph.D)",
      studiedUniversity: "GITAM",
      graduationYear: "2013",
      designation: "Asst. Prof.",
      dateOfJoining: "13-06-2013",
      subject: "IT",
      associationType: "Contract",
      id: "221",
    },
    {
      sNo: 8,
      name: "K. Srikanth",
      qualification: "M.Tech (Ph.D)",
      studiedUniversity: "Andhra University",
      graduationYear: "2008",
      designation: "Asst. Prof.",
      dateOfJoining: "14-06-2014",
      subject: "IT",
      associationType: "Contract",
      id: "222",
    },
    {
      sNo: 9,
      name: "R. Roje Spandana",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "—",
      designation: "Asst. Prof.",
      dateOfJoining: "—",
      subject: "CSE",
      associationType: "Contract",
      id: "223",
    },
    {
      sNo: 10,
      name: "P. Venkateswaralu",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2014",
      designation: "Asst. Prof.",
      dateOfJoining: "06-08-2015",
      subject: "CSE",
      associationType: "Contract",
      id: "224",
    },
    {
      sNo: 11,
      name: "B. Manasa",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2017",
      designation: "Asst. Prof.",
      dateOfJoining: "19-06-2017",
      subject: "CSE",
      associationType: "Contract",
      id: "226",
    },
    {
      sNo: 12,
      name: "Madhumita Chanda",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2017",
      designation: "Asst. Prof.",
      dateOfJoining: "15-06-2017",
      subject: "CSE",
      associationType: "Contract",
      id: "225",
    },
  ],
  ece: [
    {
      sNo: 1,
      name: "Dr. G. Appala Naidu",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2008",
      designation: "Assistant Professor & HOD",
      dateOfJoining: "10.01.2013",
      subject: "ECE",
      associationType: "Regular",
      id: "48",
    },
    {
      sNo: 2,
      name: "Dr. K. Babulu",
      qualification: "Ph.D",
      studiedUniversity: "JNTUA",
      graduationYear: "1993",
      designation: "Professor",
      dateOfJoining: "07.07.2003",
      subject: "ECE",
      associationType: "Regular",
      id: "43",
    },
    {
      sNo: 3,
      name: "Dr. Ch Srinivasarao",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "1992",
      designation: "Professor",
      dateOfJoining: "31.12.2012",
      subject: "ECE",
      associationType: "Regular",
      id: "44",
    },
    {
      sNo: 4,
      name: "Dr N.Balaji",
      qualification: "Ph.D",
      studiedUniversity: "OU",
      graduationYear: "2011",
      designation: "Professor",
      dateOfJoining: "01.18.2013",
      subject: "ECE",
      associationType: "Regular",
      id: "45",
    },
    {
      sNo: 5,
      name: "Dr. K.C.B Rao",
      qualification: "Ph.D",
      studiedUniversity: "AU",
      graduationYear: "1992",
      designation: "Professor",
      dateOfJoining: "03.01.2013",
      subject: "ECE",
      associationType: "Regular",
      id: "46",
    },
    {
      sNo: 6,
      name: "Dr. R. Gurunadha",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2005",
      designation: "Associate Professor",
      dateOfJoining: "31-11-2006",
      subject: "ECE",
      associationType: "Regular",
      id: "47",
    },
    {
      sNo: 7,
      name: "Dr. B.Nalini",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2020",
      designation: "Assistant Professor",
      dateOfJoining: "02.01.2013",
      subject: "ECE",
      associationType: "Regular",
      id: "49",
    },
    {
      sNo: 8,
      name: "Sri A.Gangadhar",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "31-12-2012",
      subject: "ECE",
      associationType: "Regular",
      id: "50",
    },
    {
      sNo: 9,
      name: "Dr. M.Hema",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2009",
      designation: "Assistant Professor",
      dateOfJoining: "04.01.2013",
      subject: "ECE",
      associationType: "Regular",
      id: "51",
    },
    {
      sNo: 10,
      name: "Sri M.China Raju",
      qualification: "M.Tech",
      studiedUniversity: "AU",
      graduationYear: "2014",
      designation: "Asst.Prof(c)",
      dateOfJoining: "30.10.2013",
      subject: "ECE",
      associationType: "Contract",
      id: "52",
    },
    {
      sNo: 11,
      name: "Sri K.V. Raju",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2013",
      designation: "Asst.Prof(c)",
      dateOfJoining: "30.08.2013",
      subject: "ECE",
      associationType: "Contract",
      id: "53",
    },
    {
      sNo: 12,
      name: "Sri J.Sateesh",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2013",
      designation: "Asst.Prof(c)",
      dateOfJoining: "06.06.2014",
      subject: "ECE",
      associationType: "Contract",
      id: "54",
    },
    {
      sNo: 13,
      name: "Sri K.V.Satyanarayana",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2012",
      designation: "Asst.Prof(c)",
      dateOfJoining: "06.06.2014",
      subject: "ECE",
      associationType: "Contract",
      id: "55",
    },
    {
      sNo: 14,
      name: "Smt. V.Vijaya.Santhi",
      qualification: "M.Tech",
      studiedUniversity: "ANU",
      graduationYear: "2009",
      designation: "Asst.Prof(c)",
      dateOfJoining: "06.06.2014",
      subject: "ECE",
      associationType: "Contract",
      id: "56",
    },
    {
      sNo: 15,
      name: "Kum M.Krishnapriya",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2016",
      designation: "Asst.Prof(c)",
      dateOfJoining: "14.06.2017",
      subject: "ECE",
      associationType: "Contract",
      id: "57",
    },
    {
      sNo: 16,
      name: "Smt K.Anusha yadav",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2016",
      designation: "Asst.Prof(c)",
      dateOfJoining: "14.06.2017",
      subject: "ECE",
      associationType: "Contract",
      id: "58",
    },
  ],
  met: [
    {
      sNo: 1,
      name: "Dr. G. Swami Naidu",
      qualification: "M.Tech, Ph.D",
      studiedUniversity: "IIT Madras",
      graduationYear: "1998-2000",
      designation: "Professor & HOD",
      dateOfJoining: "16-11-2006",
      subject: "Metallurgical Engineering",
      associationType: "Regular",
      id: "66",
    },
    {
      sNo: 2,
      name: "K. Venkata Naidu",
      qualification: "M.Tech",
      studiedUniversity: "BPUT, Odisha",
      graduationYear: "—",
      designation: "Assistant professor",
      dateOfJoining: "09-06-2016",
      subject: "Metallurgical Engineering",
      associationType: "Contract",
      id: "59",
    },
    {
      sNo: 3,
      name: "A. Srinivasulu",
      qualification: "M.Tech",
      studiedUniversity: "IISc, Bangalore",
      graduationYear: "—",
      designation: "Assistant professor",
      dateOfJoining: "23-08-2017",
      subject: "Metallurgical Engineering",
      associationType: "Contract",
      id: "60",
    },
    {
      sNo: 4,
      name: "Sk. Karimulla",
      qualification: "M.E",
      studiedUniversity: "AU, Visakhapatnam",
      graduationYear: "2013-2015",
      designation: "Assistant professor",
      dateOfJoining: "02-01-2013",
      subject: "Metallurgical Engineering",
      associationType: "Contract",
      id: "61",
    },
    {
      sNo: 5,
      name: "B. R. Ambedkar",
      qualification: "M.Tech",
      studiedUniversity: "IIT Madras",
      graduationYear: "—",
      designation: "Assistant professor",
      dateOfJoining: "07-07-2014",
      subject: "Metallurgical Engineering",
      associationType: "Contract",
      id: "62",
    },
    {
      sNo: 6,
      name: "Sk. Naseema",
      qualification: "M.Tech",
      studiedUniversity: "AU, Visakhapatnam",
      graduationYear: "2015-17",
      designation: "Assistant professor",
      dateOfJoining: "13-11-2017",
      subject: "Metallurgical Engineering",
      associationType: "Contract",
      id: "63",
    },
    {
      sNo: 7,
      name: "B. Chenna Kesava",
      qualification: "M.Tech",
      studiedUniversity: "AU, Visakhapatnam",
      graduationYear: "2015-17",
      designation: "Assistant professor",
      dateOfJoining: "01-02-2018",
      subject: "Metallurgical Engineering",
      associationType: "Contract",
      id: "64",
    },
  ],
  civil: [
    {
      sNo: 1,
      name: "Dr. G. Appalanaidu",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2008",
      designation: "Assistant Professor & HOD",
      dateOfJoining: "10-01-2013",
      subject: "Structural Engineering & ECE",
      associationType: "Regular",
      id: "civil-hod",
    },
    {
      sNo: 2,
      name: "D. Jagan Mohan",
      qualification: "M.Tech",
      studiedUniversity: "GITAM",
      graduationYear: "2015",
      designation: "Asst.Professor(c)",
      dateOfJoining: "15-06-2016",
      subject: "Structures & Natural Disaster Management",
      associationType: "Contract",
      id: "civil-1",
    },
    {
      sNo: 3,
      name: "R. Balamurali Krishna",
      qualification: "M.Tech",
      studiedUniversity: "NIT Rourkela",
      graduationYear: "2015",
      designation: "Asst.Professor(c)",
      dateOfJoining: "22-06-2016",
      subject: "Structural Engineering",
      associationType: "Contract",
      id: "civil-2",
    },
    {
      sNo: 4,
      name: "Ch. Giridhar Kumar",
      qualification: "M.Tech",
      studiedUniversity: "Acharya Nagarjuna",
      graduationYear: "2014",
      designation: "Asst.Professor(c)",
      dateOfJoining: "16-06-2017",
      subject: "Structural Engineering",
      associationType: "Contract",
      id: "civil-3",
    },
    {
      sNo: 5,
      name: "T. S. D. Phanindranath",
      qualification: "M.Tech (Ph.D Pursuing)",
      studiedUniversity: "JNTU-K",
      graduationYear: "2016",
      designation: "Asst.Professor(c)",
      dateOfJoining: "03-08-2016",
      subject: "Structural Engineering",
      associationType: "Contract",
      id: "civil-4",
    },
  ],
  mech: [
    {
      sNo: 1,
      name: "Dr. G. Swami Naidu",
      qualification: "Ph.D",
      studiedUniversity: "IIT Madras / JNTUK",
      graduationYear: "2011",
      designation: "Professor & HOD",
      dateOfJoining: "16-11-2006",
      subject: "Metallurgical & Materials Engineering",
      associationType: "Regular",
      id: "66",
    },
    {
      sNo: 2,
      name: "Dr. N. Mohan Rao",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2008",
      designation: "Professor",
      dateOfJoining: "23/11/2000",
      subject: "Robotics, Vibrations, kinematics of Machinery, Dynamics of Machinery",
      associationType: "Regular",
      id: "67",
    },
    {
      sNo: 3,
      name: "Dr. K. Srinivasa Prasad",
      qualification: "Ph.D",
      studiedUniversity: "JNTUK",
      graduationYear: "2021",
      designation: "Assistant Professor",
      dateOfJoining: "02-01-2013",
      subject: "NANO Composites and Computer Integrated Manufacturing",
      associationType: "Regular",
      id: "65",
    },
    {
      sNo: 4,
      name: "Mr. V. Mani Kumar",
      qualification: "M.Tech",
      studiedUniversity: "JNTUH",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "07-01-2013",
      subject: "Thermal Engineering and Fluid Mechanics",
      associationType: "Regular",
      id: "68",
    },
    {
      sNo: 5,
      name: "Dr. C. Neelima Devi",
      qualification: "Ph.D",
      studiedUniversity: "NITW",
      graduationYear: "2017",
      designation: "Assistant professor",
      dateOfJoining: "04-01-2013",
      subject: "CAD/CAM, Nano composites and Machine Design",
      associationType: "Regular",
      id: "69",
    },
    {
      sNo: 6,
      name: "Mr. T. Lakshmana Kishore",
      qualification: "M.Tech",
      studiedUniversity: "NIT CALICUT",
      graduationYear: "2003",
      designation: "Assistant Professor",
      dateOfJoining: "07-01-2013",
      subject: "Heat Transfer, Fluid Mechanics, Computational Fluid Dynamics, Thermal Engineering",
      associationType: "Regular",
      id: "70",
    },
    {
      sNo: 7,
      name: "Smt. I. Sri Phani Sushma",
      qualification: "M.Tech",
      studiedUniversity: "JNTUH",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "09-01-2013",
      subject: "Production, CAD/CAM and Metrology",
      associationType: "Regular",
      id: "71",
    },
    {
      sNo: 8,
      name: "Mr. D. Rajesh",
      qualification: "M.Tech",
      studiedUniversity: "JNTUA",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "10-10-2010",
      subject: "Refrigeration & Air-Conditioning, Heat Transfer and Computational Fluid Dynamics",
      associationType: "Contract",
      id: "72",
    },
    {
      sNo: 9,
      name: "Mr. M. Komaleswara Rao",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "23-07-2012",
      subject: "Machine Design and Robotics",
      associationType: "Contract",
      id: "73",
    },
    {
      sNo: 10,
      name: "Mr. Abdul Khurshid",
      qualification: "M.Tech",
      studiedUniversity: "GITAM",
      graduationYear: "2015",
      designation: "Assistant Professor",
      dateOfJoining: "06-06-2016",
      subject: "NANO Composites and COMPOSITE Materials",
      associationType: "Contract",
      id: "74",
    },
    {
      sNo: 11,
      name: "Mr. L. Krishna Chaitanya",
      qualification: "M.Tech",
      studiedUniversity: "AU",
      graduationYear: "2016",
      designation: "Assistant Professor",
      dateOfJoining: "06-06-2016",
      subject: "Mechanical Vibrations and Finite Element Methods",
      associationType: "Contract",
      id: "75",
    },
    {
      sNo: 12,
      name: "Mr. A. V. S. Gowtham",
      qualification: "M.Tech",
      studiedUniversity: "JNTUK-UCEV",
      graduationYear: "2017",
      designation: "Assistant Professor",
      dateOfJoining: "22-12-2017",
      subject: "Mechanics of solids, Finite element methods",
      associationType: "Contract",
      id: "76",
    },
  ],
  bshss: [
    {
      sNo: 1,
      name: "Dr. Shaik Kalesha Vali",
      qualification: "Ph.D",
      studiedUniversity: "Andhra University",
      graduationYear: "2009",
      designation: "Professor",
      dateOfJoining: "16-01-2013",
      subject: "Mathematics",
      associationType: "Regular",
      totalExperience: "23 years",
      id: "77",
    },
    {
      sNo: 2,
      name: "Dr. K. Sobhan Babu",
      qualification: "Ph.D",
      studiedUniversity: "SV University",
      graduationYear: "2011",
      designation: "Professor",
      dateOfJoining: "31-12-2012",
      subject: "Mathematics",
      associationType: "Regular",
      totalExperience: "19 years",
      id: "78",
    },
    {
      sNo: 3,
      name: "Dr. A. V. Papa Rao",
      qualification: "Ph.D",
      studiedUniversity: "JNT University Kakinada",
      graduationYear: "2014",
      designation: "Assistant Professor",
      dateOfJoining: "10-01-2013",
      subject: "Mathematics",
      associationType: "Regular",
      totalExperience: "18 years",
      id: "79",
    },
    {
      sNo: 4,
      name: "Ms. V. Krishna Aneela",
      qualification: "M.Sc",
      studiedUniversity: "Krishna University",
      graduationYear: "2017",
      designation: "Assistant Professor",
      dateOfJoining: "01-08-2017",
      subject: "Mathematics",
      associationType: "Contract",
      totalExperience: "2 years",
      id: "80",
    },
    {
      sNo: 5,
      name: "Mr. V. Santosh Kumar",
      qualification: "M.Sc, APSET",
      studiedUniversity: "Dr.B.R  Ambedkar University",
      graduationYear: "2016",
      designation: "Assistant Professor",
      dateOfJoining: "01-08-2017",
      subject: "Mathematics",
      associationType: "Contract",
      totalExperience: "3 years",
      id: "81",
    },
    {
      sNo: 6,
      name: "Dr. G. J. Naga Raju",
      qualification: "Ph.D",
      studiedUniversity: "Andhra University",
      graduationYear: "2006",
      designation: "Assistant Professor & Head",
      dateOfJoining: "18-01-2013",
      subject: "Physics",
      associationType: "Regular",
      totalExperience: "19 years",
      id: "82",
    },
    {
      sNo: 7,
      name: "Ms. K Swathi",
      qualification: "M.Sc",
      studiedUniversity: "Andhra University",
      graduationYear: "2016",
      designation: "Assistant Professor",
      dateOfJoining: "21-09-2015",
      subject: "Physics",
      associationType: "Contract",
      totalExperience: "5 years",
      id: "83",
    },
    {
      sNo: 8,
      name: "Ms. D Swapna",
      qualification: "M.Sc",
      studiedUniversity: "Andhra University",
      graduationYear: "2009",
      designation: "Assistant Professor",
      dateOfJoining: "07-10-2015",
      subject: "Physics",
      associationType: "Contract",
      totalExperience: "7 years",
      id: "84",
    },
    {
      sNo: 9,
      name: "Dr. M. Sowbhagya Lakshmi",
      qualification: "M.Sc, Ph.D CSIR-NET, APSET",
      studiedUniversity: "Andhra University",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "09-01-2013",
      subject: "Chemistry",
      associationType: "Regular",
      totalExperience: "7 years",
      id: "85",
    },
    {
      sNo: 10,
      name: "Dr. B Dharma Rao",
      qualification: "Ph.D",
      studiedUniversity: "Andhra University",
      graduationYear: "2015",
      designation: "Assistant Professor",
      dateOfJoining: "07-09-2015",
      subject: "Chemistry",
      associationType: "Contract",
      totalExperience: "11 years",
      id: "86",
    },
    {
      sNo: 11,
      name: "Smt. J. Sucharitha",
      qualification: "M.Phil, APSET",
      studiedUniversity: "Andhra University",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "12-10-2015",
      subject: "Chemistry",
      associationType: "Contract",
      totalExperience: "10 years",
      id: "87",
    },
    {
      sNo: 12,
      name: "Mr. R. Santha Rao",
      qualification: "M.A",
      studiedUniversity: "Andhra University",
      graduationYear: "2007",
      designation: "Assistant Professor",
      dateOfJoining: "18-07-2011",
      subject: "English",
      associationType: "Contract",
      totalExperience: "9 years",
      id: "88",
    },
    {
      sNo: 13,
      name: "Mr. N. Suresh Kumar",
      qualification: "M.A",
      studiedUniversity: "Andhra University",
      graduationYear: "2015",
      designation: "Assistant Professor",
      dateOfJoining: "09-06-2016",
      subject: "English",
      associationType: "Contract",
      totalExperience: "4 years",
      id: "89",
    },
    {
      sNo: 14,
      name: "Ms. B. Sri Durga",
      qualification: "M.A",
      studiedUniversity: "Andhra University",
      graduationYear: "2014",
      designation: "Assistant Professor",
      dateOfJoining: "06-08-2016",
      subject: "English",
      associationType: "Contract",
      totalExperience: "6 years",
      id: "90",
    },
    {
      sNo: 15,
      name: "Dr. P. Sreedevi",
      qualification: "Ph.D",
      studiedUniversity: "Andhra University",
      graduationYear: "2010",
      designation: "Assistant Professor",
      dateOfJoining: "07-01-2013",
      subject: "Commerce",
      associationType: "Regular",
      totalExperience: "15 years",
      id: "91",
    },
    {
      sNo: 16,
      name: "Mr. P.L Sunand",
      qualification: "MBA, M.Com, M.A",
      studiedUniversity: "JNTUH, SVU, GITAM",
      graduationYear: "2008, 2014, 2018",
      designation: "Assistant Professor",
      dateOfJoining: "06-09-2010",
      subject: "Economics",
      associationType: "Contract",
      totalExperience: "10 years",
      id: "92",
    },
  ],
};

// Aliases for alternate URL slugs
DEPARTMENT_FACULTY_LIST.metallurgy = DEPARTMENT_FACULTY_LIST.met;
DEPARTMENT_FACULTY_LIST.metallurgical = DEPARTMENT_FACULTY_LIST.met;
DEPARTMENT_FACULTY_LIST["metallurgical-engineering"] = DEPARTMENT_FACULTY_LIST.met;
DEPARTMENT_FACULTY_LIST["metallurgical_engineering"] = DEPARTMENT_FACULTY_LIST.met;
DEPARTMENT_FACULTY_LIST.ce = DEPARTMENT_FACULTY_LIST.civil;
DEPARTMENT_FACULTY_LIST["civil-engineering"] = DEPARTMENT_FACULTY_LIST.civil;
DEPARTMENT_FACULTY_LIST["civil_engineering"] = DEPARTMENT_FACULTY_LIST.civil;
DEPARTMENT_FACULTY_LIST.me = DEPARTMENT_FACULTY_LIST.mech;
DEPARTMENT_FACULTY_LIST.mechanical = DEPARTMENT_FACULTY_LIST.mech;
DEPARTMENT_FACULTY_LIST["mechanical-engineering"] = DEPARTMENT_FACULTY_LIST.mech;
DEPARTMENT_FACULTY_LIST["mechanical_engineering"] = DEPARTMENT_FACULTY_LIST.mech;
DEPARTMENT_FACULTY_LIST["computer-science"] = DEPARTMENT_FACULTY_LIST.cse;
DEPARTMENT_FACULTY_LIST["computer-science-and-engineering"] = DEPARTMENT_FACULTY_LIST.cse;
DEPARTMENT_FACULTY_LIST["information-technology"] = DEPARTMENT_FACULTY_LIST.it;
DEPARTMENT_FACULTY_LIST["electronics-and-communication-engineering"] = DEPARTMENT_FACULTY_LIST.ece;
DEPARTMENT_FACULTY_LIST["electrical-and-electronics-engineering"] = DEPARTMENT_FACULTY_LIST.eee;
DEPARTMENT_FACULTY_LIST.sh = DEPARTMENT_FACULTY_LIST.bshss;
DEPARTMENT_FACULTY_LIST.bsh = DEPARTMENT_FACULTY_LIST.bshss;
DEPARTMENT_FACULTY_LIST["basic-sciences"] = DEPARTMENT_FACULTY_LIST.bshss;
DEPARTMENT_FACULTY_LIST["basic-sciences-and-humanities"] = DEPARTMENT_FACULTY_LIST.bshss;
DEPARTMENT_FACULTY_LIST["humanities-and-basic-sciences"] = DEPARTMENT_FACULTY_LIST.bshss;

export const DEPARTMENT_NON_TEACHING_STAFF: Record<string, DepartmentNonTeachingStaffItem[]> = {
  eee: [
    {
      sNo: 1,
      name: "Mr. M.S. Raju",
      qualification: "I.T.I (Electrical), B.A",
      designation: "Mechanic",
      dateOfJoining: "15.05.2008",
      association: "Sri Sai Saraswathi Technical (Non-Teaching Union)",
    },
    {
      sNo: 2,
      name: "Mr. R. Ram Mohan Rao",
      qualification: "Diploma (Electrical)",
      designation: "Technical Electrical Work Inspector",
      dateOfJoining: "01.11.2008",
      association: "Sri Sai Saraswathi Technical (Non-Teaching Union)",
    },
    {
      sNo: 3,
      name: "Mr. B. Ch. V. Maheswara Rao",
      qualification: "B.Com, I.T.I (Electrical)",
      designation: "Technician",
      dateOfJoining: "02.11.2009",
      association: "Sri Sai Saraswathi Technical (Non-Teaching Union)",
    },
    {
      sNo: 4,
      name: "Mr. R. Bangari Naidu",
      qualification: "B.A IRPM, PGDCA (A.U)",
      designation: "Technician",
      dateOfJoining: "01.02.2010",
      association: "Sri Sai Saraswathi Technical (Non-Teaching Union)",
    },
    {
      sNo: 5,
      name: "Mr. M. Ramana",
      qualification: "Degree",
      designation: "Non technical Work Inspector",
      dateOfJoining: "30.08.2008",
      association: "Sri Sai Saraswathi Technical (Non-Teaching Union)",
    },
  ],
  cse: [
    {
      sNo: 1,
      name: "Mr. B. Maheswara Rao",
      qualification: "Diploma(CSE)",
      designation: "Mechanic",
      dateOfJoining: "01.10.2009",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 2,
      name: "Mr. M. SurapuNaidu",
      qualification: "MCA",
      designation: "Technician",
      dateOfJoining: "12.11.2008",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 3,
      name: "Mr. N. SanyasiRao Yadav",
      qualification: "B.A",
      designation: "Technician",
      dateOfJoining: "14.12.2007",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 4,
      name: "Mrs. P. Janaki",
      qualification: "M.A",
      designation: "Attendar",
      dateOfJoining: "13.06.2013",
      association: "Non-Teaching Staff Association",
    },
  ],
  it: [
    {
      sNo: 1,
      name: "J. SATEESH",
      qualification: "BSC",
      designation: "MECHANIC",
      dateOfJoining: "01-12-2009",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 2,
      name: "B. YERRI NAIDU",
      qualification: "BA, DCA",
      designation: "TECHNICIAN",
      dateOfJoining: "01-01-2010",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 3,
      name: "E. RAMA KRISHNA",
      qualification: "BA, BLISC, PGDCA",
      designation: "TECHNICIAN",
      dateOfJoining: "08-02-2010",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 4,
      name: "K. RAMANAMMA",
      qualification: "BA, DSE(Computers)",
      designation: "ATTENDER",
      dateOfJoining: "11-06-2014",
      association: "Non-Teaching Staff Association",
    },
  ],
  ece: [
    {
      sNo: 1,
      name: "Sri B.Chandra sekhar Rao",
      qualification: "Degree",
      designation: "Technician",
      dateOfJoining: "14-12-2007",
      association: "Out Sourcing",
    },
    {
      sNo: 2,
      name: "Sri P.Krushnum Naidu",
      qualification: "Inter",
      designation: "Technician",
      dateOfJoining: "14-12-2007",
      association: "Out Sourcing",
    },
    {
      sNo: 3,
      name: "Sri.P.Suresh",
      qualification: "Inter",
      designation: "Technician",
      dateOfJoining: "03-06-2008",
      association: "Out Sourcing",
    },
    {
      sNo: 4,
      name: "Sri.M.Adibabu",
      qualification: "Degree",
      designation: "Technician",
      dateOfJoining: "03-08-2010",
      association: "Out Sourcing",
    },
  ],
  met: [
    {
      sNo: 1,
      name: "M. Kesava Rao",
      qualification: "I.T.I (Fitter), B.A.",
      designation: "Mechanic",
      dateOfJoining: "15-05-2008",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 2,
      name: "B. Kiran Kumar",
      qualification: "I.T.I (Fitter), B.A.",
      designation: "Mechanic",
      dateOfJoining: "01-10-2008",
      association: "Non-Teaching Staff Association",
    },
  ],
  civil: [
    {
      sNo: 1,
      name: "G Srinivasarao",
      qualification: "ITI",
      designation: "Workshop mechanic",
      dateOfJoining: "15-12-2007",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 2,
      name: "U. Bangaraju",
      qualification: "B.Sc GMP",
      designation: "Technician",
      dateOfJoining: "01-04-2010",
      association: "Non-Teaching Staff Association",
    },
  ],
  mech: [],
  bshss: [
    {
      sNo: 1,
      name: "Mr. T.V. Krishna",
      qualification: "Diploma",
      designation: "Lab & Health Assistant",
      dateOfJoining: "15-05-2008",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 2,
      name: "Mr. R. Mukesh Siva Kumar",
      qualification: "B. Sc",
      designation: "Technician",
      dateOfJoining: "13-11-2009",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 3,
      name: "Mr. K.S.R.C. Raju",
      qualification: "I.T.I",
      designation: "Technician",
      dateOfJoining: "01-01-2010",
      association: "Non-Teaching Staff Association",
    },
    {
      sNo: 4,
      name: "Mr. K. Rambabu",
      qualification: "9th",
      designation: "Attendant",
      dateOfJoining: "10-07-2015",
      association: "Non-Teaching Staff Association",
    },
  ],
};

DEPARTMENT_NON_TEACHING_STAFF.metallurgy = DEPARTMENT_NON_TEACHING_STAFF.met;
DEPARTMENT_NON_TEACHING_STAFF.metallurgical = DEPARTMENT_NON_TEACHING_STAFF.met;
DEPARTMENT_NON_TEACHING_STAFF["metallurgical-engineering"] = DEPARTMENT_NON_TEACHING_STAFF.met;
DEPARTMENT_NON_TEACHING_STAFF["metallurgical_engineering"] = DEPARTMENT_NON_TEACHING_STAFF.met;
DEPARTMENT_NON_TEACHING_STAFF.ce = DEPARTMENT_NON_TEACHING_STAFF.civil;
DEPARTMENT_NON_TEACHING_STAFF["civil-engineering"] = DEPARTMENT_NON_TEACHING_STAFF.civil;
DEPARTMENT_NON_TEACHING_STAFF["civil_engineering"] = DEPARTMENT_NON_TEACHING_STAFF.civil;
DEPARTMENT_NON_TEACHING_STAFF.me = DEPARTMENT_NON_TEACHING_STAFF.mech;
DEPARTMENT_NON_TEACHING_STAFF.mechanical = DEPARTMENT_NON_TEACHING_STAFF.mech;
DEPARTMENT_NON_TEACHING_STAFF["mechanical-engineering"] = DEPARTMENT_NON_TEACHING_STAFF.mech;
DEPARTMENT_NON_TEACHING_STAFF["mechanical_engineering"] = DEPARTMENT_NON_TEACHING_STAFF.mech;
DEPARTMENT_NON_TEACHING_STAFF["computer-science"] = DEPARTMENT_NON_TEACHING_STAFF.cse;
DEPARTMENT_NON_TEACHING_STAFF["computer-science-and-engineering"] = DEPARTMENT_NON_TEACHING_STAFF.cse;
DEPARTMENT_NON_TEACHING_STAFF["information-technology"] = DEPARTMENT_NON_TEACHING_STAFF.it;
DEPARTMENT_NON_TEACHING_STAFF["electronics-and-communication-engineering"] = DEPARTMENT_NON_TEACHING_STAFF.ece;
DEPARTMENT_NON_TEACHING_STAFF["electrical-and-electronics-engineering"] = DEPARTMENT_NON_TEACHING_STAFF.eee;
DEPARTMENT_NON_TEACHING_STAFF.sh = DEPARTMENT_NON_TEACHING_STAFF.bshss;
DEPARTMENT_NON_TEACHING_STAFF.bsh = DEPARTMENT_NON_TEACHING_STAFF.bshss;
DEPARTMENT_NON_TEACHING_STAFF["basic-sciences"] = DEPARTMENT_NON_TEACHING_STAFF.bshss;
DEPARTMENT_NON_TEACHING_STAFF["basic-sciences-and-humanities"] = DEPARTMENT_NON_TEACHING_STAFF.bshss;
DEPARTMENT_NON_TEACHING_STAFF["humanities-and-basic-sciences"] = DEPARTMENT_NON_TEACHING_STAFF.bshss;

export const DEPARTMENT_EXPLICIT_FACULTY_PROFILES: Record<string, DepartmentFacultyProfileItem[]> = {
  eee: [
    { id: "28", name: "Dr. V.S. Vakula", designation: "Assistant Professor & HoD", photo_url: "uploads/departments/faculty_photos/eee/dr--v--s--vakula.jpg" },
    { id: "29", name: "Dr. G. Saraswathi", designation: "Professor", photo_url: "uploads/departments/faculty_photos/eee/dr--g--saraswathi.jpg" },
    { id: "30", name: "Prof. K. Srikumar", designation: "Professor", photo_url: "uploads/departments/faculty_photos/eee/p-siva-kumar.jpeg" },
    { id: "31", name: "Dr. Y S Kishore Babu", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/eee/dr-y-s-kishore-babu.jpg" },
    { id: "32", name: "Dr. A. Padmaja", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/eee/dr--a--padmaja.png" },
    { id: "33", name: "Azamira Siva Sankara Naik", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/a--siva-sankar-naik.jpg" },
    { id: "34", name: "Pilli Sreenivasulareddy", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/p--sreenivasula-reddy.jpg" },
    { id: "35", name: "Tammineni Sirisha", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/t--sirisha.jpg" },
    { id: "36", name: "Yerra Chittemma", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/y-chittemma.jpg" },
    { id: "37", name: "Chevala Venkataramana", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/ch--venkata-ramana.jpg" },
    { id: "38", name: "Potula Pavan Kumar", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/p--pavan-kumar.jpeg" },
    { id: "39", name: "Mr. Panigrahi Siva Kumar", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/p--siva-kumar.jpg" },
    { id: "40", name: "Dr. Venkata Satya Durga Manohar Sahu", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/v--s--d--manohar-sahu.jpg" },
    { id: "41", name: "Saka Rajitha", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/eee/s-rajitha.png" },
  ],
  cse: [
    { id: "1", name: "Dr. P. Aruna Kumari", designation: "Assistant Professor & HoD", photo_url: "uploads/departments/faculty_photos/cse/dr-p-aruna-kumari.jpg" },
    { id: "2", name: "Dr. D. Rajya Lakshmi", designation: "Professor", photo_url: "uploads/departments/faculty_photos/cse/dr--d--rajya-lakshmi.jpg" },
    { id: "3", name: "Dr. R. Rajeswara Rao", designation: "Professor & Vice Principal", photo_url: "https://jntugvcev.edu.in/wp-content/uploads/2020/08/4-3.jpg" },
    { id: "4", name: "Dr. A S N Chakravarthy", designation: "Professor", photo_url: "uploads/departments/faculty_photos/cse/dr--a-s-n-chakravarthy.jpg" },
    { id: "5", name: "N Venkatesh", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/cse/n-venkatesh.jpeg" },
    { id: "6", name: "Dr. Siva Rama Krishna T.", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/cse/dr--siva-rama-krishna-t-.jpg" },
    { id: "7", name: "S. Surekha", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/cse/s-surekha.jpg" },
    { id: "8", name: "Dr. S. Radha Krishna", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/cse/dr-s-radha-krishna.jpg" },
    { id: "9", name: "D D V Sivaram Rolangi", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/cse/d-d-v-sivaram-rolangi.jpg" },
    { id: "10", name: "Yerra V Amardeep", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/cse/yerra-v-amardeep.jpg" },
    { id: "11", name: "Ashok Suragala", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/cse/ashok-suragala.jpg" },
    { id: "12", name: "Vemulada Narayanarao", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/cse/vemulada-narayanarao.jpg" },
    { id: "13", name: "V. Laxmi Prasad", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/cse/v--laxmi-prasad.jpg" },
    { id: "14", name: "M. Geetha Madhuri", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/cse/m--geetha-madhuri.jpg" },
  ],
  it: [
    { id: "215", name: "Dr. Tirimula Rao Benala", designation: "Associate Professor & HOD", photo_url: "uploads/departments/faculty_photos/it/dr--tirimula-rao-benala.jpg" },
    { id: "216", name: "Prof. G. Jaya Suma", designation: "Professor & Registrar, JNTU-GV", photo_url: "local-assets/uploads/departments/it/faculty/prof-g-jaya-suma-1787387361-759444.jpg" },
    { id: "217", name: "Dr. Ch. Bindu Madhuri", designation: "Associate Professor", photo_url: "uploads/departments/faculty_photos/it/dr--ch--bindu-madhuri.jpg" },
    { id: "218", name: "Dr. G. Madhavi", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/it/dr--g--madhavi.jpg" },
    { id: "219", name: "Mr. Anil Wurity", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/it/w--anil.jpg" },
    { id: "220", name: "R. S. S. Jyothi", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/it/r--s--s--jyothi.jpeg" },
    { id: "221", name: "Eswar Patnala", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/it/eswar-patnaala.jpg" },
    { id: "222", name: "Dr. Kolli Srikanth", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/it/dr--kolli--srikanth.jpg" },
    { id: "223", name: "Rajeti Roje Spandana", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/it/rajeti-roje-spandana.jpeg" },
    { id: "224", name: "Pynam Venkateswarlu", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/it/pynam-venkateswarlu.jpg" },
    { id: "225", name: "Madhumita Chanda", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/it/madhumita-chanda.jpg" },
    { id: "226", name: "Bobbadi Manasa", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/it/bobbadi-manasa.jpg" },
  ],
  ece: [
    { id: "48", name: "Dr. Gottapu Appala Naidu", designation: "Assistant Professor & HOD", photo_url: "uploads/departments/faculty_photos/ece/gottapu-appala-naidu.jpeg" },
    { id: "43", name: "Prof. K. Babulu", designation: "Professor", photo_url: "uploads/departments/faculty_photos/ece/k-babulu.jpg" },
    { id: "44", name: "Prof. Ch. Srinivasa Rao", designation: "Professor", photo_url: "uploads/departments/faculty_photos/ece/ch-srinivasa-rao.jpg" },
    { id: "45", name: "Prof. N. Balaji", designation: "Professor", photo_url: "uploads/departments/faculty_photos/ece/n-balaji.jpg" },
    { id: "46", name: "Prof. K. C. B. Rao", designation: "Professor of ECE", photo_url: "uploads/departments/faculty_photos/ece/k-c-b-rao.jpg" },
    { id: "47", name: "Dr. Ravva Gurunadha", designation: "Associate Professor", photo_url: "uploads/departments/faculty_photos/ece/dr--ravva-gurunadha.jpg" },
    { id: "49", name: "Dr. Nalini Bodasingi", designation: "Assistant Professor", photo_url: "https://dmc.jntugv.edu.in/static/media/Coordnitor_dmc.85b4a83327642f173145.jpg" },
    { id: "50", name: "Akurathi Gangadhar", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/ece/a--gangadhar.jpg" },
    { id: "51", name: "Dr. M. Hema", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/ece/dr--m-hema.jpg" },
    { id: "52", name: "CHINA RAJU MANDA", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/ece/m--china-raju.jpg" },
    { id: "53", name: "Kaki Veerraju", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/ece/k--veerraju.jpg" },
    { id: "54", name: "Jallu Sateesh", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/ece/j--sateesh.png" },
    { id: "55", name: "K. V. Satyanarayana", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/ece/k--v--satyanarayana.jpg" },
    { id: "56", name: "V. Vijaya Santhi", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/ece/v-vijaya-santhi.jpg" },
    { id: "57", name: "Krishnapriya Mallampalli", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/ece/m--krishna-priya.jpeg" },
    { id: "58", name: "Kona Anushayadav", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/ece/k--anusha-yadav.jpg" },
  ],
  met: [
    { id: "66", name: "Dr. G. Swami Naidu", designation: "Professor & HOD", photo_url: "uploads/departments/faculty_photos/mech/dr--g--swami-naidu.jpg" },
    { id: "59", name: "Kolli Venkata Naidu", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/met/kolli-venkata-naidu.jpg" },
    { id: "60", name: "Arnuri Srinivasulu", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/met/arnuri-srinivasulu.jpg" },
    { id: "61", name: "Shaik Karimulla", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/met/shaik-karimulla.jpg" },
    { id: "62", name: "Bula Ratna Kumar Ambedkar", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/met/bula-ratna-kumar-ambedkar.jpg" },
    { id: "63", name: "Shaik Naseema", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/met/shaik-naseema.jpg" },
    { id: "64", name: "Banothu Chenna Kesava", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/met/banothu-chenna-kesava.jpg" },
  ],
  civil: [
    { id: "civil-hod", name: "Dr. G. Appalanaidu", designation: "Assistant Professor & HOD", photo_url: "uploads/departments/faculty_photos/ece/gottapu-appala-naidu.jpeg" },
    { id: "civil-1", name: "Dasari Jagan Mohan", designation: "Assistant Professor (C)", photo_url: "uploads/2020/07/CIVIL-1-D.-Jagan-Mohan.jpg" },
    { id: "civil-2", name: "Ramba Balamurali Krishna", designation: "Assistant Professor (C)", photo_url: "uploads/2020/07/CIVIL-2-R.-Balamurali-krishna.jpg" },
    { id: "civil-3", name: "Chodavarapu Giridhar Kumar", designation: "Assistant Professor (C)", photo_url: "uploads/2020/07/CIVIL-4-Ch.Giridhar-Kumar.jpg" },
    { id: "civil-4", name: "T S D Phanindranath", designation: "Assistant Professor (C)", photo_url: "uploads/2020/07/CIVIL-5-T.S.D.Phanindranath.jpg" },
  ],
  mech: [
    { id: "66", name: "Dr. G. Swami Naidu", designation: "Professor & HOD", photo_url: "uploads/departments/faculty_photos/mech/dr--g--swami-naidu.jpg" },
    { id: "67", name: "Dr. N. Mohan Rao", designation: "Professor", photo_url: "uploads/departments/faculty_photos/mech/dr-n-mohan-rao.jpg" },
    { id: "65", name: "Dr. K. Srinivasa Prasad", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/mech/dr--k--srinivasa-prasad.jpg" },
    { id: "68", name: "Mr. V. Mani Kumar", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/mech/v--mani-kumar.jpg" },
    { id: "69", name: "Dr. C. Neelima Devi", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/mech/dr--c--neelima-devi.jpg" },
    { id: "70", name: "Mr. T. Lakshmana Kishore", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/mech/t-lakshmana-kishore.jpg" },
    { id: "71", name: "Smt. I. Sri Phani Sushma", designation: "Assistant Professor", photo_url: "uploads/departments/faculty_photos/mech/i--sri-phani-sushma.jpg" },
    { id: "72", name: "Mr. D. Rajesh", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/mech/davala-rajesh.jpg" },
    { id: "73", name: "Mr. M. Komaleswara Rao", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/mech/mallela-komaleswara-rao.jpg" },
    { id: "74", name: "Mr. Abdul Khurshid", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/mech/abdul-khurshid.jpg" },
    { id: "75", name: "Mr. L. Krishna Chaitanya", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/mech/l--krishna-chaitanya.jpg" },
    { id: "76", name: "Mr. A. V. S. Gowtham", designation: "Assistant Professor (C)", photo_url: "uploads/departments/faculty_photos/mech/addepalli-venkata-surya-gowtham.jpg" },
  ],
  bshss: [
    { id: "82", name: "Dr. G. J. Naga Raju", designation: "Assistant Professor & Head", photo_url: null },
    { id: "77", name: "Dr. Shaik Kalesha Vali", designation: "Professor", photo_url: null },
    { id: "78", name: "Dr. K. Sobhan Babu", designation: "Professor", photo_url: null },
    { id: "79", name: "Dr. A. V. Papa Rao", designation: "Assistant Professor", photo_url: null },
    { id: "80", name: "Ms. V. Krishna Aneela", designation: "Assistant Professor (C)", photo_url: null },
    { id: "81", name: "Mr. V. Santosh Kumar", designation: "Assistant Professor (C)", photo_url: null },
    { id: "83", name: "Ms. K Swathi", designation: "Assistant Professor (C)", photo_url: null },
    { id: "84", name: "Ms. D Swapna", designation: "Assistant Professor (C)", photo_url: null },
    { id: "85", name: "Dr. M. Sowbhagya Lakshmi", designation: "Assistant Professor", photo_url: null },
    { id: "86", name: "Dr. B Dharma Rao", designation: "Assistant Professor (C)", photo_url: null },
    { id: "87", name: "Smt. J. Sucharitha", designation: "Assistant Professor (C)", photo_url: null },
    { id: "88", name: "Mr. R. Santha Rao", designation: "Assistant Professor (C)", photo_url: null },
    { id: "89", name: "Mr. N. Suresh Kumar", designation: "Assistant Professor (C)", photo_url: null },
    { id: "90", name: "Ms. B. Sri Durga", designation: "Assistant Professor (C)", photo_url: null },
    { id: "91", name: "Dr. P. Sreedevi", designation: "Assistant Professor", photo_url: null },
    { id: "92", name: "Mr. P.L Sunand", designation: "Assistant Professor (C)", photo_url: null },
  ],
};

DEPARTMENT_EXPLICIT_FACULTY_PROFILES.metallurgy = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.met;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES.metallurgical = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.met;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["metallurgical-engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.met;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["metallurgical_engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.met;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES.ce = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.civil;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["civil-engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.civil;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["civil_engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.civil;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES.me = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.mech;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES.mechanical = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.mech;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["mechanical-engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.mech;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["mechanical_engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.mech;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["computer-science"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.cse;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["computer-science-and-engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.cse;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["information-technology"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.it;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["electronics-and-communication-engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.ece;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["electrical-and-electronics-engineering"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.eee;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES.sh = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.bshss;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES.bsh = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.bshss;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["basic-sciences"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.bshss;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["basic-sciences-and-humanities"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.bshss;
DEPARTMENT_EXPLICIT_FACULTY_PROFILES["humanities-and-basic-sciences"] = DEPARTMENT_EXPLICIT_FACULTY_PROFILES.bshss;
