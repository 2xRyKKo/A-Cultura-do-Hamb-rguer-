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
  // Hero video — dual-layer crossfade loop.
  //
  // The supplied source clip is a one-way "explosion" animation (closed
  // burgers -> full separation) that does NOT return to its start frame
  // within its own 6s duration, so a single looping <video> would show a
  // visible jump-cut at the seam. Two identical <video> elements are kept
  // permanently playing (native loop), phase-offset by half the clip's
  // duration, so one of them is always safely mid-clip while the other is
  // near its own jump point — a CSS opacity crossfade swaps which layer is
  // visible right before each one's jump, masking the seam.
  // --------------------------------------------------------------------
  function initHeroVideoLoop() {
    var media = document.querySelector(".hero__media");
    if (!media || REDUCE_MOTION) return;

    var videoA = media.querySelector('[data-video-layer="a"]');
    var videoB = media.querySelector('[data-video-layer="b"]');
    if (!videoA || !videoB) return;

    var CROSSFADE_LEAD = 0.4; // seconds before a layer's own end to swap away from it
    var active = videoA;
    var standby = videoB;
    var bArmed = false;

    function swapIfNeeded(video) {
      if (video !== active || !bArmed) return;
      if (!video.duration) return;
      if (video.currentTime >= video.duration - CROSSFADE_LEAD) {
        active.setAttribute("data-active", "false");
        standby.setAttribute("data-active", "true");
        var tmp = active;
        active = standby;
        standby = tmp;
      }
    }

    videoA.addEventListener("timeupdate", function () {
      swapIfNeeded(videoA);
    });
    videoB.addEventListener("timeupdate", function () {
      swapIfNeeded(videoB);
    });

    // Setting these as JS properties (not just HTML attributes) is required
    // for reliable autoplay on iOS Safari in some versions — the attribute
    // alone is not always enough once .play() is called programmatically.
    videoA.muted = true;
    videoA.defaultMuted = true;
    videoA.playsInline = true;
    videoB.muted = true;
    videoB.defaultMuted = true;
    videoB.playsInline = true;

    videoA.setAttribute("data-active", "true");
    videoA.play().catch(function () {});

    // Layer B only requests the (identical) video URL once layer A has
    // fully buffered, so its request is served from the HTTP cache rather
    // than triggering a second full download of the same 1.8MB asset —
    // keeps the NFC-tap critical path to a single video transfer.
    function armLayerB() {
      if (bArmed) return;
      var src = videoB.getAttribute("data-src");
      if (!src || !videoA.duration) return;
      bArmed = true;
      videoB.src = src;
      videoB.addEventListener(
        "loadedmetadata",
        function () {
          videoB.currentTime = videoA.duration / 2;
          videoB.play().catch(function () {});
        },
        { once: true }
      );
    }

    videoA.addEventListener("canplaythrough", armLayerB, { once: true });
    // Safety net: some browsers/network conditions never fire canplaythrough
    // for short clips — arm layer B a few seconds in regardless.
    window.setTimeout(armLayerB, 3000);

    // Browsers (Safari in particular) can pause background-tab video for
    // power saving — if the customer's phone locks briefly or they switch
    // apps and come back, resume whichever layer is currently the visible
    // one rather than leaving the hero frozen on a still frame.
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && active.paused) {
        active.play().catch(function () {});
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
