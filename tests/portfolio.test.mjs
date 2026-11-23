import test from "node:test";
import assert from "node:assert/strict";
import {
  filterProjects,
  normalizeProjects,
  safeLink,
} from "../src/portfolio-data.js";

const projects = normalizeProjects([
  {
    title: "İpək mağazası",
    category: "Mağaza",
    summary: "Geyim və aksessuar",
    services: ["Store", "Tema"],
    year: 2026,
  },
  {
    title: "Şəhər xidməti",
    category: "Xidmət",
    summary: "Xidmət nümunəsi",
  },
  { title: "Yayımlanmayan layihə", category: "Mağaza", published: false },
]);
test("unpublished projects never appear in the public portfolio", () => {
  assert.equal(projects.length, 2);
  assert.equal(projects[0].year, "2026");
});
test("Azerbaijani search matches case-insensitively across title and services", () => {
  assert.equal(filterProjects(projects, "", "ipək")[0].title, "İpək mağazası");
  assert.equal(filterProjects(projects, "", " Tema ").length, 1);
  assert.equal(filterProjects(projects, "Xidmət", "Tema").length, 0);
});
test("empty and no-results states remain distinct", () => {
  assert.deepEqual(normalizeProjects([]), []);
  assert.deepEqual(filterProjects(projects, "", "tapılmayan"), []);
  assert.equal(filterProjects(projects, "", "").length, 2);
});
test("malformed editorial records reject to a recoverable error state", () => {
  assert.throws(() => normalizeProjects({ projects: [] }));
  assert.throws(() => normalizeProjects([{ title: "Test" }]));
  assert.throws(() => normalizeProjects([{ title: " ", category: "Mağaza" }]));
});
test("unsafe links and credential-bearing URLs never become clickable", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "file:///tmp/file",
    "https://user:secret@example.com",
    "",
    null,
  ]) {
    assert.equal(safeLink(url), null);
  }
  assert.equal(
    safeLink("/portfolio/image.webp"),
    "https://seller.az/portfolio/image.webp",
  );
  assert.equal(
    safeLink("https://example.com/store"),
    "https://example.com/store",
  );
});
test("HTML-looking editorial strings are retained as plain text for textContent", () => {
  const [record] = normalizeProjects([
    {
      title: "<img src=x onerror=alert(1)>",
      category: "Test",
      services: ["Store", null, 42],
    },
  ]);
  assert.equal(record.title, "<img src=x onerror=alert(1)>");
  assert.deepEqual(record.services, ["Store"]);
});
