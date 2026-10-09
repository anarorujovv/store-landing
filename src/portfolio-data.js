// Portfolio content is public, editorial data. It never determines tenant identity.
export function safeLink(value, base = "https://seller.az") {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, base);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return null;
    return url.href;
  } catch {
    return null;
  }
}

export function normalizeProjects(data) {
  if (!Array.isArray(data))
    throw new Error("Layihə siyahısı düzgün formatda deyil.");
  return data
    .filter((project) => project && project.published !== false)
    .map((project) => {
      if (
        typeof project.title !== "string" ||
        !project.title.trim() ||
        typeof project.category !== "string" ||
        !project.category.trim()
      ) {
        throw new Error("Layihənin adı və kateqoriyası olmalıdır.");
      }
      return {
        title: project.title.trim(),
        category: project.category.trim(),
        summary:
          typeof project.summary === "string" ? project.summary.trim() : "",
        year:
          typeof project.year === "string" || typeof project.year === "number"
            ? String(project.year)
            : "",
        cover: typeof project.cover === "string" ? project.cover : "",
        coverStyle: ["logo-dark", "logo-light"].includes(project.coverStyle)
          ? project.coverStyle
          : "image",
        coverAlt:
          typeof project.coverAlt === "string"
            ? project.coverAlt
            : project.title,
        url: typeof project.url === "string" ? project.url : "",
        services: Array.isArray(project.services)
          ? project.services.filter((item) => typeof item === "string")
          : [],
      };
    });
}

export function filterProjects(projects, category, search) {
  const query = search.trim().toLocaleLowerCase("az");
  return projects.filter(
    (project) =>
      (!category || project.category === category) &&
      [project.title, project.category, project.summary, ...project.services]
        .join(" ")
        .toLocaleLowerCase("az")
        .includes(query),
  );
}
