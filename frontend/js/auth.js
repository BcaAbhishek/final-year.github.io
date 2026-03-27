// ── LOGIN ──
async function login() {

    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPass").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {
        const res  = await fetch("https://finalyear-project-github-io.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);

            // ✅ Save user object so home.html can show name + avatar
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            window.location.href = "home.html";

        } else {
            alert(data.message || "Login failed. Check your credentials.");
        }

    } catch (err) {
        console.error(err);
        alert("Server error. Please try again.");
    }
}


// ── REGISTER ──
async function register() {

    const name     = document.getElementById("signupName").value.trim();
    const email    = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPass").value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const res  = await fetch("https://finalyear-project-github-io.onrender.com/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        alert(data.message);

        if (data.message && data.message.toLowerCase().includes("success")) {
            document.getElementById("loginBtn").click();
        }

    } catch (err) {
        console.error(err);
        alert("Server error. Please try again.");
    }
}


// ── GOOGLE AUTH ──
// ✅ Single handleGoogleResponse — merged both versions, fixed duplicate
// This is called automatically by Google One Tap via data-callback="handleGoogleResponse" in HTML
function handleGoogleResponse(response) {

    const token = response.credential;

    // Decode user info from JWT for UI preview (safe — it's just a display)
    try {
        const user = JSON.parse(atob(token.split('.')[1]));
        document.getElementById("profileBox").style.display = "flex";
        document.getElementById("userName").innerText  = user.name;
        document.getElementById("userImg").src         = user.picture;
    } catch (e) {
        console.warn("Could not decode Google token for UI:", e);
    }

    // Send token to backend
    fetch("https://finalyear-project-github-io.onrender.com/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {

        if (!data.token) {
            alert("Google login failed. Please try again.");
            return;
        }

        localStorage.setItem("token", data.token);

        // ✅ Save user object so home.html can show name + avatar
        if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Redirect after short delay so user sees their profile briefly
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);

    })
    .catch(err => {
        console.error(err);
        alert("Google login failed. Please try again.");
    });
}


// ── PASSWORD TOGGLE ──
// ✅ Moved here from toggle.js — called by onclick in HTML
function togglePass(id) {
    const input = document.getElementById(id);
    input.type  = input.type === "password" ? "text" : "password";
}
