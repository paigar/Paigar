import lume from "lume/mod.ts";
import sitemap from "lume/plugins/sitemap.ts";
import feed from "lume/plugins/feed.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import postcss from "lume/plugins/postcss.ts";
import inline from "lume/plugins/inline.ts";
import markdownItAnchor from "npm:markdown-it-anchor@8.6.7";
import { render as renderSvgToPng } from "https://deno.land/x/resvg_wasm@0.2.0/mod.ts";

const site = lume({
  src: "./src",
  location: new URL("https://www.paigar.es"),
});

// -- Plugins (Vento es el motor de plantillas por defecto en Lume) --
site.use(slugifyUrls());
site.use(postcss());
site.use(inline());
site.use(sitemap());
site.use(minifyHTML());

// Markdown-it: anchors en headings
site.hooks.addMarkdownItPlugin(markdownItAnchor, {
  permalink: markdownItAnchor.permalink.ariaHidden({
    placement: "after",
    class: "header-anchor",
    symbol: "#",
    ariaHidden: false,
  }),
  level: [1, 2, 3, 4],
});

// Feed (RSS + JSON Feed)
site.use(feed({
  output: ["/feed/feed.xml", "/feed/feed.json"],
  query: "bitacora",
  sort: "date=desc",
  limit: 20,
  info: {
    title: "Paigar",
    description:
      "Web personal de Juanjo Marcos — desarrollo web, código y reflexiones.",
    lang: "es",
    generator: false,
  },
  items: {
    title: "=title",
    description: "=description",
    published: "=date",
    content: "=children",
  },
}));

// -- Preprocessor: añadir tag de sección a posts markdown --
site.preprocess([".md"], (pages) => {
  for (const page of pages) {
    const path = page.src.path;
    if (path.startsWith("/bitacora/")) {
      page.data.tags = [...(page.data.tags || []), "bitacora"];
    } else if (path.startsWith("/reflexiones/")) {
      page.data.tags = [...(page.data.tags || []), "reflexiones"];
    }
  }
});

// -- Static files --
site.copy("public", ".");
site.ignore("public");

// -- Custom filters --

site.filter("readableDate", (dateObj: Date | string) => {
  const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
});

site.filter("htmlDateString", (dateObj: Date | string) => {
  const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
  return date.toISOString().split("T")[0];
});

site.filter("ordenarPorFecha", (collection: any[]) => {
  if (!Array.isArray(collection)) return [];
  return [...collection].sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB.getTime() - dateA.getTime();
  });
});

site.filter("head", (array: any[], n: number) => {
  if (!Array.isArray(array) || array.length === 0) return [];
  if (n < 0) return array.slice(n);
  return array.slice(0, n);
});

site.filter("filterTagList", (tags: string[]) => {
  return (tags || []).filter(
    (tag) => !["bitacora", "reflexiones"].includes(tag),
  );
});

site.filter("destacados", (coleccion: any[]) => {
  return (coleccion || []).filter((item) => item.destacado === true);
});

site.filter("intro", (contenido: string, numPalabras = 100) => {
  if (typeof contenido !== "string") return "";
  const palabras = contenido.trim().split(/\s+/);
  return (
    palabras.slice(0, numPalabras).join(" ") +
    (palabras.length > numPalabras ? "..." : "")
  );
});

site.filter("readingTime", (content: string) => {
  if (!content) return "";
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
});

site.filter("startsWith", (str: string, prefix: string) => {
  return str && str.startsWith(prefix);
});

site.filter("currentYear", () => new Date().getFullYear().toString());
site.filter("currentBuildDate", () => new Date().toISOString());

site.filter("slugify", (str: string) => {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
});

// -- Syntax highlighting con PrismJS --
import Prism from "npm:prismjs@1.29.0";
import "npm:prismjs@1.29.0/components/prism-javascript.js";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-css.js";
import "npm:prismjs@1.29.0/components/prism-markup.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-json.js";
import "npm:prismjs@1.29.0/components/prism-yaml.js";
import "npm:prismjs@1.29.0/components/prism-markdown.js";

site.hooks.addMarkdownItPlugin((md: any) => {
  const defaultFence =
    md.renderer.rules.fence ||
    function (
      tokens: any, idx: number, options: any, _env: any, self: any,
    ) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.fence = function (
    tokens: any, idx: number, options: any, env: any, self: any,
  ) {
    const token = tokens[idx];
    const lang = token.info.trim();
    const code = token.content;

    if (lang && Prism.languages[lang]) {
      const highlighted = Prism.highlight(code, Prism.languages[lang], lang);
      return `<pre class="language-${lang}" tabindex="0"><code class="language-${lang}">${highlighted}</code></pre>\n`;
    }

    if (lang) {
      return `<pre class="language-${lang}" tabindex="0"><code class="language-${lang}">${md.utils.escapeHtml(code)}</code></pre>\n`;
    }

    return defaultFence(tokens, idx, options, env, self);
  };
});

// -- Conversión SVG → PNG para imágenes Open Graph --
site.addEventListener("afterBuild", async () => {
  const ogDir = site.dest() + "/og-images";

  try {
    const entries = [...Deno.readDirSync(ogDir)];
    const svgFiles = entries.filter((e) => e.name.endsWith(".svg"));

    if (svgFiles.length === 0) return;

    let converted = 0;
    for (const entry of svgFiles) {
      const svgPath = `${ogDir}/${entry.name}`;
      const pngPath = svgPath.replace(".svg", ".png");
      const svgContent = await Deno.readTextFile(svgPath);

      const pngBuffer = await renderSvgToPng(svgContent);
      await Deno.writeFile(pngPath, pngBuffer);
      await Deno.remove(svgPath);
      converted++;
    }

    console.log(`[og-images] ${converted} SVG convertidos a PNG`);
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      console.error("[og-images] Error:", err);
    }
  }
});

export default site;
