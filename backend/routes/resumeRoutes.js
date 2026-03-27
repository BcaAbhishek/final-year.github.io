const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are supported"), false);
    }
  }
});

// ── DOMAIN KEYWORDS ──
const domains = {
  frontend: ["react", "html", "css", "javascript", "bootstrap", "tailwind"],
  backend: ["node", "express", "api", "server"],
  fullstack: ["mern", "full stack"],
  data: ["data analysis", "pandas", "numpy", "excel", "power bi", "tableau"],
  ai: ["machine learning", "deep learning", "ai", "nlp"],
  devops: ["docker", "kubernetes", "aws", "ci/cd"]
};

// ── SKILLS MAP ──
const skillsMap = {
  javascript: ["js", "javascript"],
  react: ["react"],
  node: ["node"],
  python: ["python"],
  java: ["java"],
  html: ["html"],
  css: ["css"],
  mongodb: ["mongodb"],
  sql: ["sql", "mysql"],
  excel: ["excel"],
  powerbi: ["power bi"],
  tableau: ["tableau"],
  pandas: ["pandas"],
  numpy: ["numpy"],
  ml: ["machine learning"],
  ai: ["ai"],
  docker: ["docker"],
  aws: ["aws"]
};

function detectDomain(text) {
  let scores = {};
  for (let domain in domains) {
    scores[domain] = 0;
    domains[domain].forEach(keyword => {
      if (text.includes(keyword)) scores[domain]++;
    });
  }
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function extractSkills(text) {
  let found = [];
  for (let skill in skillsMap) {
    skillsMap[skill].forEach(keyword => {
      if (text.includes(keyword)) found.push(skill);
    });
  }
  return [...new Set(found)];
}

function extractExperience(text) {
  const match = text.match(/(\d+)\s*(years|yrs)/);
  return match ? parseInt(match[1]) : 0;
}

function extractEducation(text) {
  if (text.includes("btech") || text.includes("b.e")) return "BTech";
  if (text.includes("mca")) return "MCA";
  if (text.includes("mtech") || text.includes("m.e")) return "MTech";
  if (text.includes("bsc")) return "BSc";
  if (text.includes("mba")) return "MBA";
  return "Not Mentioned";
}

function getRoles(domain) {
  const roleMap = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    fullstack: "Full Stack Developer",
    data: "Data Analyst",
    ai: "AI/ML Engineer",
    devops: "DevOps Engineer"
  };
  return roleMap[domain] || "Software Developer";
}

function getSalary(domain, exp) {
  let base = 3;
  const domainBonus = { frontend: 3, backend: 4, fullstack: 5, data: 4, ai: 6, devops: 5 };
  base += (domainBonus[domain] || 2);
  base += exp * 1.5;
  return `₹${base.toFixed(1)}L - ₹${(base + 5).toFixed(1)}L per year`;
}

function getImprovements(domain, skills, exp) {
  let tips = [];
  if (domain === "frontend") {
    if (!skills.includes("react")) tips.push("Learn React");
    tips.push("Improve UI/UX skills");
  }
  if (domain === "backend") {
    if (!skills.includes("node")) tips.push("Learn Node.js");
    tips.push("Build REST APIs");
  }
  if (domain === "data") {
    if (!skills.includes("python")) tips.push("Learn Python");
    if (!skills.includes("pandas")) tips.push("Learn Pandas");
    tips.push("Work on real datasets");
  }
  if (domain === "ai") {
    tips.push("Learn Deep Learning");
    tips.push("Build ML projects");
  }
  if (domain === "devops") {
    tips.push("Learn Docker & AWS");
  }
  if (exp < 1) tips.push("Gain internship experience");
  if (tips.length === 0) tips.push("Add certifications", "Contribute to open source");
  return tips.join(", ");
}

// ── MAIN ROUTE (single — duplicate removed) ──
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📄 File received:", req.file.originalname);

    const data = await pdfParse(req.file.buffer);

    if (!data || !data.text) {
      return res.status(500).json({ message: "PDF text extraction failed" });
    }

    const text = data.text.toLowerCase();
    console.log("📝 Text preview:", text.substring(0, 200));

    const domain = detectDomain(text);
    const skills = extractSkills(text);
    const experience = extractExperience(text);
    const education = extractEducation(text);

    const result = `Domain: ${domain.toUpperCase()}
Skills: ${skills.join(", ") || "None detected"}
Experience: ${experience} years
Education: ${education}
Job Role: ${getRoles(domain)}
Salary: ${getSalary(domain, experience)}
Cities: Bangalore, Hyderabad, Pune, Gurgaon
Improve: ${getImprovements(domain, skills, experience)}`;

    res.json({ result });

  } catch (error) {
    console.error("🔥 Resume analysis error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;