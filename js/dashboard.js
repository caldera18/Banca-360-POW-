document.addEventListener("DOMContentLoaded", function () {
  protectDashboard();
  renderUserName();
  renderBalance();
  renderTransactions();
  setupBalanceToggle();
  setupLogout();
});

function protectDashboard() {
  const user = getUser();
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    minimumFractionDigits: 2,
  }).format(amount).replace("VES", "Bs.");
}

function renderBalance() {
  const user = getUser();
  const balanceAmount = document.querySelector("#balanceAmount");
  if (user && balanceAmount) {
    balanceAmount.textContent = formatCurrency(user.balance);
  }
}

function renderTransactions() {
  const user = getUser();
  const container = document.querySelector(".transaction-list");
  if (!user || !container) return;

  const transactions = user.transactions || [];
  
  if (transactions.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--muted);">No hay movimientos recientes</p>';
    return;
  }

  const lastThree = [...transactions].reverse().slice(0, 3);
  container.innerHTML = "";

  lastThree.forEach((tx) => {
    const isIncome = tx.type === "deposito" || tx.type === "transferencia_recibida";
    const iconClass = isIncome ? "fa-arrow-down" : "fa-arrow-up";
    const statusClass = isIncome ? "income" : "outcome";
    const amountClass = isIncome ? "success-text" : "danger-text";
    const prefix = isIncome ? "+" : "-";

    const html = `
      <article class="transaction-item">
        <div class="transaction-icon ${statusClass}">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div>
          <h4>${tx.description}</h4>
          <p>${tx.date}</p>
        </div>
        <strong class="${amountClass}">${prefix} ${formatCurrency(tx.amount)}</strong>
      </article>
    `;
    container.insertAdjacentHTML("beforeend", html);
  });
}

function setupBalanceToggle() {
  const toggleButton = document.querySelector("#toggleBalanceBtn");
  const balanceAmount = document.querySelector("#balanceAmount");

  if (!toggleButton || !balanceAmount) return;

  let isVisible = true;

  toggleButton.addEventListener("click", function () {
    isVisible = !isVisible;
    const user = getUser();

    if (isVisible) {
      balanceAmount.textContent = formatCurrency(user.balance);
      toggleButton.innerHTML = '<i class="fa-regular fa-eye"></i>';
    } else {
      balanceAmount.textContent = "Bs. •••••••";
      toggleButton.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
    }
  });
}

function setupLogout() {
  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("banca360User");
      window.location.href = "index.html";
    });
  }
}