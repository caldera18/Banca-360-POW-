document.addEventListener("DOMContentLoaded", function () {
  const user = getUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.querySelector("#profileName").value = user.name;
  document.querySelector("#profileEmail").value = user.email;
  document.querySelector("#profileDocument").value = user.documentId;
});

document.addEventListener("DOMContentLoaded", function () {
  const user = getUser();

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.querySelector("#profileName").value = user.name;
  document.querySelector("#profileEmail").value = user.email;
  document.querySelector("#profileDocument").value = user.documentId;

  document.querySelector("#changePasswordBtn").addEventListener("click", function () {
    const currentPassword = document.querySelector("#currentPassword").value.trim();
    const newPassword = document.querySelector("#newPassword").value.trim();
    const confirmNewPassword = document.querySelector("#confirmNewPassword").value.trim();
    const errorEl = document.querySelector("#passwordError");
    const successEl = document.querySelector("#passwordSuccess");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      errorEl.textContent = "Todos los campos son obligatorios.";
      successEl.textContent = "";
      return;
    }

    if (currentPassword !== user.password) {
      errorEl.textContent = "La contraseña actual no es correcta.";
      successEl.textContent = "";
      return;
    }

    const passwordRegex = /^[0-9]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      errorEl.textContent = "La nueva contraseña debe tener al menos 6 números.";
      successEl.textContent = "";
      return;
    }

    if (newPassword !== confirmNewPassword) {
      errorEl.textContent = "Las contraseñas no coinciden.";
      successEl.textContent = "";
      return;
    }

    user.password = newPassword;
    saveUser(user);

    errorEl.textContent = "";
    successEl.textContent = "¡Contraseña cambiada con éxito!";
  });
});

document.querySelector("#logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("banca360User");
  window.location.href = "sesion-finalizada.html";

});

