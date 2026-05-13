document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector("#registerForm");
  const securityForm = document.querySelector("#securityForm");
  const loginForm = document.querySelector("#loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  if (securityForm) {
    securityForm.addEventListener("submit", handleSecurityQuestions);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  setupPasswordToggles();
  setupClearErrors();
});

function setupPasswordToggles() {
  const passwordIcons = document.querySelectorAll("[data-toggle-password]");

  passwordIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
      const inputId = icon.dataset.togglePassword;
      const input = document.querySelector(`#${inputId}`);

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });
}

function setupClearErrors() {
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const errorElements = document.querySelectorAll(".error");
      errorElements.forEach((el) => (el.textContent = ""));
    });
  });
}

function showError(id, message) {
  const errorElement = document.querySelector(`#${id}`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}
//Logica de registro
function handleRegister(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const documentId = document.querySelector("#document").value.trim();
  const password = document.querySelector("#password").value.trim();
  const confirmPassword = document.querySelector("#confirmPassword").value.trim();

  if (!name || !email || !documentId || !password || !confirmPassword) {
    showError("registerError", "Todos los campos son obligatorios.");
    return;
  }

  const passwordRegex = /^[0-9]{6,}$/;
  if (!passwordRegex.test(password)) {
    showError("registerError", "La contraseña debe tener al menos 6 números.");
    return;
  }

  //Logica preguntas de seguridad
  if (password !== confirmPassword) {
    showError("registerError", "Las contraseñas no coinciden.");
    return;
  }

  const userData = {
    name,
    email,
    documentId,
    password,
    balance: 0,
    transactions: []
  };

  saveUser(userData);
  window.location.href = "seguridad.html";
}

function handleSecurityQuestions(event) {
  event.preventDefault();

  const securityData = {
    questionOne: document.querySelector("#questionOne").value,
    answerOne: document.querySelector("#answerOne").value.trim(),
    questionTwo: document.querySelector("#questionTwo").value,
    answerTwo: document.querySelector("#answerTwo").value.trim(),
    questionThree: document.querySelector("#questionThree").value,
    answerThree: document.querySelector("#answerThree").value.trim(),
  };

  if (
    !securityData.questionOne ||
    !securityData.answerOne ||
    !securityData.questionTwo ||
    !securityData.answerTwo ||
    !securityData.questionThree ||
    !securityData.answerThree
  ) {
    showError(
      "securityError",
      "Debes completar todas las preguntas de seguridad.",
    );
    return;
  }

  saveSecurityQuestions(securityData);
  window.location.href = "login.html";
}

//login
function handleLogin(event) {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  const loginBtn = document.querySelector("#loginBtn");
  const btnText = loginBtn.querySelector(".btn-text");
  const spinner = loginBtn.querySelector(".spinner");

  const user = getUser();

  if (!user) {
    showError("loginError", "No existe un usuario registrado.");
    return;
  }

  if (!email || !password) {
    showError("loginError", "Debes ingresar correo y contraseña.");
    return;
  }

  if (email !== user.email || password !== user.password) {
    showError("loginError", "Correo o contraseña incorrectos.");
    return;
  }

  loginBtn.classList.add("loading");
  if (btnText) btnText.classList.add("hidden");
  if (spinner) spinner.classList.remove("hidden");

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 2000);
}
