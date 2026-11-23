const toggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
function closeMenu(restoreFocus = false) {
  if (!toggle || !mobileNav) return;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Menyunu aç");
  mobileNav.hidden = true;
  if (restoreFocus) toggle.focus();
}
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Menyunu bağla" : "Menyunu aç");
  mobileNav.hidden = !open;
});
mobileNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle?.getAttribute("aria-expanded") === "true"
  )
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 701px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

// The illustrations settle once as they enter view. Text stays visible without JS.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const illustrations = [...document.querySelectorAll("[data-illustration]")];
let illustrationObserver;
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  illustrationObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        illustrationObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.3 },
  );
  illustrations.forEach((art) => illustrationObserver.observe(art));
}
reducedMotion.addEventListener("change", (event) => {
  if (event.matches) {
    illustrationObserver?.disconnect();
    illustrations.forEach((art) => art.classList.remove("is-revealed"));
  }
});

const stage = document.getElementById("scene-stage");
if (stage) {
  const caption = document.getElementById("scene-caption");
  const descriptions = {
    all: "İdarəetmə, vitrin və sifarişlər bir sistemdə.",
    store: "Hər hesabda öz kataloqunuz və onlayn mağazanız.",
    orders: "Gələn sifarişlər bir paneldən idarə olunur.",
  };
  let scene;
  let selected = "all";
  document.querySelectorAll("[data-scene]").forEach((button) => {
    button.addEventListener("click", () => {
      selected = button.dataset.scene;
      document
        .querySelectorAll("[data-scene]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      caption.textContent = descriptions[selected];
      scene?.select(selected);
    });
  });
  // The content and CSS illustration remain usable if WebGL or loading fails.
  const loadScene = () =>
    import("./src/scene.js")
      .then(({ createScene }) => {
        scene = createScene(stage);
        scene.select(selected);
        const reset = document.querySelector(".scene-reset");
        reset.hidden = false;
        reset.addEventListener("click", () => scene.reset());
      })
      .catch(() => {
        stage.dataset.renderMode = "fallback";
      });
  if ("requestIdleCallback" in window)
    requestIdleCallback(loadScene, { timeout: 900 });
  else setTimeout(loadScene, 100);
}
