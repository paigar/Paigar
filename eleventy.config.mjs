import { DateTime } from "luxon";
import markdownItAnchor from "markdown-it-anchor";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

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
