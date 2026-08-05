(function () {
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("mobile-nav");
  var hero = document.querySelector(".hero");

  function setHeaderMode() {
    if (!header) return;

    var scrolled = window.scrollY > 12;
    header.classList.toggle("is-scrolled", scrolled);

    var pastHero = true;
    if (hero) {
      pastHero = window.scrollY > hero.offsetHeight - header.offsetHeight - 8;
    }
    header.classList.toggle("is-light", pastHero);
  }

  setHeaderMode();
  window.addEventListener("scroll", setHeaderMode, { passive: true });
  window.addEventListener("resize", setHeaderMode);

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Menyunu aç" : "Menyunu bağla");
      nav.hidden = isOpen;
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Menyunu aç");
        nav.hidden = true;
      });
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    nodes.forEach(function (node) {
      node.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach(function (node) {
    observer.observe(node);
  });
})();
