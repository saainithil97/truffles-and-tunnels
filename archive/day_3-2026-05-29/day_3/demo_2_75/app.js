// Demo 2.75 — "One thread, one mood"
//
// Four scenarios that make the event loop visible:
//   ① synchronous block (everything stops)
//   ② setTimeout(0) before a block (timer is *not* immediate)
//   ③ Promise vs setTimeout(0) (microtask beats macrotask)
//   ④ rAF before a block (rAF is paint-aligned, not real-time)
//
// Two persistent main-thread health indicators in the topbar:
//   - canary spinner driven by requestAnimationFrame (rotates 6° per frame)
//   - clock driven by setInterval (updates every 50ms)
// Both freeze whenever a scenario runs a synchronous task — that freeze IS
// the lesson. They catch up in one jerk when the queue drains.

const canaryEl = document.getElementById("canary");
const clockEl = document.getElementById("clock");
const logEl = document.getElementById("log-list");
const clearBtn = document.getElementById("clear-log");

const t0 = performance.now();

// --- canary (rAF spinner) -----------------------------------------------
// rAF rotates the spinner by 6° per frame. At 60 Hz that's ~360°/sec — one
// full rotation per second. If the main thread is blocked, rAF can't fire,
// so the spinner visibly stops mid-rotation.
let spinAngle = 0;
function tickFrame() {
  spinAngle = (spinAngle + 6) % 360;
  canaryEl.style.transform = `rotate(${spinAngle}deg)`;
  requestAnimationFrame(tickFrame);
}
requestAnimationFrame(tickFrame);

// --- clock (setInterval) ------------------------------------------------
// setInterval queues a callback every 50ms. While the main thread is blocked,
// those callbacks back up but only one ever runs after the block ends — the
// browser deliberately drops backlogged interval ticks (the "Window timers
// step" of the HTML spec coalesces them). So the clock just appears to leap
// forward to the current time, rather than fire 20 times in a row.
setInterval(() => {
  const ms = performance.now() - t0;
  const totalS = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalS / 60)).padStart(2, "0");
  const ss = String(totalS % 60).padStart(2, "0");
  const mmm = String(Math.floor(ms % 1000)).padStart(3, "0");
  clockEl.textContent = `${mm}:${ss}.${mmm}`;
}, 50);

// --- log helper ---------------------------------------------------------
// Each entry shows the elapsed time in ms when this line ran. Reading the
// timestamps left-to-right tells you the *real* execution order — which is
// usually NOT the order the queueing calls appear in the source.
function log(msg, cls = "") {
  // Remove the placeholder hint on the first real log line.
  const hint = logEl.querySelector(".log__item--hint");
  if (hint) hint.remove();
  const li = document.createElement("li");
  li.className = `log__item ${cls}`;
  const ts = (performance.now() - t0).toFixed(0);
  li.innerHTML = `<span class="log__ts">${ts.padStart(5, " ")} ms</span> <span class="log__msg">${msg}</span>`;
  logEl.appendChild(li);
  logEl.scrollTop = logEl.scrollHeight;
}

function divider(label) {
  const hint = logEl.querySelector(".log__item--hint");
  if (hint) hint.remove();
  const li = document.createElement("li");
  li.className = "log__item log__item--divider";
  li.textContent = label;
  logEl.appendChild(li);
  logEl.scrollTop = logEl.scrollHeight;
}

// --- block helper -------------------------------------------------------
// Tight synchronous loop. The browser cannot interrupt this — it just runs
// until performance.now() crosses the target. Whatever was queued during
// this time waits.
function blockFor(ms) {
  const end = performance.now() + ms;
  // eslint-disable-next-line no-empty
  while (performance.now() < end) {
    /* burn cycles */
  }
}

// --- scenarios ----------------------------------------------------------

function scenarioBlock() {
  divider("▶ scenario ① — block the thread for 1 s");
  log("about to enter while loop", "log__item--sync");
  blockFor(1000);
  log("done — while loop exited", "log__item--sync");
}

function scenarioSetTimeoutZero() {
  divider("▶ scenario ② — setTimeout(fn, 0) then block 1 s");
  log("queue: setTimeout(fn, 0)", "log__item--sync");
  setTimeout(
    () =>
      log(
        "TIMER fired (note: after the block, not before)",
        "log__item--timer",
      ),
    0,
  );
  log("start: block 1 s (no timer can fire here)", "log__item--sync");
  blockFor(1000);
  log("done: sync code finished — timer can now run", "log__item--sync");
}

function scenarioMicroVsMacro() {
  divider("▶ scenario ③ — Promise vs setTimeout(0)");
  log("queue: setTimeout(fn, 0)  — macrotask", "log__item--sync");
  setTimeout(
    () => log("MACRO setTimeout(0) ran", "log__item--timer"),
    0,
  );
  log("queue: Promise.resolve().then(fn) — microtask", "log__item--sync");
  Promise.resolve().then(() =>
    log("MICRO promise.then ran", "log__item--promise"),
  );
  log(
    "end of sync code — watch the order of the next two lines",
    "log__item--sync",
  );
}

function scenarioRafDuringBlock() {
  divider("▶ scenario ④ — requestAnimationFrame then block 1 s");
  log("queue: requestAnimationFrame(fn)", "log__item--sync");
  requestAnimationFrame(() =>
    log(
      "RAF fired (paint-aligned — happened only after the block ended)",
      "log__item--raf",
    ),
  );
  log("start: block 1 s", "log__item--sync");
  blockFor(1000);
  log("done: sync code finished — next paint can now happen", "log__item--sync");
}

const handlers = {
  block: scenarioBlock,
  setTimeoutZero: scenarioSetTimeoutZero,
  microVsMacro: scenarioMicroVsMacro,
  rafDuringBlock: scenarioRafDuringBlock,
};

document.querySelectorAll("button.scenario").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.scenario;
    const fn = handlers[key];
    if (fn) fn();
  });
});

clearBtn.addEventListener("click", () => {
  logEl.innerHTML =
    '<li class="log__item log__item--hint">Click a scenario above. Each event below shows what ran, in what order, with a millisecond timestamp.</li>';
});
