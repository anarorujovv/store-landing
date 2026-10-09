import { readFile, writeFile, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const data = JSON.parse(
  await readFile(
    new URL("node_modules/@iconify-json/solar/icons.json", root),
    "utf8",
  ),
);
const info = JSON.parse(
  await readFile(
    new URL("node_modules/@iconify-json/solar/info.json", root),
    "utf8",
  ),
);
const names = [
  "arrow-right-up",
  "arrow-down",
  "arrow-left",
  "arrow-left-down",
  "restart",
  "shop",
  "layers",
  "hamburger-menu",
  "close",
  "magnifer",
  "car",
  "box",
  "check-circle",
  "bill-check",
  "wallet-money",
  "bag-check",
  "add-circle",
  "minus-circle",
  "palette",
  "globus",
  "gallery-wide",
  "cart-large",
];
const symbols = names.map((name) => {
  const icon = data.icons[`${name}-bold-duotone`];
  if (!icon) throw new Error(`Missing Solar icon: ${name}`);
  return `<symbol id="${name}" viewBox="0 0 ${icon.width || data.width} ${icon.height || data.height}">${icon.body}</symbol>`;
});
await mkdir(new URL("public/assets/", root), { recursive: true });
await writeFile(
  new URL("public/assets/icons.svg", root),
  `<svg xmlns="http://www.w3.org/2000/svg">\n<!-- Solar Bold Duotone by 480 Design, CC BY 4.0. See icons-LICENSE.txt. -->\n${symbols.join("\n")}\n</svg>\n`,
);
await writeFile(
  new URL("public/assets/icons-LICENSE.txt", root),
  `Solar Bold Duotone icons\nAuthor: ${info.author?.name || "480 Design"}\nSource: ${info.author?.url || "https://www.figma.com/@480design"}\nDistributed via https://github.com/iconify/icon-sets/tree/master/json/solar.json\nLicense: Creative Commons Attribution 4.0 International (CC BY 4.0)\nhttps://creativecommons.org/licenses/by/4.0/\nModification: selected original paths packaged as an SVG symbol sprite; colors inherit the interface color.\n`,
);
