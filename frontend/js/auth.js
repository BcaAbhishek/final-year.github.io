const API = "https://finalyear-project-github-io.onrender.com";

/* ── SAVE SESSION (ONLY ONE VERSION) ── */
function saveSession(token, userObj) {
    localStorage.setItem("token", token);

    if (userObj && userObj.name) {
        localStorage.setItem("user", JSON.stringify(userObj));
    } else {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.name) {
                localStorage.setItem("user", JSON.stringify({
                    name: payload.name,
                    email: payload.email || ""
                }));
            }
        } catch (e) {
            console.warn("JWT decode failed");
        }
    }
}

/* ── LOGIN ── */
async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPass").value;

    if (!email || !password) {
        alert("Enter email & password");
        return;
    }

    try {
        const res = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!data.token) {
            alert("Login failed");
            return;
        }

        // ✅ FORCE SAVE CORRECT DATA
        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify({
            name: data.user?.name || "User",
            email: data.user?.email || ""
        }));

        window.location.href = "home.html";

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}


/* ── REGISTER ── */
async function register() {
    const name     = document.getElementById("signupName").value.trim();
    const email    = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPass").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    try {
        const res = await fetch(`${API}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        alert(data.message);

        if (data.message.toLowerCase().includes("success")) {
            document.getElementById("loginBtn").click();
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

/* ── GOOGLE LOGIN ── */
function handleGoogleResponse(response) {
    const token = response.credential;

    fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.token) {
            alert("Google login failed");
            return;
        }

        saveSession(data.token, data.user);

        setTimeout(() => {
            window.location.href = "home.html";
        }, 300);
    })
    .catch(err => {
        console.error(err);
        alert("Google login failed");
    });
}

/* ── PASSWORD TOGGLE ── */
function togglePass(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}