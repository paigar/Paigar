// Toggle de tema — se carga inline en el <head> para evitar FOUC
// Este archivo contiene solo la lógica del botón toggle

document.addEventListener("DOMContentLoaded", () => {
	const toggles = document.querySelectorAll(".theme-toggle");

	toggles.forEach((toggle) => {
		toggle.addEventListener("click", () => {
			const current =
				document.documentElement.getAttribute("data-theme");
			const next = current === "dark" ? "light" : "dark";
			document.documentElement.setAttribute("data-theme", next);
			localStorage.setItem("theme", next);

			// Actualizar el texto del botón
			toggles.forEach((t) => {
				t.textContent = next === "dark" ? "☀" : "☾";
				t.setAttribute(
					"aria-label",
					next === "dark"
						? "Cambiar a tema claro"
						: "Cambiar a tema oscuro"
				);
			});
		});
	});
});
