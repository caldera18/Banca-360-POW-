document.addEventListener("DOMContentLoaded", function () {
  protectView();
  setupLogout();
  renderHistory("todas");

  const filterButtons = document.querySelectorAll("[data-filter]");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active", "btn-primary"));
      filterButtons.forEach((b) => b.classList.add("btn-secondary"));

      btn.classList.remove("btn-secondary");
      btn.classList.add("btn-primary", "active");

      renderHistory(btn.dataset.filter);
    });
  });
});

function protectView() {
  if (!getUser() || (typeof hasSession === "function" && !hasSession())) {
    window.location.href = "index.html";
  }
}

function setupLogout() {
  const btn = document.querySelector("#logoutBtn");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof clearSession === "function") clearSession();
      window.location.href = "sesion-finalizada.html";
    });
  }
}

function renderHistory(filter) {
  const user = getUser();
  const container = document.querySelector("#historyContainer");

  if (!user || !container) return;

  const allTransactions = user.transactions || [];
  const filtered = allTransactions.filter((tx) => {
    if (filter === "todas") return true;
    const direction = getTransactionDirection(tx.type);
    return direction === filter;
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <p>No se encontraron movimientos para este filtro.</p>
      </div>`;
    return;
  }

  [...filtered].reverse().forEach((tx) => {
    const isIncome = getTransactionDirection(tx.type) === "entrada";

    const html = `
      <article class="transaction-item">
        <a href="movimiento.html?id=${tx.id}" class="transaction-link">
          <div class="transaction-icon ${isIncome ? "income" : "outcome"}">
            <i class="fa-solid ${isIncome ? "fa-arrow-down" : "fa-arrow-up"}"></i>
          </div>
          <div class="transaction-details">
            <h4 class="transaction-title">${tx.description}</h4>
            <p class="transaction-date">${tx.date}</p>
          </div>
          <strong class="transaction-amount ${isIncome ? "success-text" : "danger-text"}">
            ${isIncome ? "+" : "-"} Bs. ${tx.amount.toFixed(2)}
          </strong>
          <i class="fa-solid fa-chevron-right transaction-arrow"></i>
        </a>
      </article>`;

    container.insertAdjacentHTML("beforeend", html);
  });
}
