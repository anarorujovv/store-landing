import { test, expect } from "@playwright/test";

const fixture = [
  {
    title: "Nümunə mağaza",
    category: "Ticarət",
    summary: "Yalnız avtomatik test üçün.",
    services: ["Store", "POS"],
    year: 2026,
    url: "https://example.com",
    cover: "/portfolio/missing-test-image.webp",
  },
  {
    title: "İcarə nümunəsi",
    category: "İcarə",
    summary: "Yalnız avtomatik test üçün.",
    url: "javascript:alert(1)",
  },
  { title: "Gizli qaralama", category: "Ticarət", published: false },
];

test("guest landing: WebGL, simple illustrated stories, FAQ and store creation", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#scene-stage")).toHaveAttribute(
    "data-render-mode",
    "webgl",
  );
  await page.getByRole("button", { name: "Mağaza", exact: true }).click();
  await expect(page.locator("#scene-caption")).toContainText(
    "Hər hesabda öz kataloqunuz",
  );
  await page.getByRole("button", { name: "Kassa", exact: true }).click();
  await expect(page.locator("#scene-caption")).toContainText(
    "internetlə işləyən",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Öz onlaynmağazanızıyaradın.",
  );
  await page.locator("#platform").scrollIntoViewIfNeeded();
  await expect(page.locator(".business-story")).toHaveCount(3);
  await expect(
    page.getByRole("heading", { name: "Sifarişlər bir yerdə." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Stok göz önündə." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Hesablar aydındır." }),
  ).toBeVisible();
  await expect(
    page.locator("#platform table, #platform [role=tab]"),
  ).toHaveCount(0);
  await expect(page.locator(".story-art.is-revealed")).toHaveCount(3);
  await expect(
    page.getByRole("link", { name: "Mağazanı yarat", exact: true }).first(),
  ).toHaveAttribute("href", "https://admin.seller.az/auth/register");
  await page
    .getByText("Seller POS internetsiz işləyir?", { exact: true })
    .click();
  await expect(page.getByText(/internet bağlantısı ilə işləyir/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Onlayn mağazanı yarat" }),
  ).toHaveAttribute("href", "https://admin.seller.az/auth/register");
  expect(errors).toEqual([]);
});

