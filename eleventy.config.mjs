import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import pluginBundle from "@11ty/eleventy-plugin-bundle";

export default function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
	});

	eleventyConfig.addBundle("css");
	eleventyConfig.addBundle("js");

	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return new Date().toISOString();
	});
	eleventyConfig.addShortcode("currentYear", () => {
		return new Date().getFullYear();
	});

	return {
		templateFormats: ["njk", "md", "html", "liquid"],
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "src",
			includes: "../_includes",
			data: "../_data",
			output: "_site",
		},
		pathPrefix: "/",
	};
}
