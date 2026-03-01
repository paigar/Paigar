document.addEventListener("DOMContentLoaded", () => {
	const hamburger = document.querySelector(".nav-hamburger");
	const panel = document.getElementById("nav-panel");
	const overlay = document.getElementById("nav-overlay");
	const closeBtn = document.querySelector(".nav-panel__close");

	if (!hamburger || !panel || !overlay) return;

	function openMenu() {
		panel.classList.add("is-open");
		overlay.classList.add("is-open");
		hamburger.classList.add("is-open");
		hamburger.setAttribute("aria-expanded", "true");
		document.body.style.overflow = "hidden";
	}

	function closeMenu() {
		panel.classList.remove("is-open");
		overlay.classList.remove("is-open");
		hamburger.classList.remove("is-open");
		hamburger.setAttribute("aria-expanded", "false");
		document.body.style.overflow = "";
	}

	hamburger.addEventListener("click", () => {
		const isOpen = panel.classList.contains("is-open");
		isOpen ? closeMenu() : openMenu();
	});

	closeBtn.addEventListener("click", closeMenu);
	overlay.addEventListener("click", closeMenu);

	// Close on Escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && panel.classList.contains("is-open")) {
			closeMenu();
		}
	});
});
