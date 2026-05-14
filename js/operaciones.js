document.addEventListener("DOMContentLoaded", function () {
  protectView();
  setupLogout();
  setupNumericInputs(); // Nueva función para restringir letras

  const depositForm = document.querySelector("#depositForm");
  const transferForm = document.querySelector("#transferForm");
  const mobilePaymentForm = document.querySelector("#mobilePaymentForm");

  if (depositForm) depositForm.addEventListener("submit", handleDeposit);
  if (transferForm) transferForm.addEventListener("submit", handleTransfer);
  if (mobilePaymentForm)
    mobilePaymentForm.addEventListener("submit", handleMobilePayment);
});

function protectView() {
  if (!getUser() || (typeof hasSession === "function" && !hasSession()))
    window.location.href = "index.html";
}

function setupLogout() {
  const logoutBtns = document.querySelectorAll("#logoutBtn, .logout-btn");
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof clearSession === "function") clearSession();
      window.location.href = "sesion-finalizada.html";
    });
  });
}

// NUEVA FUNCIÓN: Evita que el usuario escriba letras en campos numéricos
function setupNumericInputs() {
  const numericFields = [
    "#mobileDocId",
    "#mobilePhone",
    "#transferDocId",
    "#targetAccount",
  ];

  numericFields.forEach((selector) => {
    const input = document.querySelector(selector);
    if (input) {
      input.addEventListener("input", function () {
        // Expresión regular que reemplaza todo lo que NO sea un dígito (\D) por nada ('')
        this.value = this.value.replace(/\D/g, "");
      });
    }
  });
}

function buildTransaction(type, amount, description, extra = {}) {
  return {
    id: Date.now(),
    type,
    amount,
    description,
    extra,
    date: new Date().toLocaleString("es-VE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function showReceipt(title, tx) {
  localStorage.setItem("banca360LastReceipt", JSON.stringify({ title, tx }));
  window.location.href = `comprobante.html?id=${tx.id}`;
}

function handleDeposit(event) {
  event.preventDefault();
  const amount = parseFloat(document.querySelector("#amount").value);
  const concept = document.querySelector("#concept").value.trim();
  const e = document.querySelector("#depositError");
  const s = document.querySelector("#depositSuccess");

  if (isNaN(amount) || amount <= 0 || !concept)
    return showFeedback(e, s, "Completa monto válido y concepto.");

  const user = getUser();
  const tx = buildTransaction("deposito", amount, concept);
  user.balance += amount;
  user.transactions.push(tx);
  saveUser(user);

  showFeedback(s, e, "Depósito simulado con éxito.");
  event.target.reset();
}

function handleTransfer(event) {
  event.preventDefault();
  const docType = document.querySelector("#transferDocType")?.value;
  const docId = document.querySelector("#transferDocId")?.value.trim();
  const bank = document.querySelector("#transferBank")?.value;
  const account = document.querySelector("#targetAccount").value.trim();
  const amount = parseFloat(document.querySelector("#transferAmount").value);
  const concept = document.querySelector("#transferConcept").value.trim();
  const e = document.querySelector("#transferError");
  const s = document.querySelector("#transferSuccess");
  const user = getUser();

  // VALIDACIONES ESTRICTAS DE TRANSFERENCIA
  if (
    !docType ||
    !docId ||
    !bank ||
    !account ||
    !concept ||
    isNaN(amount) ||
    amount <= 0
  ) {
    return showFeedback(e, s, "Completa todos los campos obligatorios.");
  }
  if (docId.length < 6) {
    return showFeedback(e, s, "La cédula/RIF debe tener al menos 6 números.");
  }
  if (account.length !== 20) {
    return showFeedback(
      e,
      s,
      "El número de cuenta debe tener exactamente 20 dígitos.",
    );
  }
  if (amount > user.balance) {
    return showFeedback(e, s, "Saldo insuficiente para esta operación.");
  }

  const tx = buildTransaction(
    "transferencia",
    amount,
    `Transferencia a ${account} - ${concept}`,
    { docType, docId, bank, account },
  );
  user.balance -= amount;
  user.transactions.push(tx);
  saveUser(user);

  showFeedback(s, e, "Transferencia realizada.");
  event.target.reset();
  showReceipt("Comprobante de transferencia", tx);
}

function handleMobilePayment(event) {
  event.preventDefault();
  const docType = document.querySelector("#mobileDocType")?.value;
  const docId = document.querySelector("#mobileDocId")?.value.trim();
  const bank = document.querySelector("#mobileBank")?.value;
  const phone = document.querySelector("#mobilePhone").value.trim();
  const amount = parseFloat(document.querySelector("#mobileAmount").value);
  const concept = document.querySelector("#mobileConcept").value.trim();
  const e = document.querySelector("#mobileError");
  const s = document.querySelector("#mobileSuccess");
  const user = getUser();

  // VALIDACIONES ESTRICTAS DE PAGO MÓVIL
  if (
    !docType ||
    !docId ||
    !bank ||
    !phone ||
    !concept ||
    isNaN(amount) ||
    amount <= 0
  ) {
    return showFeedback(e, s, "Completa todos los campos obligatorios.");
  }
  if (docId.length < 6) {
    return showFeedback(e, s, "La cédula/RIF debe tener al menos 6 números.");
  }
  if (phone.length !== 11 || !phone.startsWith("04")) {
    return showFeedback(
      e,
      s,
      "El teléfono debe tener 11 dígitos y empezar con 04 (Ej. 04141234567).",
    );
  }
  if (amount > user.balance) {
    return showFeedback(e, s, "Saldo insuficiente para esta operación.");
  }

  const tx = buildTransaction(
    "pago_movil",
    amount,
    `Pago móvil a ${phone} - ${concept}`,
    { docType, docId, bank, phone },
  );
  user.balance -= amount;
  user.transactions.push(tx);
  saveUser(user);

  showFeedback(s, e, "Pago móvil realizado.");
  event.target.reset();
  showReceipt("Comprobante de pago móvil", tx);
}

function showFeedback(showEl, hideEl, message) {
  if (showEl) showEl.textContent = message;
  if (hideEl) hideEl.textContent = "";
}
