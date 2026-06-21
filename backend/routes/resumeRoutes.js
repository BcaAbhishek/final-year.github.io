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

/* ════════════════════════════════════════════════════════
   RESUME / CV DETECTION
   Keyword counting alone fails on textbooks/articles about
   "software engineering" — they say "experience", "skills",
   "projects" plenty of times too. So we combine:
     1) STRUCTURAL signals  — things only a resume layout has
        (email address, phone number, short dense lines, a
        contact/header block)
     2) SECTION-HEADER signals — resume section titles, but
        only counted as strong if they appear as their OWN
        short line (like a heading), not buried in a sentence
     3) NEGATIVE signals — patterns common in books/articles/
        academic text (chapter/abstract/table of contents,
        long paragraphs, page numbering style) that push the
        score back down
   A weighted score must clear a threshold before we treat
   the PDF as a real resume.
   ════════════════════════════════════════════════════════ */

const SECTION_HEADERS = [
  "experience", "work experience", "professional experience",
  "education", "skills", "technical skills", "projects",
  "objective", "career objective", "summary", "professional summary",
  "certifications", "certification", "internship", "internships",
  "achievements", "qualifications", "work history", "employment history",
  "references", "declaration", "personal details", "languages known"
];

const NEGATIVE_PATTERNS = [
  /\btable of contents\b/,
  /\babstract\b/,
  /\bchapter\s+\d+/,
  /\bisbn\b/,
  /\ball rights reserved\b/,
  /\bcopyright\s*©?\s*\d{4}/,
  /\breferences\s*\n.*\(\d{4}\)/, // academic citation style e.g. "(2021)"
  /\bfig(ure)?\.?\s*\d+[:.]/,     // "Figure 1:" / "Fig. 2."
  /\btable\s*\d+[:.]/,            // "Table 1:"
  /\buniversity press\b/,
  /\beditor[s]?\s*:/,
  /\bpublished\s+by\b/
];

function countLineMatches(lines, phrase) {
  // Counts how many times `phrase` appears as a short standalone-ish line
  // (a real section heading), not just anywhere in a paragraph.
  let count = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.length > 40) continue; // headings are short
    if (trimmed.includes(phrase)) count++;
  }
  return count;
}

function isLikelyResume(rawText) {
  const text = rawText.toLowerCase();
  const lines = rawText.split("\n");
  let score = 0;

  // ── Structural signals (strong indicators) ──
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(rawText);
  const hasPhone = /(\+?\d{1,3}[\s-]?)?\d{10}\b/.test(rawText.replace(/[()\-\s]/g, m => m === "(" || m === ")" ? "" : m));
  const hasPhoneSimple = /\d{10}/.test(rawText.replace(/[^\d]/g, "")) || /\d{3}[\s-]\d{3}[\s-]\d{4}/.test(rawText);

  if (hasEmail) score += 3;
  if (hasPhone || hasPhoneSimple) score += 2;

  // ── Section headers as actual short heading lines ──
  let headingHits = 0;
  for (const header of SECTION_HEADERS) {
    if (countLineMatches(lines, header) > 0) headingHits++;
  }
  score += headingHits * 2;

  // ── Document length / density check ──
  // Resumes are dense and short (typically 1-2 pages of text).
  // A textbook chapter or article tends to run much longer.
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  if (wordCount > 0 && wordCount < 1200) score += 1;
  if (wordCount > 3000) score -= 3; // long-form document, unlikely to be a CV

  // ── Average line length ──
  // Resumes are bullet/line heavy with lots of short lines (dates, titles).
  // Prose documents have long wrapped paragraph lines.
  const nonEmptyLines = lines.map(l => l.trim()).filter(Boolean);
  if (nonEmptyLines.length > 0) {
    const avgLen = nonEmptyLines.reduce((sum, l) => sum + l.length, 0) / nonEmptyLines.length;
    if (avgLen < 60) score += 1;
    if (avgLen > 110) score -= 2;
  }

  // ── Negative signals (book/article/report indicators) ──
  for (const pattern of NEGATIVE_PATTERNS) {
    if (pattern.test(text)) score -= 2;
  }

  // Threshold: tune this if you get false positives/negatives in practice.
  return score >= 5;
}

function detectDomain(text) {
  let scores = {};
  let totalMatches = 0;

  for (let domain in domains) {
    scores[domain] = 0;
    domains[domain].forEach(keyword => {
      if (text.includes(keyword)) {
        scores[domain]++;
        totalMatches++;
      }
    });
  }

  // ✅ If nothing matched at all, don't silently fall back to whichever
  // domain happens to be first in the object.
  if (totalMatches === 0) {
    return null;
  }

  return Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
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

// ── MAIN ROUTE ──
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📄 File received:", req.file.originalname);

    const data = await pdfParse(req.file.buffer);

    if (!data || !data.text || !data.text.trim()) {
      return res.status(422).json({
        message: "Couldn't read any text from this PDF. If it's a scanned image, please upload a text-based PDF instead."
      });
    }

    const rawText = data.text;
    const text = rawText.toLowerCase();
    console.log("📝 Text preview:", text.substring(0, 200));

    // ✅ Reject anything that doesn't structurally look like a resume/CV
    if (!isLikelyResume(rawText)) {
      return res.status(400).json({
        message: "This doesn't look like a resume or CV. Please upload your actual resume/CV in PDF format."
      });
    }

    const domain = detectDomain(text);
    const skills = extractSkills(text);
    const experience = extractExperience(text);
    const education = extractEducation(text);

    // ✅ Passed the resume check, but couldn't confidently detect a tech
    // domain — be honest instead of defaulting to "frontend".
    if (!domain) {
      return res.status(200).json({
        result: `We found this is a resume, but couldn't confidently detect a specific tech domain from the listed skills.
Skills: ${skills.join(", ") || "None detected"}
Experience: ${experience} years
Education: ${education}
Suggestion: Add clearer technical keywords (e.g. React, Node.js, Python, AWS) to your skills/projects section for a more accurate analysis.`
      });
    }

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
