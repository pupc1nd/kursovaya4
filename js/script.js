document.addEventListener("DOMContentLoaded", () => {
    const isAuthenticate = sessionStorage.getItem("isAuthenticate");
    const login = sessionStorage.getItem("login");

    const menuUsername = document.getElementById("username")
    const logoutSection = document.getElementById("logout-section")


    if (isAuthenticate === "true") {
        menuUsername.innerText = login;
        logoutSection.innerHTML = '<button id="logout-button1">Выйти</button>';

        const logoutButton1 = document.getElementById("logout-button1");

        logoutButton1.addEventListener("click", () => {
            sessionStorage.clear();
            window.location.href = "auth.html";
        })
    } else {
       
    }
})

