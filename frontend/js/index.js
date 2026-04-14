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
        const res = await fetch(`${API}/api/resume/analyze`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        document.getElementById("loader").style.display = "none";

        parseAIResult(data.result);
        saveHistory(data.result, file.name);

        const results = document.querySelector(".results");
        results.style.display = "block";
        results.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        document.getElementById("loader").style.display = "none";
        alert("Error: " + err.message);
    }
}

/* ── PARSE RESULT ── */
function parseAIResult(text) {
    const set = (id, kw) => {
        const el = document.getElementById(id);
        if (el) el.innerText = extract(text, kw);
    };

    set("skills", "Skills");
    set("roles", "Job");
    set("salary", "Salary");
    set("cities", "Cities");
    set("improve", "Improve");

    createChart();
}

function extract(text, keyword) {
    for (let line of text.split("\n")) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
            return line.replace(/^[^:]+:\s*/i, "").trim();
        }
    }
    return "Not found";
}

/* ── CHART ── */
function createChart() {
    const ctx = document.getElementById("salaryChart");

    if (salaryChartInstance) {
        salaryChartInstance.destroy();
    }

    salaryChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai"],
            datasets: [{
                label: "Avg Salary (LPA)",
                data: [12, 10, 9, 13, 8]
            }]
        }
    });
}

/* ── HISTORY ── */
function saveHistory(text, filename) {
    let h = JSON.parse(localStorage.getItem("resumeHistory")) || [];

    h.unshift({
        snippet: filename,
        date: new Date().toLocaleDateString("en-IN")
    });

    if (h.length > 10) h = h.slice(0, 10);

    localStorage.setItem("resumeHistory", JSON.stringify(h));
    displayHistory();
}

function displayHistory() {
    const list = document.getElementById("history");
    const h = JSON.parse(localStorage.getItem("resumeHistory")) || [];

    list.innerHTML = "";

    h.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.snippet} - ${item.date}`;
        list.appendChild(li);
    });
}

/* ── LOAD USER ── */
function loadUser() {
    let user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user && token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            user = { name: payload.name, email: payload.email };
            localStorage.setItem("user", JSON.stringify(user));
        } catch {}
    }

    console.log("Loaded User:", user);

    const authButtons = document.getElementById("authButtons");
    const userMenu    = document.getElementById("userMenu");
    const navUsername = document.getElementById("navUsername");
    const navAvatar   = document.getElementById("navAvatar");

    if (user && user.name) {
        authButtons.style.display = "none";
        userMenu.style.display    = "flex";
        navUsername.innerText     = user.name;
        navAvatar.innerText       = user.name.charAt(0).toUpperCase();
    } else {
        authButtons.style.display = "flex";
        userMenu.style.display    = "none";
    }
}

/* ── LOGOUT ── */
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

/* ── INIT ── */
window.onload = function () {
    loadUser();
    displayHistory();
};