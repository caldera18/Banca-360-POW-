const USER_KEY = "banca360User";
const SECURITY_KEY = "banca360Security";

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

function saveSecurityQuestions(securityData) {
  localStorage.setItem(SECURITY_KEY, JSON.stringify(securityData));
}

function getSecurityQuestions() {
  const securityData = localStorage.getItem(SECURITY_KEY);

  if (!securityData) {
    return null;
  }

  return JSON.parse(securityData);
}
