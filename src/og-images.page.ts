export default function* ({ search }: Lume.Data) {
  const posts = [
    ...search.pages("type=bitacora"),
    ...search.pages("type=reflexiones"),
  ];

  for (const post of posts) {
    const title = post.title as string;
    const type = post.type as string;

    // Partir el título en líneas de máximo 36 caracteres
    const parts = title.split(" ");
    const titleLines: string[] = parts.reduce(
      (prev: string[], current: string) => {
        if (!prev.length) return [current];
        const lastLine = prev[prev.length - 1];
        if (lastLine.length + 1 + current.length > 36) {
          return [...prev, current];
        }
        prev[prev.length - 1] = lastLine + " " + current;
        return prev;
      },
      [],
    );

    const lineCount = titleLines.length;
    let titleY: number;
    if (lineCount === 1) titleY = 310;
    else if (lineCount === 2) titleY = 280;
    else if (lineCount === 3) titleY = 240;
    else titleY = 200;

    const seccion = type === "bitacora" ? "BITACORA" : "REFLEXIONES";

    // Extraer el slug de la URL del post
    const urlParts = (post.url as string).split("/").filter(Boolean);
    const slug = urlParts[urlParts.length - 1];

    const tspans = titleLines
      .map(
        (line: string, i: number) =>
          `    <tspan x="80" y="${titleY + i * 62}">${escapeXml(line)}</tspan>`,
      )
      .join("\n");

    const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">

  <!-- Fondo -->
  <rect width="1200" height="630" fill="#111118"/>

  <!-- Barra naranja lateral -->
  <rect x="0" y="0" width="8" height="630" fill="#f86624"/>

  <!-- Seccion -->
  <text x="80" y="${titleY - 60}" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#f86624" letter-spacing="3">${seccion}</text>

  <!-- Titulo -->
  <text font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#dcdcd4">
${tspans}
  </text>

  <!-- Linea separadora -->
  <line x1="80" y1="530" x2="1120" y2="530" stroke="#2a2a3a" stroke-width="1"/>

  <!-- Branding -->
  <text x="80" y="575" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#8e8e86">paigar.es</text>

  <!-- Punto naranja -->
  <circle cx="1120" cy="568" r="6" fill="#f86624"/>

</svg>`;

    yield {
      url: `/og-images/${slug}.svg`,
      content: svg,
    };
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
