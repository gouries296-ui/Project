document.addEventListener("DOMContentLoaded", function () {

    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            sessionStorage.clear();

            window.location.href = "login.html";

        });

    }

});