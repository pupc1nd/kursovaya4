document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");
    const loginField = document.getElementById("login");
    const dateField = document.getElementById("date");

    const loginError = document.getElementById("login-error");
    const dateError = document.getElementById("date-error");

    function setError(element, errorSpan, message) {
        if (message) {
            element.classList.add("error");
            errorSpan.textContent = message;
        } else {
            element.classList.remove("error");
            errorSpan.textContent = "";
        }
    }

    loginField.addEventListener("input", () => {
        if (loginField.validity.valid) {
            setError(loginField, loginError, "");
        } else {
            setError(loginField, loginError, "Неверный логин");
        }
    });

    dateField.addEventListener("input", () => {
        if (dateField.validity.rangeUnderflow) {
            setError(dateField, dateError, "не раньше 01.01.1950.");
        } else if (dateField.validity.rangeOverflow) {
            setError(dateField, dateError, "не позже 07.12.2024.");
        } else {
            setError(dateField, dateError, "");
        }
    });

    authForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let isValid = true;

        if (loginField.value === "") {
            setError(loginField, loginError, "Поле логина обязательно для заполнения.");
            isValid = false;
        } else if (!loginField.validity.valid) {
            setError(loginField, loginError, "неподходящий логин");
            isValid = false;
        } else {
            setError(loginField, loginError, "");
        }

        if (dateField.value === "") {
            setError(dateField, dateError, "Поле даты обязательно для заполнения.");
            isValid = false;
        } else if (dateField.validity.rangeUnderflow) {
            setError(dateField, dateError, "не раньше 01.01.1950.");
            isValid = false;
        } else if (dateField.validity.rangeOverflow) {
            setError(dateField, dateError, "не позже 07.12.2024.");
            isValid = false;
        } else {
            setError(dateField, dateError, "");
        }

        if (isValid) {
            const login = loginField.value;
            const date = dateField.value;
            const gender = document.querySelector('input[name="gender"]:checked').value;
            const isAuthenticate = "true";

            sessionStorage.setItem("login", login);
            sessionStorage.setItem("date", date);
            sessionStorage.setItem("gender", gender);
            sessionStorage.setItem("isAuthenticate", isAuthenticate);

            window.location.href = "index.html";
        }
    });
});
