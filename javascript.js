/* =========================================================
   HONEYSHIELD
   COMPLETE JAVASCRIPT
   Registration + Login + Dashboard
========================================================= */


/* =========================================================
   REGISTRATION
========================================================= */

function registerUser(event) {

    event.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    /* Check empty fields */

    if (
        fullname === "" ||
        username === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ) {
        alert("Please fill in all fields.");
        return;
    }

    /* Check password */

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    /* Check password length */

    if (password.length < 4) {
        alert("Password must contain at least 4 characters.");
        return;
    }

    /* Check existing user */

    const existingUser =
        localStorage.getItem("honeyShieldUser");

    if (existingUser) {

        try {

            const oldUser = JSON.parse(existingUser);

            if (oldUser.username === username) {
                alert("Username already exists.");
                return;
            }

        } catch (error) {

            localStorage.removeItem("honeyShieldUser");

        }
    }

    /* Create user */

    const user = {
        fullname: fullname,
        username: username,
        email: email,
        password: password
    };

    /* Save user */

    localStorage.setItem(
        "honeyShieldUser",
        JSON.stringify(user)
    );

    alert("Registration successful!");

    /* Go to login */

    window.location.href = "login.html";
}


/* =========================================================
   LOGIN
========================================================= */

function loginUser(event) {

    event.preventDefault();

    const usernameElement =
        document.getElementById("username");

    const passwordElement =
        document.getElementById("password");

    if (!usernameElement || !passwordElement) {

        alert("Login form could not be found.");
        return;
    }

    const username =
        usernameElement.value.trim();

    const password =
        passwordElement.value;

    /* Get registered user */

    const savedUser =
        localStorage.getItem("honeyShieldUser");

    if (!savedUser) {

        alert("No account found. Please register first.");
        return;
    }

    let user;

    try {

        user = JSON.parse(savedUser);

    } catch (error) {

        alert(
            "Account data is corrupted. Please register again."
        );

        localStorage.removeItem("honeyShieldUser");

        return;
    }

    /* Check username and password */

    if (
        username === user.username &&
        password === user.password
    ) {

        /* Create login session */

        sessionStorage.setItem(
            "loggedIn",
            "true"
        );

        sessionStorage.setItem(
            "username",
            user.username
        );

        /* Go to dashboard */

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid username or password!");
    }
}


/* =========================================================
   DASHBOARD LOGIN PROTECTION
========================================================= */

function checkLogin() {

    const loggedIn =
        sessionStorage.getItem("loggedIn");

    if (loggedIn !== "true") {

        window.location.replace("Login.html");

        return false;
    }

    return true;
}


/* =========================================================
   DISPLAY LOGGED-IN USER
========================================================= */

function displayUsername() {

    const username =
        sessionStorage.getItem("username");

    const usernameElement =
        document.getElementById("loggedUsername");

    if (usernameElement && username) {

        usernameElement.textContent = username;
    }
}


/* =========================================================
   LOGOUT
========================================================= */



/* =========================================================
   THREAT FILTER
========================================================= */

function filterThreats() {

    const filterElement =
        document.getElementById("threatFilter");

    if (!filterElement) {
        return;
    }

    const selectedLevel =
        filterElement.value;

    const rows =
        document.querySelectorAll(".table-row");

    rows.forEach(function(row) {

        const level =
            row.getAttribute("data-level");

        if (
            selectedLevel === "all" ||
            level === selectedLevel
        ) {

            row.style.display = "grid";

        } else {

            row.style.display = "none";
        }
    });
}


/* =========================================================
   AUTOMATIC THREAT CHECK
========================================================= */

function checkThreat(score, ip, action) {

    if (score >= 60) {

        showSecurityAlert(
            score,
            ip,
            action
        );
    }
}


/* =========================================================
   SHOW SECURITY ALERT
========================================================= */

function showSecurityAlert(score, ip, action) {

    const alertBox =
        document.getElementById("securityAlert");

    const alertMessage =
        document.getElementById("alertMessage");

    if (!alertBox || !alertMessage) {
        return;
    }

    let level;

    if (score >= 80) {

        level = "CRITICAL";

    } else {

        level = "HIGH";
    }

    /* Display alert */

    alertMessage.innerHTML =
        "<strong>" +
        level +
        " threat detected!</strong><br>" +
        "IP: " +
        ip +
        " | Action: " +
        action +
        " | Threat Score: " +
        score;

    /* Show alert */

    alertBox.classList.remove("hidden");

    /* Update alert counter */

    const alertCount =
        document.getElementById("alertCount");

    if (alertCount) {

        let count =
            parseInt(alertCount.textContent) || 0;

        alertCount.textContent =
            count + 1;
    }

    /* Browser notification */

    sendBrowserNotification(
        level,
        ip,
        score
    );
}


/* =========================================================
   CLOSE SECURITY ALERT
========================================================= */

function closeAlert() {

    const alertBox =
        document.getElementById("securityAlert");

    if (alertBox) {

        alertBox.classList.add("hidden");
    }
}


/* =========================================================
   BROWSER NOTIFICATION
========================================================= */

function sendBrowserNotification(
    level,
    ip,
    score
) {

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "HoneyShield Security Alert",
            {
                body:
                    level +
                    " threat detected from " +
                    ip +
                    ". Threat Score: " +
                    score
            }
        );
    }
}


/* =========================================================
   REQUEST NOTIFICATION PERMISSION
========================================================= */

function requestNotificationPermission() {

    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {

        Notification.requestPermission();
    }
}


/* =========================================================
   DASHBOARD INITIALIZATION
========================================================= */

function initializeDashboard() {

    /* Check login */

    if (!checkLogin()) {
        return;
    }

    /* Display username */

    displayUsername();

    /* Request notification permission */

    requestNotificationPermission();

    /*
        DEMO THREAT

        This can later be replaced
        with Python/Django data.
    */

    checkThreat(
        82,
        "192.168.1.24",
        "Multiple Login Attempts"
    );
}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* =================================================
           REGISTRATION PAGE
        ================================================= */

        const registrationForm =
            document.querySelector(".register-form");

        if (registrationForm) {

            registrationForm.addEventListener(
                "submit",
                registerUser
            );
        }


        /* =================================================
           LOGIN PAGE
        ================================================= */

        const loginForm =
            document.querySelector(".login-form");

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );
        }


        /* =================================================
           DASHBOARD PAGE
           
           Your dashboard HTML uses:
           .dashboard-container
           
           NOT .dashboard-page
        ================================================= */

        const dashboard =
            document.querySelector(".dashboard-container");

        if (dashboard) {

            initializeDashboard();
        }


        /* =================================================
           INITIAL THREAT FILTER
        ================================================= */

        const threatFilter =
            document.getElementById("threatFilter");

        if (threatFilter) {

            filterThreats();
        }

    }
);
