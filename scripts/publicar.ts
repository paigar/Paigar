import "jsr:@std/dotenv@0.225/load";
import { walk } from "jsr:@std/fs@1/walk";
import { relative } from "jsr:@std/path@1";

const SITE_DIR = "_site";

// --- 1. Commit y push a GitHub ---
function ejecutar(cmd: string, args: string[], hereda = true): string {
  const resultado = new Deno.Command(cmd, {
    args,
    stdout: hereda ? "inherit" : "piped",
    stderr: "inherit",
  }).outputSync();

  if (!hereda) {
    return new TextDecoder().decode(resultado.stdout).trim();
  }
  if (!resultado.success) {
    throw new Error(`Comando fallido: ${cmd} ${args.join(" ")}`);
  }
  return "";
}

function preguntar(texto: string): string {
  const buf = new Uint8Array(1024);
  Deno.stdout.writeSync(new TextEncoder().encode(texto));
  const n = Deno.stdin.readSync(buf);
  return new TextDecoder().decode(buf.subarray(0, n ?? 0)).trim();
}

function gitPush() {
  console.log("\n📦 Subiendo cambios a GitHub...");
  try {
    ejecutar("git", ["add", "-A"]);
    const status = ejecutar("git", ["status", "--porcelain"], false);
    if (status) {
      const mensaje = preguntar("   Mensaje del commit: ") || "actualización del sitio";
      ejecutar("git", ["commit", "-m", mensaje]);
    } else {
      console.log("   Sin cambios que commitear.");
    }
    ejecutar("git", ["push"]);
    console.log("   GitHub actualizado.");
  } catch (err) {
    console.error("   Error en git:", (err as Error).message);
    Deno.exit(1);
  }
}

// --- 2. Build ---
function build() {
  console.log("\n🔨 Construyendo el sitio...");
  try {
    Deno.removeSync(SITE_DIR, { recursive: true });
  } catch { /* no existe, ok */ }
  ejecutar("deno", ["task", "build"]);
  console.log("   Build completado.");
}

// --- 3. Subir a Bunny Storage (API HTTP) ---
async function listarFicheros(dir: string): Promise<{ localPath: string; remotePath: string }[]> {
  const ficheros: { localPath: string; remotePath: string }[] = [];
  for await (const entry of walk(dir, { includeFiles: true, includeDirs: false })) {
    const remotePath = relative(dir, entry.path).replaceAll("\\", "/");
    ficheros.push({ localPath: entry.path, remotePath });
  }
  return ficheros;
}

async function subirAPI() {
  const hostname = Deno.env.get("BUNNY_STORAGE_HOSTNAME");
  const zone = Deno.env.get("BUNNY_STORAGE_ZONE_NAME");
  const password = Deno.env.get("BUNNY_STORAGE_PASSWORD");
  const baseUrl = `https://${hostname}/${zone}`;
  const ficheros = await listarFicheros(SITE_DIR);

  console.log(`\n🚀 Subiendo ${ficheros.length} ficheros a Bunny Storage...`);

  let subidos = 0;
  for (const { localPath, remotePath } of ficheros) {
    const url = `${baseUrl}/${remotePath}`;
    const body = await Deno.readFile(localPath);
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        AccessKey: password!,
        "Content-Type": "application/octet-stream",
      },
      body,
    });

    if (!res.ok) {
      throw new Error(`Error subiendo ${remotePath}: ${res.status} ${res.statusText}`);
    }
    subidos++;
    const encoder = new TextEncoder();
    Deno.stdout.writeSync(encoder.encode(`\r   ${subidos}/${ficheros.length} ficheros subidos`));
  }
  console.log("\n   Subida completada.");
}

// --- 4. Purgar caché de Bunny CDN ---
async function purgarCache() {
  console.log("\n🧹 Purgando caché de Bunny CDN...");
  const pullZoneId = Deno.env.get("BUNNY_PULL_ZONE_ID");
  const apiKey = Deno.env.get("BUNNY_API_KEY");
  const url = `https://api.bunny.net/pullzone/${pullZoneId}/purgeCache`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      AccessKey: apiKey!,
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    console.log("   Caché purgada.");
  } else {
    console.error(`   Error al purgar: ${res.status} ${res.statusText}`);
  }
}

// --- Ejecutar todo ---
try {
  gitPush();
  build();
  await subirAPI();
  await purgarCache();
  console.log("\n✅ Publicación completada.\n");
} catch (err) {
  console.error("\n❌ Error:", (err as Error).message);
  Deno.exit(1);
}
