document.addEventListener("DOMContentLoaded", function () {
  protectDashboard();
  renderUserName();
  setupBalanceToggle();
  setupLogout();
});

function protectDashboard() {
  const user = getUser();

  console.log("Usuario en dashboard:", user);

  if (!user) {
    window.location.href = "index.html";
  }
}

function renderUserName() {
  const user = getUser();
  const userNameElement = document.querySelector("#userName");

  if (user && userNameElement) {
    userNameElement.textContent = user.name;
  }
}

function setupBalanceToggle() {
  const toggleButton = document.querySelector("#toggleBalanceBtn");
  const balanceAmount = document.querySelector("#balanceAmount");

  if (!toggleButton || !balanceAmount) return;

  let isVisible = true;
  const realBalance = balanceAmount.textContent;

  toggleButton.addEventListener("click", function () {
    isVisible = !isVisible;

    if (isVisible) {
      balanceAmount.textContent = realBalance;
      toggleButton.innerHTML = '<i class="fa-regular fa-eye"></i>';
    } else {
      balanceAmount.textContent = "Bs. •••••••";
      toggleButton.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    }
  });
}

function setupLogout() {
  const logoutBtn = document.querySelector("#logoutBtn");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", function () {
    window.location.href = "sesion-finalizada.html";
  });
}