test("mobile navigation closes on Escape and navigates to separate portfolio", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menyunu aç" }).click();
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Menyunu aç" })).toBeFocused();
  await expect(page.locator("#mobile-nav")).toBeHidden();
  await page.getByRole("button", { name: "Menyunu aç" }).click();
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Portfolio", exact: true })
    .click();
  await expect(page).toHaveURL(/\/portfolio\.html$/);
  await expect(
    page.getByRole("heading", { name: "Gross Auto", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("portfolio filters, Azerbaijani search, missing image and safe links", async ({
  page,
}, testInfo) => {
  await page.route("**/data/projects.json", (route) =>
    route.fulfill({ json: fixture }),
  );
  await page.goto("/portfolio.html");
  await expect(page.locator(".project-card")).toHaveCount(2);
  await expect(page.getByText("Gizli qaralama")).toHaveCount(0);
  await expect(page.locator(".project-image img")).toHaveCount(0);
  await expect(page.locator(".project-card a")).toHaveCount(1);
  await page.screenshot({
    path: testInfo.outputPath("portfolio-populated.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "İcarə", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.getByRole("searchbox").fill("icarə");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.getByRole("searchbox").fill("tapılmayan");
  await expect(
    page.getByRole("heading", { name: "Uyğun layihə tapılmadı." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Filtrləri təmizlə" }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("portfolio-populated-mobile.png"),
    fullPage: true,
  });
});

test("portfolio network failure can retry to the empty state", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/data/projects.json", (route) =>
    fail
      ? route.fulfill({ status: 503, body: "Unavailable" })
      : route.fulfill({ json: [] }),
  );
  await page.goto("/portfolio.html");
  await expect(
    page.getByRole("heading", { name: "Layihələri yükləmək alınmadı." }),
  ).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Yenidən yoxla" }).click();
  await expect(
    page.getByRole("heading", { name: "Layihələr hazırlanır." }),
  ).toBeVisible();
  await expect(page.locator(".portfolio-tools")).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Layihələr hazırlanır." }),
  ).toBeFocused();
});

test("portfolio communicates pending loading before displaying records", async ({
  page,
}) => {
  let release;
  const pending = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("**/data/projects.json", async (route) => {
    await pending;
    await route.fulfill({ json: fixture });
  });
  await page.goto("/portfolio.html", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Layihələr yüklənir…" }),
  ).toBeVisible();
  await expect(page.locator(".portfolio-state")).toHaveAttribute(
    "aria-busy",
    "true",
  );
  release();
  await expect(page.locator(".project-card")).toHaveCount(2);
});

test("untrusted portfolio text stays text, and malformed data is recoverable", async ({
  page,
}) => {
  await page.route("**/data/projects.json", (route) =>
    route.fulfill({
      json: [
        {
          title: "<img src=x onerror=alert(1)>",
          category: "Test",
          summary: "<script>alert(1)</script>",
        },
      ],
    }),
  );
  await page.goto("/portfolio.html");
  await expect(page.locator(".project-card h2")).toHaveText(
    "<img src=x onerror=alert(1)>",
  );
  await expect(
    page.locator(".project-card h2 img, .project-card script"),
  ).toHaveCount(0);
  await page.unroute("**/data/projects.json");
  await page.route("**/data/projects.json", (route) =>
    route.fulfill({ json: [{ title: "Missing category" }] }),
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Yenidən yoxla" }),
  ).toBeVisible();
});

test("WebGL failure preserves the page and semantic scene selectors", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith("webgl")
        ? null
        : original.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await expect(page.locator("#scene-stage")).toHaveAttribute(
    "data-render-mode",
    "fallback",
  );
  await expect(page.locator(".scene-fallback")).toBeVisible();
  await page.getByRole("button", { name: "Kassa", exact: true }).click();
  await expect(page.locator("#scene-caption")).toContainText(
    "internetlə işləyən",
  );
  await expect(
    page.getByRole("link", { name: "Mağazanı yarat" }).first(),
  ).toBeVisible();
});

test("reduced motion keeps a complete still scene without a perpetual render loop", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = requestAnimationFrame;
    window.__frameCount = 0;
    window.requestAnimationFrame = (callback) =>
      original((time) => {
        window.__frameCount++;
        callback(time);
      });
  });
  await page.goto("/");
  await expect(page.locator("#scene-stage")).toHaveAttribute(
    "data-render-mode",
    "webgl",
  );
  await page.getByRole("button", { name: "Kassa", exact: true }).click();
  await expect(page.locator("#scene-caption")).toContainText(
    "internetlə işləyən",
  );
  const first = await page.evaluate(() => window.__frameCount);
  await page.waitForTimeout(350);
  const last = await page.evaluate(() => window.__frameCount);
  expect(last - first).toBeLessThan(4);
  await page.locator("#platform").scrollIntoViewIfNeeded();
  await expect(page.locator(".story-art.is-revealed")).toHaveCount(0);
  const animations = await page
    .locator(".art-piece")
    .evaluateAll((pieces) =>
      pieces.map((piece) => getComputedStyle(piece).animationName),
    );
  expect(animations.every((name) => name === "none")).toBe(true);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("responsive layouts, 200% text zoom and every public anchor stay usable", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/portfolio.html"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
      if (path === "/" && width <= 900) {
        const benefits = await page.locator(".store-benefits").boundingBox();
        const preview = await page.locator(".store-preview").boundingBox();
        expect(preview.y).toBeGreaterThan(benefits.y + benefits.height);
      }
      const broken = await page.evaluate(() =>
        [...document.querySelectorAll('a[href^="#"], a[href^="/#"]')]
          .filter(
            (link) =>
              new URL(link.href).pathname === location.pathname &&
              !document.getElementById(new URL(link.href).hash.slice(1)),
          )
          .map((link) => link.getAttribute("href")),
      );
      expect(broken).toEqual([]);
    }
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/");
  await page.locator("body").evaluate((body) => {
    body.style.zoom = "2";
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("without JavaScript the core landing and portfolio explanation remain visible", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".scene-fallback")).toBeVisible();
  await page.goto(`${baseURL}/portfolio.html`);
  await expect(
    page.getByText("Layihə siyahısını görmək üçün JavaScript-i aktivləşdirin."),
  ).toBeVisible();
  await context.close();
});

test("portfolio navigation and direct legacy URLs survive reload", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "Portfolio", exact: true })
    .click();
  await expect(page).toHaveURL(/\/portfolio\.html$/);
  await expect(
    page.getByRole("heading", { name: "Gross Auto", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Gross Auto loqosu" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Gross Auto — layihəyə bax (yeni pəncərə)",
    }),
  ).toHaveAttribute("href", "https://grossauto.az/");
  for (const path of [
    "/portfolio.html",
    "/portfolio",
    "/portfolio/",
    "/portfolio/index.html",
  ]) {
    const response = await page.goto(`${path}?source=route-check`);
    expect(response.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "Gross Auto", exact: true }),
    ).toBeVisible();
    expect(new URL(page.url()).searchParams.get("source")).toBe("route-check");
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Gross Auto", exact: true }),
    ).toBeVisible();
  }
});


