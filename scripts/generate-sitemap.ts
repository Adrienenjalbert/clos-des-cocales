// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { COMMUNES } from "../src/data/communes";

const BASE_URL = "https://clos-des-cocales.lovable.app";

interface Entry { path: string; changefreq?: string; priority?: string }

const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/programme", changefreq: "weekly", priority: "0.9" },
  { path: "/outils/simulateur-pret", changefreq: "monthly", priority: "0.7" },
  { path: "/outils/budget-total", changefreq: "monthly", priority: "0.7" },
  { path: "/guide/acheter-terrain-a-batir", changefreq: "monthly", priority: "0.6" },
  { path: "/a-propos", changefreq: "yearly", priority: "0.4" },
  ...COMMUNES.map((c) => ({
    path: `/terrain-a-batir/${c.slug}`,
    changefreq: "weekly",
    priority: "0.8",
  })),
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ].filter(Boolean).join("\n")
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
