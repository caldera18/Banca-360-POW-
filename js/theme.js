const THEME_KEY = "banca360Theme";

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
}

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

document.addEventListener("DOMContentLoaded", function () {
  applyTheme(getStoredTheme());

  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (!themeToggle) return;

  themeToggle.addEventListener("click", function () {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });
});
