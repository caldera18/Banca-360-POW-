document.addEventListener("DOMContentLoaded", function () {
  const depositForm = document.querySelector("#depositForm");

  if (depositForm) {
    depositForm.addEventListener("submit", handleDeposit);
  }
});

function handleDeposit(event) {
  event.preventDefault();

  const amountInput = document.querySelector("#amount");
  const conceptInput = document.querySelector("#concept");
  const errorElement = document.querySelector("#depositError");
  const successElement = document.querySelector("#depositSuccess");

  const amount = parseFloat(amountInput.value);
  const concept = conceptInput.value.trim();

  if (isNaN(amount) || amount <= 0) {
    showFeedback(errorElement, successElement, "Por favor, ingresa un monto válido mayor a cero.", true);
    return;
  }

  if (!concept) {
    showFeedback(errorElement, successElement, "El concepto es obligatorio.", true);
    return;
  }

  const user = getUser();
  if (!user) return;

  const newTransaction = {
    id: Date.now(),
    type: "deposito",
    amount: amount,
    description: concept,
    date: new Date().toLocaleString("es-VE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  user.balance += amount;
  user.transactions.push(newTransaction);

  saveUser(user);

  showFeedback(
    successElement,
    errorElement,
    `¡Depósito de Bs. ${amount.toLocaleString("es-VE", { minimumFractionDigits: 2 })} realizado con éxito!`,
    false
  );

  depositForm.reset();

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 2000);
}

function showFeedback(showEl, hideEl, message, isError) {
  showEl.textContent = message;
  hideEl.textContent = "";
}