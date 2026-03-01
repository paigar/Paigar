// Abre enlaces externos en una nueva pestaña
document.addEventListener("DOMContentLoaded", () => {
	const links = document.querySelectorAll("a[href^='http']");
	const host = window.location.host;

	links.forEach((link) => {
		if (!link.href.includes(host)) {
			link.setAttribute("target", "_blank");
			link.setAttribute("rel", "noopener noreferrer");
		}
	});
});
