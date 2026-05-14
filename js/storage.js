const USER_KEY = "banca360User";
const SECURITY_KEY = "banca360Security";

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  return JSON.parse(user);
}

function updateUser(newData) {
  const user = getUser();
  if (user) {
    const updatedUser = { ...user, ...newData };
    saveUser(updatedUser);
    return updatedUser;
  }
  return null;
}

function saveSecurityQuestions(securityData) {
  localStorage.setItem(SECURITY_KEY, JSON.stringify(securityData));
}

function getSecurityQuestions() {
  const securityData = localStorage.getItem(SECURITY_KEY);
  if (!securityData) return null;
  return JSON.parse(securityData);
}

function getTransactionDirection(type) {
  const incomeTypes = ["deposito", "transferencia_recibida"];
  return incomeTypes.includes(type) ? "entrada" : "salida";
}
