let account = document.getElementById("account");
let login = document.querySelector(".login");
let signup = document.querySelector(".signup");
let slidetitle = document.getElementById("slidetitle");
let slidetext = document.getElementById("slidetext");
let slidebtn = document.getElementById("slidebtn");

function updateMobileView() {
    if (window.innerWidth <= 700) {
        if (account.classList.contains("signup-active")) {
            login.classList.add("login-active");
            signup.classList.add("signup-active");
        } else {
            login.classList.remove("login-active");
            signup.classList.remove("signup-active");
        }
    } else {

        login.classList.remove("login-active");
        signup.classList.remove("signup-active");
    }
}

slidebtn.addEventListener("click", () => {
    account.classList.toggle("signup-active");
    updateMobileView();
    if(account.classList.contains("signup-active")) {

        slidetitle.textContent = "مرحباً بك ";
        slidetext.textContent = "لديك حساب بالفعل؟";
        slidebtn.textContent = "تسجيل الدخول";
    } else {

        slidetitle.textContent = "مرحباً بعودتك";
        slidetext.textContent = "ليس لديك حساب؟";
        slidebtn.textContent = "إنشاء حساب";
    }
});

slidetext.addEventListener("click", () => {
    slidebtn.click();
});

window.addEventListener("resize", updateMobileView);
window.addEventListener("DOMContentLoaded", updateMobileView);
