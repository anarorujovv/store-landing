import {
  normalizeProjects,
  filterProjects,
  safeLink,
} from "./portfolio-data.js";
import { createIcon } from "./icons.js";

document.querySelector("[data-script-notice]").hidden = true;

const grid = document.querySelector(".portfolio-grid");
const state = document.querySelector(".portfolio-state");
const tools = document.querySelector(".portfolio-tools");
const filters = document.querySelector(".portfolio-filters");
const search = document.querySelector(".portfolio-search input");
const count = document.querySelector(".portfolio-count");
let projects = [];
let category = "";

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function showState(title, description, action) {
  state.replaceChildren(
    element("h2", "", title),
    element("p", "", description),
  );
  if (action) state.append(action);
  state.hidden = false;
}
function renderCard(project) {
  const card = element("article", "project-card");
  const cover = element("div", "project-image");
  if (["logo-dark", "logo-light"].includes(project.coverStyle))
    cover.classList.add(`project-image--${project.coverStyle}`);
  const initials = project.title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  const placeholder = element("span", "project-cover-fallback", initials);
  placeholder.setAttribute("aria-hidden", "true");
  cover.append(placeholder);
  const imageUrl = safeLink(project.cover, window.location.origin);
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = project.coverAlt;
    img.loading = "lazy";
    img.width = 1200;
    img.height = 800;
    img.addEventListener("error", () => img.remove(), { once: true });
    cover.append(img);
  }
  card.append(cover);
  const meta = element("div", "project-meta");
  meta.append(
    element("span", "", project.category),
    element("span", "", project.year),
  );
  card.append(
    meta,
    element("h2", "", project.title),
    element("p", "", project.summary),
  );
  if (project.services.length) {
    const services = element("ul", "project-services");
    services.setAttribute("aria-label", "Layihədə tətbiq olunan həllər");
    project.services.forEach((service) =>
      services.append(element("li", "", service)),
    );
    card.append(services);
  }
  const url = safeLink(project.url, window.location.origin);
  if (url) {
    const link = element("a", "text-link", "Layihəyə bax ");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute(
      "aria-label",
      `${project.title} — layihəyə bax (yeni pəncərə)`,
    );
    link.append(createIcon("arrow-right-up"));
    card.append(link);
  }
  return card;
}
function render() {
  const visible = filterProjects(projects, category, search.value);
  grid.replaceChildren(...visible.map(renderCard));
  count.textContent = projects.length ? `${visible.length} layihə` : "";
  state.hidden = visible.length > 0;
  if (!visible.length && projects.length) {
    const clear = element(
      "button",
      "button button-outline portfolio-clear",
      "Filtrləri təmizlə",
    );
    clear.type = "button";
    clear.addEventListener("click", () => {
      category = "";
      search.value = "";
      updateFilters();
      render();
      search.focus();
    });
    showState(
      "Uyğun layihə tapılmadı.",
      "Başqa ad axtarın və ya filtrləri təmizləyin.",
      clear,
    );
  }
}
function updateFilters() {
  filters
    .querySelectorAll("button")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === category),
      ),
    );
}
async function load(restoreFocus = false) {
  showState("Layihələr yüklənir…", "Portfolio bir azdan görünəcək.");
  state.setAttribute("aria-busy", "true");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch("/data/projects.json", {
      cache: "no-cache",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Portfolio yüklənmədi.");
    projects = normalizeProjects(await response.json());
    category = "";
    search.value = "";
    filters.replaceChildren();
    tools.hidden = projects.length === 0;
    if (projects.length) {
      ["", ...new Set(projects.map((project) => project.category))].forEach(
        (value) => {
          const button = element("button", "", value || "Hamısı");
          button.type = "button";
          button.dataset.category = value;
          button.setAttribute("aria-pressed", String(value === category));
          button.addEventListener("click", () => {
            category = value;
            updateFilters();
            render();
          });
          filters.append(button);
        },
      );
      render();
    } else {
      grid.replaceChildren();
      count.textContent = "";
      // Reuse the server-rendered empty state, including after an error retry.
      state.replaceChildren(...emptyState.map((node) => node.cloneNode(true)));
      state.hidden = false;
    }
  } catch {
    grid.replaceChildren();
    tools.hidden = true;
    count.textContent = "";
    const retry = element(
      "button",
      "button button-outline portfolio-retry",
      "Yenidən yoxla",
    );
    retry.type = "button";
    retry.addEventListener("click", () => {
      retry.disabled = true;
      retry.textContent = "Yüklənir…";
      load(true);
    });
    showState(
      "Layihələri yükləmək alınmadı.",
      "Bağlantını yoxlayıb yenidən cəhd edin.",
      retry,
    );
  } finally {
    clearTimeout(timeout);
    state.removeAttribute("aria-busy");
    if (restoreFocus) {
      if (state.hidden) search.focus();
      else {
        const heading = state.querySelector("h2");
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  }
}
const emptyState = [...state.childNodes].map((node) => node.cloneNode(true));
search.addEventListener("input", render);
load();
