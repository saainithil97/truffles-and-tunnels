// Day 3, Demo 2.5 — browser storage.
//
// Two stores, two jobs:
//   localStorage   -> swiggy:theme        (a UI preference; persists forever)
//   sessionStorage -> swiggy:checkoutStep (per-tab state; dies with the tab)
// Neither ever leaves the browser. Cookies would; these never touch the server.

const THEME_KEY = "swiggy:theme";
const STEP_KEY = "swiggy:checkoutStep";

const STEP_NAMES = { 1: "Address", 2: "Payment", 3: "Confirm" };
const MIN_STEP = 1;
const MAX_STEP = 3;

// --- Dark mode (localStorage) ----------------------------------------------

const toggle = document.getElementById("dark-toggle");

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// On load: reflect whatever was saved (the inline <head> script already applied
// it to avoid a flash; here we just sync the checkbox).
const savedDark = localStorage.getItem(THEME_KEY) === "dark";
toggle.checked = savedDark;
applyTheme(savedDark);

toggle.addEventListener("change", () => {
  const isDark = toggle.checked;
  applyTheme(isDark);
  // Writing to localStorage is what makes it survive a reload / new tab / restart.
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// --- Checkout step (sessionStorage) ----------------------------------------

const stepNum = document.getElementById("step-num");
const stepName = document.getElementById("step-name");
const steps = document.querySelectorAll("#steps li");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");

function readStep() {
  const raw = sessionStorage.getItem(STEP_KEY);
  const n = parseInt(raw, 10);
  // A brand-new tab has no value -> null -> NaN -> fall back to step 1.
  return Number.isNaN(n) ? MIN_STEP : Math.min(MAX_STEP, Math.max(MIN_STEP, n));
}

function render(step) {
  stepNum.textContent = step;
  stepName.textContent = STEP_NAMES[step];
  steps.forEach((li) => {
    li.classList.toggle("active", Number(li.dataset.step) === step);
    li.classList.toggle("done", Number(li.dataset.step) < step);
  });
  backBtn.disabled = step === MIN_STEP;
  nextBtn.disabled = step === MAX_STEP;
}

function setStep(step) {
  // Writing to sessionStorage is what makes it survive a reload (but not a new tab).
  sessionStorage.setItem(STEP_KEY, String(step));
  render(step);
}

backBtn.addEventListener("click", () => setStep(Math.max(MIN_STEP, readStep() - 1)));
nextBtn.addEventListener("click", () => setStep(Math.min(MAX_STEP, readStep() + 1)));

// On load: pick up wherever this tab left off (or step 1 in a fresh tab).
render(readStep());
