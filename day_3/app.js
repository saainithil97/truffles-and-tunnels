// Request #3 in the waterfall. The card already looks finished before this file
// arrives — but the Like button does nothing until this code runs. On Slow 3G
// you can click it and watch nothing happen, then it "comes alive" once the JS
// lands. Pretty != working.
(function () {
  const button = document.getElementById("like");
  const count = document.getElementById("like-count");
  let likes = 0;

  button.addEventListener("click", function () {
    likes += 1;
    count.textContent = String(likes);
    button.classList.add("is-liked");
    // The button's first child is the leading text node ("🤍 Like ").
    button.firstChild.textContent = "❤ Liked ";
  });
})();
