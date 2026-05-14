const USER_KEY = "banca360User";
const SECURITY_KEY = "banca360Security";
const SESSION_KEY = "banca360Session";

function saveUser(user) { 
  localStorage.setItem(USER_KEY, JSON.stringify(user)); 
}

function getUser() { 
  const user = localStorage.getItem(USER_KEY); 
  return user ? JSON.parse(user) : null; 
}

function saveSession(email) { localStorage.setItem(SESSION_KEY, email); }
function getSession() { return localStorage.getItem(SESSION_KEY); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }
function hasSession() { return Boolean(getSession()); }

function updateUser(newData) { 
  const user = getUser(); 
  if (!user) return null; 
  const updatedUser = { ...user, ...newData }; 
  saveUser(updatedUser); 
  return updatedUser; 
}

function saveSecurityQuestions(securityData) { 
  localStorage.setItem(SECURITY_KEY, JSON.stringify(securityData)); 
}

function getSecurityQuestions() { 
  const securityData = localStorage.getItem(SECURITY_KEY); 
  return securityData ? JSON.parse(securityData) : null; 
}

function getTransactionDirection(type) { 
  const incomeTypes = ["deposito", "transferencia_recibida"];
  return incomeTypes.includes(type) ? "entrada" : "salida"; 
}
