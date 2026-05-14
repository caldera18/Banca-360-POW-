document.addEventListener("DOMContentLoaded", function () {
  protectDashboard();
  renderUserName();
  renderBalance();
  renderSummary();
  setupTransactionFilters();
  renderTransactions();
  setupBalanceToggle();
  setupLogout();
});

let activeFilter = "todas";
function protectDashboard() { if (!getUser()) window.location.href = "index.html"; }
function renderUserName() { const user = getUser(); const el = document.querySelector("#userName"); if (user && el) el.textContent = user.name; }
function formatCurrency(amount) { return new Intl.NumberFormat("es-VE", { style: "currency", currency: "VES", minimumFractionDigits: 2 }).format(amount).replace("VES", "Bs."); }
function renderBalance() { const user = getUser(); const el = document.querySelector("#balanceAmount"); if (user && el) el.textContent = formatCurrency(user.balance); }

function renderSummary() {
  const user = getUser();
  const transactions = user?.transactions || [];
  const entries = transactions.filter((tx) => getTransactionDirection(tx.type) === "entrada").reduce((acc, tx) => acc + tx.amount, 0);
  const exits = transactions.filter((tx) => getTransactionDirection(tx.type) === "salida").reduce((acc, tx) => acc + tx.amount, 0);
  const e = document.querySelector("#summaryEntries");
  const s = document.querySelector("#summaryExits");
  if (e) e.textContent = `+ ${formatCurrency(entries)}`;
  if (s) s.textContent = `- ${formatCurrency(exits)}`;
}

function setupTransactionFilters() {
  document.querySelectorAll("[data-filter]").forEach((btn) => btn.addEventListener("click", function () { activeFilter = btn.dataset.filter; renderTransactions(); }));
}

function renderTransactions() {
  const user = getUser(); const container = document.querySelector(".transaction-list"); if (!user || !container) return;
  const filtered = (user.transactions || []).filter((tx) => activeFilter === "todas" || getTransactionDirection(tx.type) === activeFilter);
  if (!filtered.length) { container.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--muted);">No hay movimientos para este filtro</p>'; return; }
  container.innerHTML = "";
  [...filtered].reverse().slice(0, 6).forEach((tx) => {
    const isIncome = getTransactionDirection(tx.type) === "entrada";
    container.insertAdjacentHTML("beforeend", `<article class="transaction-item"><div class="transaction-icon ${isIncome ? "income" : "outcome"}"><i class="fa-solid ${isIncome ? "fa-arrow-down" : "fa-arrow-up"}"></i></div><div><h4>${tx.description}</h4><p>${tx.date}</p></div><strong class="${isIncome ? "success-text" : "danger-text"}">${isIncome ? "+" : "-"} ${formatCurrency(tx.amount)}</strong></article>`);
  });
}

function setupBalanceToggle() { const b = document.querySelector("#toggleBalanceBtn"); const a = document.querySelector("#balanceAmount"); if (!b || !a) return; let isVisible = true; b.addEventListener("click", function () { isVisible = !isVisible; const u = getUser(); a.textContent = isVisible ? formatCurrency(u.balance) : "Bs. •••••••"; b.innerHTML = isVisible ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>'; }); }
function setupLogout() { const logoutBtn = document.querySelector("#logoutBtn"); if (logoutBtn) logoutBtn.addEventListener("click", function (e) { e.preventDefault(); localStorage.removeItem("banca360User"); window.location.href = "index.html"; }); }
