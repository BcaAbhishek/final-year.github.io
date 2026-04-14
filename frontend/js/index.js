
const API = "https://finalyear-project-github-io.onrender.com";
let salaryChartInstance = null;

/* ── UPLOAD & ANALYZE ── */
async function uploadResume() {
    const file = document.getElementById("resume").files[0];
    if (!file) { alert("Please upload a resume first."); return; }

    document.getElementById("loader").style.display = "block";
    document.querySelector(".results").style.display = "none";

    const formData = new FormData();
    formData.append("resume", file);

    try {
        const res = await fetch(`${API}/api/resume/analyze`, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Server error: " + res.status);
        const data = await res.json();
        document.getElementById("loader").style.display = "none";
        parseAIResult(data.result);
        saveHistory(data.result, file.name);
        const results = document.querySelector(".results");
        results.style.display = "block";
        results.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
        document.getElementById("loader").style.display = "none";
        alert("Something went wrong.\n" + err.message);
        console.error(err);
    }
}

/* ── PARSE AI RESULT ── */
function parseAIResult(text) {
    const set = (id, kw) => { const el = document.getElementById(id); if (el) el.innerText = extract(text, kw); };
    set("skills",  "Skills");
    set("roles",   "Job");
    set("salary",  "Salary");
    set("cities",  "Cities");
    set("improve", "Improve");
    createChart();
}

function extract(text, keyword) {
    for (let line of text.split("\n")) {
        if (line.toLowerCase().includes(keyword.toLowerCase()))
            return line.replace(/^[^:]+:\s*/i, "").trim();
    }
    return "Not found";
}

/* ── CHART ── */
function createChart() {
    const ctx = document.getElementById("salaryChart");
    if (!ctx) return;
    if (salaryChartInstance) { salaryChartInstance.destroy(); salaryChartInstance = null; }
    salaryChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai"],
            datasets: [{
                label: "Avg Salary (LPA)",
                data: [12, 10, 9, 13, 8],
                backgroundColor: ["rgba(124,111,247,0.7)","rgba(124,111,247,0.55)","rgba(124,111,247,0.45)","rgba(124,111,247,0.65)","rgba(124,111,247,0.4)"],
                borderColor: "rgba(168,155,255,0.8)",
                borderWidth: 1, borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: "#ccc" } } },
            scales: {
                x: { ticks: { color: "#ccc" }, grid: { color: "rgba(255,255,255,0.05)" } },
                y: { ticks: { color: "#ccc" }, grid: { color: "rgba(255,255,255,0.05)" } }
            }
        }
    });
}

/* ── HISTORY ── */
function saveHistory(text, filename) {
    let h = JSON.parse(localStorage.getItem("resumeHistory")) || [];
    h.unshift({ snippet: filename || text.substring(0, 80), date: new Date().toLocaleDateString("en-IN") });
    if (h.length > 10) h = h.slice(0, 10);
    localStorage.setItem("resumeHistory", JSON.stringify(h));
    displayHistory();
}

function displayHistory() {
    const list = document.getElementById("history");
    if (!list) return;
    const h = JSON.parse(localStorage.getItem("resumeHistory")) || [];
    list.innerHTML = "";
    if (h.length === 0) { list.innerHTML = "<li style='opacity:0.4'>No analyses yet.</li>"; return; }
    h.forEach(item => {
        const li = document.createElement("li");
        const snippet = typeof item === "string" ? item.substring(0, 80) : (item.snippet || "Resume");
        const date    = typeof item === "object"  ? (item.date || "") : "";
        li.innerHTML = `<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📄 ${snippet}</span>${date ? `<span style="font-size:11px;opacity:0.5;margin-left:10px;flex-shrink:0">${date}</span>` : ""}`;
        list.appendChild(li);
    });
}

/* ── LOAD USER — shows name in navbar ── */
function loadUser() {
    // ✅ Try reading user from localStorage
    let user = JSON.parse(localStorage.getItem("user"));

    // ✅ FALLBACK: if user object missing, decode it directly from the JWT token
    if (!user) {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // JWT payload has name + email if we signed it that way
                if (payload.name) {
                    user = { name: payload.name, email: payload.email || "" };
                    // Save it so we don't decode every time
                    localStorage.setItem("user", JSON.stringify(user));
                }
            } catch (e) { console.warn("Could not decode token:", e); }
        }
    }

    const authButtons = document.getElementById("authButtons");
    const userMenu    = document.getElementById("userMenu");
    const navUsername = document.getElementById("navUsername");
    const navAvatar   = document.getElementById("navAvatar");

    if (user && user.name) {
        if (authButtons) authButtons.style.display = "none";
        if (userMenu)    userMenu.style.display    = "flex";
        if (navUsername) navUsername.innerText     = user.name;         // ✅ shows name
        if (navAvatar)   navAvatar.innerText       = user.name.charAt(0).toUpperCase(); // ✅ shows initial
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (userMenu)    userMenu.style.display    = "none";
    }
}

/* ── LOGOUT ── */
function logout() {
    localStorage.removeItem("token"); // ✅ Fixed: was only removing "user", left token behind
    localStorage.removeItem("user");
    localStorage.removeItem("resumeHistory");
    window.location.href = "index.html";
}

/* ── INIT ── */
window.onload = function () {
    loadUser();
    displayHistory();
    const results = document.querySelector(".results");
    if (results) results.style.display = "none";
};

// ✅ Sync across tabs
window.addEventListener("storage", loadUser);