test("business model preview carries an explicit choice into registration", async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Satış və İcarə', exact: true }).click();
  await expect(page.locator('#model-start')).toHaveAttribute('href', 'https://admin.seller.az/auth/register?model=trade');
  await expect(page.locator('#model-preview')).toHaveAttribute('aria-labelledby', 'model-trade_rental');
  await page.getByRole('tab', { name: 'Satış və İcarə', exact: true }).press('ArrowDown');
  await expect(page.getByRole('tab', { name: 'Rent a car', exact: true })).toBeFocused();
  await expect(page.locator('#model-start')).toHaveAttribute('href', /model=rental$/);
  await page.locator('#business-models').scrollIntoViewIfNeeded();
  await page.screenshot({ animations: 'disabled', path: info.outputPath('store-models-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('tab', { name: 'Ticarət', exact: true }).click();
  await expect(page.locator('#model-start')).toHaveAttribute('href', /model=trade$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ animations: 'disabled', path: info.outputPath('store-models-mobile.png'), fullPage: true });
  await expect(page.locator('a[href$="setup=akul"]')).toBeVisible();
});


test("theme library and blue actions", async ({ page }) => {
  await page.goto('/');
  const themes=page.locator('#themes');
  for(const name of ['Editorial','Beauty','Electro']) await expect(themes.getByRole('heading',{name})).toBeVisible();
  await expect(themes.getByText(/illüstrasiyalardır/)).toBeVisible();
  await expect(themes.getByRole('link',{name:'Mağazanı yarat'})).toHaveAttribute('href','https://admin.seller.az/auth/register');
  const primary=page.locator('.hero-actions .button');
  await expect(primary).toHaveCSS('background-color','rgb(37, 99, 235)');
  await expect(primary).toHaveCSS('color','rgb(255, 255, 255)');
  await primary.hover();await expect(primary).toHaveCSS('background-color','rgb(29, 78, 216)');
  await page.getByRole('tab',{name:'Satış və İcarə'}).click();
  await expect(page.locator('#model-description')).toContainText('sonradan aktivləşdirin');
  await expect(page.getByRole('tab',{name:'Satış və İcarə'})).toHaveCSS('background-color','rgb(239, 246, 255)');
  await page.setViewportSize({width:390,height:844});
  await expect(themes.getByRole('heading',{name:'Electro'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
