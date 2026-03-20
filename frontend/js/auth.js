// LOGIN

async function login() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;

    try {

        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.token) {

            // save token
            localStorage.setItem("token", data.token);

            // redirect
            window.location.href = "index.html";

        } else {
            alert(data.message || "Login failed");
        }

    } catch (err) {
        console.log(err);
        alert("Server error");
    }

}


// REGISTER

async function register() {

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPass").value;

    try {

        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        alert(data.message);

        // switch to login after signup
        document.getElementById("loginBtn").click();

    } catch (err) {
        console.log(err);
        alert("Server error");
    }

}

function googleLogin() {

    google.accounts.id.initialize({
        client_id: "964852972271-c71qf8ba3mub85j6ar0mqomfs2jslnn7.apps.googleusercontent.com",
        callback: handleGoogleResponse
    });

    google.accounts.id.prompt();

}


function handleGoogleResponse(response) {

    // JWT token from Google
    const token = response.credential;

    // send to backend

    fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    })
        .then(res => res.json())
        .then(data => {

            localStorage.setItem("token", data.token);

            window.location.href = "index.html";

        })
        .catch(err => {
            console.log(err);
            alert("Google login failed");
        });

}
function handleGoogleResponse(response) {

    const token = response.credential;

    // decode user info (for UI only)
    const user = JSON.parse(atob(token.split('.')[1]));

    document.getElementById("profileBox").style.display = "flex";
    document.getElementById("userName").innerText = user.name;
    document.getElementById("userImg").src = user.picture;


    // send to backend

    fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    })
        .then(res => res.json())
        .then(data => {

            localStorage.setItem("token", data.token);

            // redirect after 1 sec (nice UX)
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        })
        .catch(err => {
            console.log(err);
            alert("Google login failed");
        });

}

