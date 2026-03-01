// Animaciones de entrada al hacer scroll
document.addEventListener("DOMContentLoaded", () => {
	const reveals = document.querySelectorAll(".reveal, .reveal-stagger");
	if (!reveals.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.01, rootMargin: "0px 0px -20px 0px" }
	);

	reveals.forEach((el) => observer.observe(el));
});
