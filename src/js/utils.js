export const darkModeWandler = () => {
  const darkModeSwitcher = document.getElementById("toggleDarkMode");
  const htmlEl = document.documentElement;

  if (localStorage.getItem("mode") === "dark") {
    htmlEl.classList.add("dark");
    darkModeSwitcher.checked = true;
  }

  darkModeSwitcher.addEventListener("input", () => {
    htmlEl.classList.toggle("dark");
    htmlEl.classList.contains("dark")
      ? localStorage.setItem("mode", "dark")
      : localStorage.setItem("mode", "light");
  });
};
