document.addEventListener("DOMContentLoaded", function () {
  const goLoginBtn = document.querySelector("#goLoginBtn");
  const heroLoginBtn = document.querySelector("#heroLoginBtn");

  if (goLoginBtn) {
    goLoginBtn.addEventListener("click", handleGoLogin);
  }

  if (heroLoginBtn) {
    heroLoginBtn.addEventListener("click", handleGoLogin);
  }
});

function handleGoLogin() {
  const user = getUser();

  if (!user) {
    showLandingError("Primero debes registrarte para iniciar sesión.");
    return;
  }

  window.location.href = "login.html";
}

function showLandingError(message) {
  const error = document.querySelector("#landingError");

  if (error) {
    error.textContent = message;
  }
}
