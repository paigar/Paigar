import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DateTime } from "luxon";
import markdownItAnchor from "markdown-it-anchor";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import Image from "@11ty/eleventy-img";

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
	});

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 },
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Filtros de fecha
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" })
			.setLocale("es")
			.toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
			"yyyy-LL-dd"
		);
	});

	// Filtros de colecciones
	eleventyConfig.addFilter("ordenarPorFecha", function (collection) {
		return collection.sort((a, b) => {
			return new Date(b.data.date) - new Date(a.data.date);
		});
	});

	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}
		return array.slice(0, n);
	});

	eleventyConfig.addFilter("getAllTags", (collection) => {
		let tagSet = new Set();
		for (let item of collection) {
			(item.data.tags || []).forEach((tag) => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(
			(tag) =>
				["all", "nav", "bitacora", "reflexiones"].indexOf(tag) === -1
		);
	});

	eleventyConfig.addFilter("destacados", function (coleccion) {
		return coleccion.filter((item) => item.data.destacado === true);
	});

	eleventyConfig.addFilter("intro", function (contenido, numPalabras = 100) {
		if (typeof contenido !== "string") return "";
		const palabras = contenido.trim().split(/\s+/);
		return (
			palabras.slice(0, numPalabras).join(" ") +
			(palabras.length > numPalabras ? "..." : "")
		);
	});

	// Filtro para partir títulos en líneas (para imágenes OG en SVG)
	eleventyConfig.addFilter("splitlines", function (input) {
		const parts = input.split(" ");
		const lines = parts.reduce(function (prev, current) {
			if (!prev.length) {
				return [current];
			}
			const lastLine = prev[prev.length - 1];
			if (lastLine.length + 1 + current.length > 36) {
				return [...prev, current];
			}
			prev[prev.length - 1] = lastLine + " " + current;
			return prev;
		}, []);
		return lines;
	});

	// Colección combinada de posts (bitácora + reflexiones)
	eleventyConfig.addCollection("posts", function (collectionApi) {
		return collectionApi
			.getFilteredByTag("bitacora")
			.concat(collectionApi.getFilteredByTag("reflexiones"))
			.sort((a, b) => b.date - a.date);
	});

	// Markdown config
	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1, 2, 3, 4],
			slugify: eleventyConfig.getFilter("slugify"),
		});
	});

	// Shortcodes
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return new Date().toISOString();
	});

	eleventyConfig.addShortcode("currentYear", () => {
		return new Date().getFullYear().toString();
	});

	// Convertir SVG a PNG después del build (imágenes Open Graph)
	eleventyConfig.on("eleventy.after", async () => {
		const ogDir = "_site/og-images/";
		const cachePath = "_site/og-images/.cache.json";

		if (!fs.existsSync(ogDir)) {
			return;
		}

		// Leer caché de hashes anteriores
		let cache = {};
		if (fs.existsSync(cachePath)) {
			try {
				cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
			} catch {
				cache = {};
			}
		}

		const files = fs.readdirSync(ogDir);
		const svgFiles = files.filter((f) => f.endsWith(".svg"));
		let converted = 0;
		const newCache = {};

		for (const filename of svgFiles) {
			const inputPath = path.join(ogDir, filename);
			const outputName = filename.replace(".svg", "");
			const pngPath = path.join(ogDir, `${outputName}.png`);
			const svgContent = fs.readFileSync(inputPath, "utf-8");
			const hash = crypto.createHash("md5").update(svgContent).digest("hex");

			newCache[outputName] = hash;

			// Solo convertir si el contenido ha cambiado o el PNG no existe
			if (fs.existsSync(pngPath) && cache[outputName] === hash) {
				fs.unlinkSync(inputPath);
				continue;
			}

			await Image(inputPath, {
				formats: ["png"],
				widths: [1200],
				outputDir: ogDir,
				filenameFormat: function () {
					return `${outputName}.png`;
				},
			});
			converted++;
		}

		// Eliminar SVG originales
		for (const filename of svgFiles) {
			const svgPath = path.join(ogDir, filename);
			if (fs.existsSync(svgPath)) {
				fs.unlinkSync(svgPath);
			}
		}

		// Guardar caché
		fs.writeFileSync(cachePath, JSON.stringify(newCache, null, 2));

		const cached = svgFiles.length - converted;
		console.log(`[og-images] ${converted} generada(s), ${cached} en caché`);
	});

	return {
		templateFormats: ["njk", "md", "html"],
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "content",
			includes: "../_includes",
			data: "../_data",
			output: "_site",
		},
		pathPrefix: "/",
	};
}
