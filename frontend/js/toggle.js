const slider = document.querySelector(".slider");
const formWrapper = document.querySelector(".form-wrapper");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", () => {
    slider.style.left = "50%";
    formWrapper.style.transform = "translateX(-50%)";

    signupBtn.classList.add("active");
    loginBtn.classList.remove("active");
});

loginBtn.addEventListener("click", () => {
    slider.style.left = "0%";
    formWrapper.style.transform = "translateX(0%)";

    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
});

/* PASSWORD TOGGLE */

function togglePass(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

