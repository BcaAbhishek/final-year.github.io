/* ============================================================
   AI JOB MATCHER — auth.js
   ============================================================ */

const API = "https://finalyear-project-github-io.onrender.com";

/* ── Helper: save token + user object ── */
function saveSession(token, userObj) {
    localStorage.setItem("token", token);

    if (userObj) {
        // Backend returned user object directly
        localStorage.setItem("user", JSON.stringify(userObj));
    } else {
        // ✅ FALLBACK: decode name/email from the JWT itself
        // Works even if backend doesn't return a user object
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.name) {
                localStorage.setItem("user", JSON.stringify({ name: payload.name, email: payload.email || "" }));
            }
        } catch (e) { console.warn("Could not decode JWT for user info:", e); }
    }
}

/* ── LOGIN ── */
async function login() {
    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPass").value;
    if (!email || !password) { alert("Please enter email and password."); return; }

    try {
        const res  = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.token) {
            saveSession(data.token, data.user); // ✅ saves user either way
            window.location.href = "home.html";
        } else {
            alert(data.message || "Login failed. Check your credentials.");
        }
    } catch (err) { console.error(err); alert("Server error. Please try again."); }
}

/* ── REGISTER ── */
async function register() {
    const name     = document.getElementById("signupName").value.trim();
    const email    = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPass").value;
    if (!name || !email || !password) { alert("Please fill in all fields."); return; }
    if (password.length < 6) { alert("Password must be at least 6 characters."); return; }

    try {
        const res  = await fetch(`${API}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        alert(data.message);
        if (data.message && data.message.toLowerCase().includes("success")) {
            document.getElementById("loginBtn").click();
        }
    } catch (err) { console.error(err); alert("Server error. Please try again."); }
}

/* ── GOOGLE AUTH ── */
function handleGoogleResponse(response) {
    const token = response.credential;

    // Show profile preview on login page
    try {
        const user = JSON.parse(atob(token.split('.')[1]));
        const profileBox = document.getElementById("profileBox");
        if (profileBox) {
            profileBox.style.display = "flex";
            document.getElementById("userName").innerText = user.name;
            document.getElementById("userImg").src        = user.picture;
        }
    } catch (e) { console.warn("Google token preview failed:", e); }

    fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
    })
    .then(r => r.json())
    .then(data => {
        if (!data.token) { alert("Google login failed. Please try again."); return; }
        saveSession(data.token, data.user); // ✅ saves user either way
        setTimeout(() => { window.location.href = "home.html"; }, 900);
    })
    .catch(err => { console.error(err); alert("Google login failed."); });
}

/* ── PASSWORD TOGGLE ── */
function togglePass(id) {
    const input = document.getElementById(id);
    if (input) input.type = input.type === "password" ? "text" : "password";
}