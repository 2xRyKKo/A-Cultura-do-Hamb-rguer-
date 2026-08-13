(function () {
  "use strict";

  var REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  if (hasGsap) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  // --------------------------------------------------------------------
  // splitLines — free word-reveal alternative to GSAP's paid SplitText.
  // Keeps a screen-reader-only copy of the original text, wraps the
  // visible copy word-by-word in masked spans so GSAP can animate a
  // clean upward reveal. Re-run on language change (§ i18n).
  // --------------------------------------------------------------------
  function splitLines(elNode) {
    var original = elNode.getAttribute("data-i18n")
      ? elNode.textContent
      : elNode.textContent;

    elNode.innerHTML = "";

    var srCopy = document.createElement("span");
    srCopy.className = "sr-only";
    srCopy.textContent = original;
    elNode.appendChild(srCopy);

    var visual = document.createElement("span");
    visual.className = "split-visual";
    visual.setAttribute("aria-hidden", "true");

    var words = original.split(" ");
    words.forEach(function (word, i) {
      var mask = document.createElement("span");
      mask.className = "split-line-mask";
      var wordEl = document.createElement("span");
      wordEl.className = "split-word";
      wordEl.textContent = word + (i < words.length - 1 ? " " : "");
      mask.appendChild(wordEl);
      visual.appendChild(mask);
    });

    elNode.appendChild(visual);
    return elNode.querySelectorAll(".split-word");
  }

  function revealWords(words, opts) {
    if (!hasGsap || REDUCE_MOTION) return;
    window.gsap.set(words, { yPercent: 100, opacity: 0 });
    window.gsap.to(
      words,
      Object.assign(
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.03,
        },
        opts || {}
      )
    );
  }

  function runSplitReveals(root) {
    var scope = root || document;
    // The hero headline is excluded here — initHeroTimeline() owns it as
    // part of its on-load sequence. Running splitLines() twice on the same
    // node would corrupt it (the second pass reads textContent AFTER the
    // first pass already restructured the DOM into nested spans).
    scope.querySelectorAll("[data-reveal='lines']:not(#hero [data-reveal='lines'])").forEach(function (node) {
      var words = splitLines(node);
      var isScrollDeferred = node.getAttribute("data-reveal-scroll") === "true";

      if (isScrollDeferred) {
        // Hold words hidden until the ScrollTrigger below fires — no tween
        // needed yet, just the hidden starting state.
        if (hasGsap && !REDUCE_MOTION) window.gsap.set(words, { yPercent: 100, opacity: 0 });
      } else {
        revealWords(words, {});
      }

      if (isScrollDeferred && hasGsap && !REDUCE_MOTION) {
        window.ScrollTrigger.create({
          trigger: node,
          start: "top 78%",
          once: true,
          onEnter: function () {
            revealWords(words, {});
          },
        });
      }
    });
  }

  // --------------------------------------------------------------------
  // Hero on-load timeline (headline reveal + CTA), not scroll-tied.
  // --------------------------------------------------------------------
  function initHeroTimeline() {
    var hero = document.getElementById("hero");
    if (!hero) return;

    var headline = hero.querySelector("[data-reveal='lines']");
    var restEls = hero.querySelectorAll("[data-hero-fade]");

    if (!hasGsap || REDUCE_MOTION) {
      restEls.forEach(function (n) {
        n.style.opacity = 1;
      });
      return;
    }

    window.gsap.set(restEls, { opacity: 0, y: 16 });

    var tl = window.gsap.timeline({ delay: 0.15 });
    if (headline) {
      var words = splitLines(headline);
      window.gsap.set(words, { yPercent: 100, opacity: 0 });
      tl.to(words, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.03 });
    }
    tl.to(restEls, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12 }, "-=0.4");
  }

  // --------------------------------------------------------------------
  // Hero video — single element, native loop. Plays its full duration on
  // every pass with no early cut/crossfade — the client explicitly wants
  // the whole clip to run through every time, seam or not.
  // --------------------------------------------------------------------
  function initHeroVideoLoop() {
    var media = document.querySelector(".hero__media");
    if (!media || REDUCE_MOTION) return;

    var video = media.querySelector(".hero__video-layer");
    if (!video) return;

    // Setting these as JS properties (not just HTML attributes) is required
    // for reliable autoplay on iOS Safari in some versions — the attribute
    // alone is not always enough once .play() is called programmatically.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.play().catch(function () {});

    // Browsers (Safari in particular) can pause background-tab video for
    // power saving — if the customer's phone locks briefly or they switch
    // apps and come back, resume playback rather than leaving the hero
    // frozen on a still frame.
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && video.paused) {
        video.play().catch(function () {});
      }
    });
  }

  // --------------------------------------------------------------------
  // Per-section reveals
  // --------------------------------------------------------------------
  function batchReveal(selector, opts) {
    if (!hasGsap || REDUCE_MOTION) return;
    var nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;
    window.ScrollTrigger.batch(selector, {
      start: "top 85%",
      once: true,
      onEnter: function (batch) {
        window.gsap.from(
          batch,
          Object.assign({ opacity: 0, y: 24, duration: 0.7, ease: "power2.out", stagger: 0.12 }, opts || {})
        );
      },
    });
  }

  function fadeInOnce(selector) {
    if (!hasGsap || REDUCE_MOTION) return;
    document.querySelectorAll(selector).forEach(function (node) {
      window.gsap.set(node, { opacity: 0, y: 20 });
      window.ScrollTrigger.create({
        trigger: node,
        start: "top 82%",
        once: true,
        onEnter: function () {
          window.gsap.to(node, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        },
      });
    });
  }

  function initReviewsRevealAnimation() {
    document.addEventListener("reviewsRevealed", function () {
      var card = document.querySelector(".reviews-card");
      if (!card) return;
      if (!hasGsap || REDUCE_MOTION) return;
      window.gsap.from(card.querySelectorAll(".reviews-stars svg, .reviews-rating"), {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.05,
        delay: 0.1,
      });
    });
  }

  function initNav() {
    // nav.js owns the actual ScrollTrigger for solid-nav toggle so it can
    // fall back gracefully when GSAP isn't loaded; nothing to do here.
  }

  function initAll() {
    runSplitReveals(document);
    initHeroTimeline();
    initHeroVideoLoop();
    batchReveal(".burger-card");
    batchReveal(".menu-category");
    fadeInOnce(".info-grid");
    initReviewsRevealAnimation();
    initNav();
  }

  document.addEventListener("DOMContentLoaded", initAll);
  document.addEventListener("languagechange", function () {
    // Re-run split-line reveals for any marketing copy that uses them,
    // then refresh ScrollTrigger since re-rendered text can change layout height.
    document.querySelectorAll("[data-reveal='lines']:not(#hero [data-reveal='lines'])").forEach(function (node) {
      var words = splitLines(node);
      window.gsap && window.gsap.set(words, { yPercent: 0, opacity: 1 });
    });
    if (hasGsap) window.ScrollTrigger.refresh();
  });
})();
