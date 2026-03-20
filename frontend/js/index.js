/* UPLOAD */

async function uploadResume() {

    const file = document.getElementById("resume").files[0];

    if (!file) {
        alert("Upload resume first");
        return;
    }

    document.getElementById("loader").style.display = "block";

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("https://finalyear-project-github-io.onrender.com/api/resume/analyze", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    document.getElementById("loader").style.display = "none";

    parseAIResult(data.result);
    saveHistory(data.result);

}

/* PARSE */

function parseAIResult(text) {

    document.getElementById("skills").innerText = extract(text, "Skills");
    document.getElementById("roles").innerText = extract(text, "Job");
    document.getElementById("salary").innerText = extract(text, "Salary");
    document.getElementById("cities").innerText = extract(text, "Cities");
    document.getElementById("improve").innerText = extract(text, "Improve");

    createChart();

}

/* EXTRACT */

function extract(text, keyword) {

    const lines = text.split("\n");

    for (let line of lines) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
            return line;
        }
    }

    return "Not found";

}

/* CHART */

function createChart() {

    const ctx = document.getElementById("salaryChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Bangalore", "Hyderabad", "Pune"],
            datasets: [{
                label: "Avg Salary (LPA)",
                data: [12, 10, 9]
            }]
        }
    });

}

/* HISTORY */

function saveHistory(text) {

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.push(text);

    localStorage.setItem("history", JSON.stringify(history));

    displayHistory();

}

function displayHistory() {

    const history = JSON.parse(localStorage.getItem("history")) || [];

    const list = document.getElementById("history");

    list.innerHTML = "";

    history.slice().reverse().forEach(item => {
        const li = document.createElement("li");
        li.innerText = item.substring(0, 100) + "...";
        list.appendChild(li);
    });

}

window.onload = displayHistory;

/* CHATBOT */

function toggleChat() {
    const chat = document.getElementById("chatbot");
    chat.style.display = chat.style.display === "block" ? "none" : "block";
}

async function sendMessage() {

    const input = document.getElementById("userInput").value;

    const chatBody = document.getElementById("chatBody");

    chatBody.innerHTML += "<p><b>You:</b> " + input + "</p>";

    const res = await fetch("https://finalyear-project-github-io.onrender.com/api/chatbot/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    chatBody.innerHTML += "<p><b>Bot:</b> " + data.reply + "</p>";

}

window.onload = function () {

    displayUser();
    displayHistory();

}

function displayUser() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        document.getElementById("username").innerText = user.name;
    }

}

function loadUser() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        document.getElementById("username").innerText = user.name;

        // avatar using initials
        document.getElementById("avatar").src =
            `https://ui-avatars.com/api/?name=${user.name}&background=0077ff&color=fff`;

    }

}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

window.onload = function () {
    loadUser();
    loadHistory();
};
