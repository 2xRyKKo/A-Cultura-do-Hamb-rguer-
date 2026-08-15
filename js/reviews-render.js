(function () {
  "use strict";

  function starString(rating) {
    var n = Math.max(0, Math.min(5, Math.round(rating || 5)));
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }

  function buildCard(review) {
    var card = document.createElement("article");
    card.className = "review-card";
    card.setAttribute("role", "listitem");

    var stars = document.createElement("div");
    stars.className = "review-card__stars";
    stars.setAttribute("aria-hidden", "true");
    stars.textContent = starString(review.rating);
    card.appendChild(stars);

    var text = document.createElement("p");
    text.className = "review-card__text";
    text.textContent = review.text;
    card.appendChild(text);

    var meta = document.createElement("div");
    meta.className = "review-card__meta";

    var author = document.createElement("span");
    author.className = "review-card__author";
    author.textContent = review.author;
    meta.appendChild(author);

    var source = document.createElement("span");
    source.className = "review-card__source";
    source.textContent = review.date ? "Google · " + review.date : "Google";
    meta.appendChild(source);

    card.appendChild(meta);
    return card;
  }

  function scrollByCard(track, dir) {
    var firstCard = track.querySelector(".review-card");
    var step = firstCard ? firstCard.getBoundingClientRect().width + 24 : 320;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  function init() {
    var section = document.getElementById("reviews-showcase");
    if (!section) return;

    var data = window.ACHB_REVIEWS_DATA || [];
    if (!data.length) {
      // No real review text supplied yet — hide rather than ship placeholders.
      section.hidden = true;
      return;
    }

    var track = document.getElementById("reviews-showcase-track");
    var prevBtn = document.getElementById("reviews-showcase-prev");
    var nextBtn = document.getElementById("reviews-showcase-next");
    if (!track) return;

    data.forEach(function (review) {
      track.appendChild(buildCard(review));
    });

    if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCard(track, -1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCard(track, 1); });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
