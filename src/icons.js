// Static and dynamically rendered controls share the same bundled Solar sprite.
export function createIcon(name) {
  const ns = "http://www.w3.org/2000/svg";
  const icon = document.createElementNS(ns, "svg");
  icon.setAttribute("class", "icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("width", "24");
  icon.setAttribute("height", "24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("focusable", "false");
  const use = document.createElementNS(ns, "use");
  use.setAttribute("href", `/assets/icons.svg#${name}`);
  icon.append(use);
  return icon;
}
