import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";

// The canonical page has an explicit filename, so directory-index rewrites
// are unnecessary. Keep the previous URL for existing bookmarks as well.
function portfolioCompatibility() {
  let outDir;
  let isBuild;
  return {
    name: "seller-portfolio-compatibility",
    configResolved(config) {
      outDir = config.build.outDir;
      isBuild = config.command === "build";
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, "http://localhost");
        if (
          ["/portfolio", "/portfolio/", "/portfolio/index.html"].includes(
            url.pathname,
          )
        ) {
          res.writeHead(302, { Location: `/portfolio.html${url.search}` });
          res.end();
        } else next();
      });
    },
    async closeBundle() {
      if (!isBuild) return;
      const html = await readFile(`${outDir}/portfolio.html`, "utf8");
      await mkdir(`${outDir}/portfolio`, { recursive: true });
      await writeFile(`${outDir}/portfolio/index.html`, html);
    },
  };
}

export default defineConfig({
  appType: "mpa",
  plugins: [portfolioCompatibility()],
  build: {
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        portfolio: fileURLToPath(new URL("./portfolio.html", import.meta.url)),
      },
    },
  },
});
