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
  const inputs = document.querySelectorAll("input");

  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      const errorMessages = document.querySelectorAll(".error");

      errorMessages.forEach(function (error) {
        error.textContent = "";
      });
    });
  });
}

function handleRegister(event) {
  event.preventDefault();

  const user = getRegisterData();

  const error = validateRegisterData(user);

  if (error) {
    showError("registerError", error);
    return;
  }

  saveUser(user);
  //te envia a la ventana de preguntas de seguridad si todo esta bien
  window.location.href = "seguridad.html";
}
//Logica de registro
function getRegisterData() {
  return {
    name: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    document: document.querySelector("#document").value.trim(),
    password: document.querySelector("#password").value.trim(),
    confirmPassword: document.querySelector("#confirmPassword").value.trim(),
  };
}

function validateRegisterData(user) {
  if (
    !user.name ||
    !user.email ||
    !user.document ||
    !user.password ||
    !user.confirmPassword
  ) {
    return "Todos los datos son obligatorios";
  }

  if (!isNumericPassword(user.password)) {
    return "La contraseña debe tener mínimo 6 caracteres numéricos.";
  }

  if (user.password !== user.confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  return "";
}

function isNumericPassword(password) {
  return /^[0-9]{6,}$/.test(password);
}
function showError(elementId, message) {
  const errorElement = document.querySelector(`#${elementId}`);

  if (errorElement) {
    errorElement.textContent = message;
  }
}

//Logica preguntas de seguridad
function handleSecurityQuestions(event) {
  event.preventDefault();

  const securityData = {
    questionOne: document.querySelector("#questionOne").value,
    answerOne: document.querySelector("#answerOne").value.trim(),
    questionTwo: document.querySelector("#questionTwo").value,
    answerTwo: document.querySelector("#answerTwo").value.trim(),
    questionThree: document.querySelector("#questionThree").value.trim(),
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
  btnText.textContent = "Validando...";
  spinner.classList.remove("hidden");

  console.log("Usuario encontrado:", user);
  console.log("Redirigiendo al dashboard...");

  setTimeout(function () {
    window.location.href = "dashboard.html";
  }, 2000);
}
