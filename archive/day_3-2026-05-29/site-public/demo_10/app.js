// Day 3, Demo 10 — frontend security (XSS).
//
// Two render paths for a user-submitted review. The UNSAFE path uses innerHTML
// and will execute markup the user typed (that's the XSS). The SAFE path uses
// textContent, which renders the input as literal text — the browser never
// treats it as HTML. The radio buttons pick which path runs.

const form = document.getElementById("review-form");
const input = document.getElementById("review-input");
const feed = document.getElementById("review-feed");

// Seed one normal review so the feed isn't empty.
addReviewSafe("Great biryani! 🔥");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const mode = form.querySelector('input[name="mode"]:checked').value;

  if (mode === "unsafe") {
    addReviewUnsafe(text);
  } else {
    addReviewSafe(text);
  }

  input.value = "";
  input.focus();
});

// ☠️ UNSAFE: drops the raw user string into innerHTML. If the user typed
// markup (e.g. <img src=x onerror="alert('hacked')">), the browser parses and
// runs it. In the real world this is how an attacker steals document.cookie.
function addReviewUnsafe(text) {
  const li = document.createElement("li");
  li.className = "review";
  li.innerHTML = text; // <-- the vulnerability
  feed.prepend(li);
}

// ✅ SAFE: textContent renders the string as literal text. The browser does not
// parse it as HTML, so <img ...> shows up as the characters "<img ...>".
// React does this for you: {userInput} is escaped by default — you'd have to
// reach for dangerouslySetInnerHTML to opt back into the unsafe behaviour.
function addReviewSafe(text) {
  const li = document.createElement("li");
  li.className = "review";
  li.textContent = text; // <-- safe by construction
  feed.prepend(li);
}
