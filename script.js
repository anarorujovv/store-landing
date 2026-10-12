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
    all: "İdarəetmə, vitrin və kassa bir sistemdə.",
    store: "Hər hesabda öz kataloqunuz və onlayn mağazanız.",
    pos: "Satış nöqtəniz üçün internetlə işləyən kassa.",
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


const modelContent = {
  trade: { title: "Vitrindən kassaya, eyni mağaza.", description: "Məhsulları onlayn təqdim edin. Gələn sifarişləri, mağazadakı satışları və anbarınızı bir yerdə izləyin.", features: ["Onlayn kataloq və sifariş", "Satış proqramı və çek çapı", "Stok, alış və hesablaşmalar"], cta: "Ticarət mağazamı yarat ↗", icon: "shop" },
  trade_rental: { title: "Həm satın, həm icarəyə verin.", description: "Gəlinlikdən avadanlığa: eyni məhsul satıla da, icarəyə verilə də bilər. İcarə imkanları hesabınızda avtomatik hazırlanır.", features: ["Satış və icarə eyni sənəddə", "Qaytarılma tarixləri və məhsul məsuliyyəti", "Avanslar, ödənişlər və icarə hesabatı"], cta: "Satış və icarə mağazamı yarat ↗", icon: "box" },
  rental: { title: "Avtomobilləriniz üçün onlayn ünvan.", description: "Avtoparkınızı təqdim edin. Rezervasiyaları, icarə müqavilələrini və hesablaşmaları mağazanızın panelindən idarə edin.", features: ["Avtomobil kataloqu", "Rezervasiyalar və müqavilələr", "İcarə və maliyyə hesablaşmaları"], cta: "Rent a car mağazamı yarat ↗", icon: "car" },
};
const modelTabs = [...document.querySelectorAll("[data-store-model]")];
function selectModel(tab) {
  const key = tab.dataset.storeModel, item = modelContent[key];
  modelTabs.forEach(button => { button.setAttribute("aria-selected", String(button === tab)); button.tabIndex = button === tab ? 0 : -1; });
  document.getElementById("model-preview").setAttribute("aria-labelledby", tab.id);
  document.getElementById("model-heading").textContent = item.title;
  document.getElementById("model-description").textContent = item.description;
  document.getElementById("model-symbol").setAttribute("href", `/assets/icons.svg#${item.icon}`);
  document.getElementById("model-features").replaceChildren(...item.features.map(text => { const li = document.createElement("li"); li.textContent = text; return li; }));
  const link = document.getElementById("model-start"); link.textContent = item.cta; link.href = `https://admin.seller.az/auth/register?model=${key}`;
  if (!reducedMotion.matches) document.getElementById("model-preview").animate([{ opacity: .3, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 240, easing: "ease-out" });
}
modelTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectModel(tab));
  tab.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? modelTabs.length - 1 : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + modelTabs.length) % modelTabs.length;
    selectModel(modelTabs[next]); modelTabs[next].focus();
  });
});
