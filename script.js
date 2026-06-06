(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("mobile-nav");

  if (!toggle || !nav) return;

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
})();
