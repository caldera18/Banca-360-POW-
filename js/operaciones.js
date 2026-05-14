document.addEventListener("DOMContentLoaded", function () {
  protectView();
  setupLogout();

  const depositForm = document.querySelector("#depositForm");
  const transferForm = document.querySelector("#transferForm");
  const mobilePaymentForm = document.querySelector("#mobilePaymentForm");

  if (depositForm) depositForm.addEventListener("submit", handleDeposit);
  if (transferForm) transferForm.addEventListener("submit", handleTransfer);
  if (mobilePaymentForm) mobilePaymentForm.addEventListener("submit", handleMobilePayment);
});

function protectView() { if (!getUser()) window.location.href = "index.html"; }

function setupLogout() {
  const logoutBtn = document.querySelector("#logoutBtn");
  if (!logoutBtn) return;
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("banca360User");
    window.location.href = "index.html";
  });
}

function buildTransaction(type, amount, description) {
  return { id: Date.now(), type, amount, description, date: new Date().toLocaleString("es-VE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) };
}

function handleDeposit(event) {
  event.preventDefault();
  const amount = parseFloat(document.querySelector("#amount").value);
  const concept = document.querySelector("#concept").value.trim();
  const errorElement = document.querySelector("#depositError");
  const successElement = document.querySelector("#depositSuccess");
  if (isNaN(amount) || amount <= 0 || !concept) return showFeedback(errorElement, successElement, "Completa monto válido y concepto.", true);
  const user = getUser();
  user.balance += amount;
  user.transactions.push(buildTransaction("deposito", amount, concept));
  saveUser(user);
  showFeedback(successElement, errorElement, "Depósito realizado con éxito.", false);
  event.target.reset();
}

function handleTransfer(event) {
  event.preventDefault();
  const amount = parseFloat(document.querySelector("#transferAmount").value);
  const target = document.querySelector("#targetAccount").value.trim();
  const concept = document.querySelector("#transferConcept").value.trim();
  const errorElement = document.querySelector("#transferError");
  const successElement = document.querySelector("#transferSuccess");
  const user = getUser();
  if (isNaN(amount) || amount <= 0 || !target || !concept) return showFeedback(errorElement, successElement, "Completa todos los campos correctamente.", true);
  if (amount > user.balance) return showFeedback(errorElement, successElement, "Saldo insuficiente para transferir.", true);
  user.balance -= amount;
  user.transactions.push(buildTransaction("transferencia", amount, `Transferencia a ${target} - ${concept}`));
  saveUser(user);
  showFeedback(successElement, errorElement, "Transferencia realizada.", false);
  event.target.reset();
}

function handleMobilePayment(event) {
  event.preventDefault();
  const amount = parseFloat(document.querySelector("#mobileAmount").value);
  const phone = document.querySelector("#mobilePhone").value.trim();
  const concept = document.querySelector("#mobileConcept").value.trim();
  const errorElement = document.querySelector("#mobileError");
  const successElement = document.querySelector("#mobileSuccess");
  const user = getUser();
  if (isNaN(amount) || amount <= 0 || !phone || !concept) return showFeedback(errorElement, successElement, "Completa todos los campos correctamente.", true);
  if (amount > user.balance) return showFeedback(errorElement, successElement, "Saldo insuficiente para pago móvil.", true);
  user.balance -= amount;
  user.transactions.push(buildTransaction("pago_movil", amount, `Pago móvil a ${phone} - ${concept}`));
  saveUser(user);
  showFeedback(successElement, errorElement, "Pago móvil realizado.", false);
  event.target.reset();
}

function showFeedback(showEl, hideEl, message) {
  showEl.textContent = message;
  hideEl.textContent = "";
}
