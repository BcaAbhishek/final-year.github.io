/* ============================================================
   AI RESUME ANALYZER — index.js (FINAL FIXED)
   ============================================================ */


   
let salaryChartInstance = null;

/* ── UPLOAD & ANALYZE ── */
async function uploadResume() {
    const file = document.getElementById("resume").files[0];

    if (!file) {
        alert("Please upload a resume first.");
        return;
    }

    document.getElementById("loader").style.display = "block";
    document.querySelector(".results").style.display = "none";

    const formData = new FormData();
    formData.append("resume", file);

    try {
        const res = await fetch("https://finalyear-project-github-io.onrender.com/api/resume/analyze", {
            method: "POST",
            body: formData
        });

        if (!res.ok) throw new Error("Server error: " + res.status);

        const data = await res.json();

        document.getElementById("loader").style.display = "none";

        parseAIResult(data.result);
        saveHistory(data.result);

        document.querySelector(".results").style.display = "block";

    } catch (err) {
        document.getElementById("loader").style.display = "none";
        alert("Something went wrong.\n" + err.message);
        console.error(err);
    }
}

/* ── PARSE AI RESULT ── */
function parseAIResult(text) {
    document.getElementById("skills").innerText  = extract(text, "Skills");
    document.getElementById("roles").innerText   = extract(text, "Job");
    document.getElementById("salary").innerText  = extract(text, "Salary");
    document.getElementById("cities").innerText  = extract(text, "Cities");
    document.getElementById("improve").innerText = extract(text, "Improve");

    createChart();
}

/* ── EXTRACT DATA ── */
function extract(text, keyword) {
    const lines = text.split("\n");
    for (let line of lines) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
            return line.trim();
        }
    }
    return "Not found";
}

/* ── SALARY CHART ── */
function createChart() {
    const ctx = document.getElementById("salaryChart");
    if (!ctx) return;

    if (salaryChartInstance) {
        salaryChartInstance.destroy();
    }

    salaryChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai"],
            datasets: [{
                label: "Avg Salary (LPA)",
                data: [12, 10, 9, 13, 8],
                backgroundColor: [
                    "rgba(124,111,247,0.7)",
                    "rgba(124,111,247,0.55)",
                    "rgba(124,111,247,0.45)",
                    "rgba(124,111,247,0.65)",
                    "rgba(124,111,247,0.4)"
                ],
                borderColor: "rgba(168,155,255,0.8)",
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: "#ccc" } }
            }
        }
    });
}

/* ── HISTORY ── */
function saveHistory(text) {
    let history = JSON.parse(localStorage.getItem("resumeHistory")) || [];

    history.unshift({
        snippet: text.substring(0, 120),
        date: new Date().toLocaleDateString("en-IN")
    });

    if (history.length > 10) history = history.slice(0, 10);

    localStorage.setItem("resumeHistory", JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    const list = document.getElementById("history");
    if (!list) return;

    const history = JSON.parse(localStorage.getItem("resumeHistory")) || [];
    list.innerHTML = "";

    if (history.length === 0) {
        list.innerHTML = "<li>No analyses yet.</li>";
        return;
    }

    history.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span style="flex:1">${item.snippet}...</span>
            <span style="font-size:11px;opacity:0.6">${item.date}</span>
        `;
        list.appendChild(li);
    });
}

/* ── AUTH / NAVBAR FIX ── */
function loadUser() {
    const user = JSON.parse(localStorage.getItem("user"));

    const authButtons = document.getElementById("authButtons");
    const userMenu    = document.getElementById("userMenu");
    const navUsername = document.getElementById("navUsername");
    const navAvatar   = document.getElementById("navAvatar");

    if (user && user.name) {
        // ✅ Logged in
        if (authButtons) authButtons.style.display = "none";
        if (userMenu) userMenu.style.display = "flex";

        if (navUsername) navUsername.innerText = user.name;
        if (navAvatar) navAvatar.innerText = user.name.charAt(0).toUpperCase();
    } else {
        // ❌ Not logged in
        if (authButtons) authButtons.style.display = "flex";
        if (userMenu) userMenu.style.display = "none";
    }
}

/* ── LOGOUT ── */
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

/* ── INIT ── */
window.onload = function () {
    loadUser();
    displayHistory();

    const results = document.querySelector(".results");
    if (results) results.style.display = "none";
};

/* ── MULTI TAB SYNC (PRO) ── */
window.addEventListener("storage", loadUser);