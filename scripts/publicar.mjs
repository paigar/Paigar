import "dotenv/config";
import { execSync } from "child_process";
import { Client } from "basic-ftp";
import { readdirSync, statSync } from "fs";
import { join, relative } from "path";

const SITE_DIR = "_site";

// --- 1. Commit y push a GitHub ---
function gitPush() {
  console.log("\n📦 Subiendo cambios a GitHub...");
  try {
    execSync("git add -A", { stdio: "inherit" });
    const status = execSync("git status --porcelain").toString().trim();
    if (status) {
      execSync('git commit -m "actualización del sitio"', { stdio: "inherit" });
    } else {
      console.log("   Sin cambios que commitear.");
    }
    execSync("git push", { stdio: "inherit" });
    console.log("   GitHub actualizado.");
  } catch (err) {
    console.error("   Error en git:", err.message);
    process.exit(1);
  }
}

// --- 2. Build ---
function build() {
  console.log("\n🔨 Construyendo el sitio...");
  execSync("npx @11ty/eleventy", { stdio: "inherit" });
  console.log("   Build completado.");
}

// --- 3. Subir por FTP a Bunny ---
async function subirFTP() {
  console.log("\n🚀 Subiendo a Bunny Storage por FTP...");
  const client = new Client();

  try {
    await client.access({
      host: process.env.BUNNY_STORAGE_HOSTNAME,
      user: process.env.BUNNY_STORAGE_ZONE_NAME,
      password: process.env.BUNNY_STORAGE_PASSWORD,
      secure: true,
    });

    await subirDirectorio(client, SITE_DIR, "/");
    console.log("   Subida completada.");
  } finally {
    client.close();
  }
}

async function subirDirectorio(client, localDir, remoteDir) {
  const entries = readdirSync(localDir);

  for (const entry of entries) {
    const localPath = join(localDir, entry);
    const remotePath = remoteDir + entry;
    const stat = statSync(localPath);

    if (stat.isDirectory()) {
      await client.ensureDir(remotePath + "/");
      await client.cd("/");
      await subirDirectorio(client, localPath, remotePath + "/");
    } else {
      await client.cd(remoteDir);
      await client.uploadFrom(localPath, entry);
    }
  }
}

// --- 4. Purgar caché de Bunny CDN ---
async function purgarCache() {
  console.log("\n🧹 Purgando caché de Bunny CDN...");
  const url = `https://api.bunny.net/pullzone/${process.env.BUNNY_PULL_ZONE_ID}/purgeCache`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      AccessKey: process.env.BUNNY_API_KEY,
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
  await subirFTP();
  await purgarCache();
  console.log("\n✅ Publicación completada.\n");
} catch (err) {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
}
