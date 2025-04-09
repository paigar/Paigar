let scrollThrottleScheduled = false;
const scrollHeight = document.body.offsetHeight - window.innerHeight;

function setVariables() {
	document.body.style.setProperty("--alturaPantalla", window.innerHeight);
	document.body.style.setProperty(
		"--alturaPrincipal",
		document.getElementById("principal").offsetHeight
	);
	document.body.style.setProperty(
		"--alturaFijo",
		document.getElementById("piefijo").offsetHeight
	);
}

function updateScrollVariable() {
	// Acceder a propiedades del DOM una sola vez
	const scrollPosition = window.pageYOffset;

	// Evitar divisiones problemáticas
	if (scrollHeight > 0) {
		document.body.style.setProperty("--recorrido", scrollPosition);
	}

	scrollThrottleScheduled = false;
}

// Usar requestAnimationFrame para sincronizar con el ciclo de repintado
function onScroll() {
	if (!scrollThrottleScheduled) {
		window.requestAnimationFrame(updateScrollVariable);
		scrollThrottleScheduled = true;
	}
}

window.addEventListener("scroll", onScroll, { passive: true });

// Ejecutar cuando cambia el tamaño de la ventana también
window.addEventListener("resize", onScroll, { passive: true });
window.addEventListener("resize", setVariables, { passive: true });

// Inicializar al cargar
setVariables();
updateScrollVariable();
