import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

const packageJson = JSON.parse(read("package.json"));
const forge = read("forge.config.ts");
const main = read("src/main/index.ts");
const companion = read("src/main/integrations/companion-server/index.ts");
const companionApi = read("src/main/integrations/companion-server/api/v1/index.ts");
const auth = read("src/main/integrations/companion-server/api-shared/auth.ts");
const settings = read("src/renderer/windows/settings/Settings.vue");

assert.equal(packageJson.name, "labsuite-music");
assert.equal(packageJson.productName, "YTmusic");
assert.equal(packageJson.license, "GPL-3.0-only");
assert.equal(packageJson.devDependencies.electron, "43.4.0");

assert.match(forge, /executableName:\s*"labsuite-music"/);
assert.match(forge, /schemes:\s*\["labsuite-music"\]/);
assert.match(forge, /publishers:\s*\[\]/);
assert.match(forge, /EnableCookieEncryption\]: true/);
assert.match(forge, /RunAsNode\]: false/);
assert.match(forge, /EnableNodeOptionsEnvironmentVariable\]: false/);
assert.match(forge, /EnableNodeCliInspectArguments\]: false/);
assert.match(forge, /EnableEmbeddedAsarIntegrityValidation\]: true/);
assert.match(forge, /OnlyLoadAppFromAsar\]: true/);

assert.match(companion, /listenIp = "127\.0\.0\.1"/);
assert.doesNotMatch(companion, /0\.0\.0\.0/);
assert.match(companion, /securityProfile: "labsuite-hardened-v1"/);
assert.match(companion, /product: "YTmusic"/);
assert.match(companion, /LOOPBACK_HOST_REQUIRED/);
assert.match(companion, /BROWSER_ORIGIN_REJECTED/);
assert.doesNotMatch(companion, /@fastify\/cors|CORSWildcard|origin:\s*"\*"/);
assert.match(auth, /crypto\.timingSafeEqual/);
assert.ok(
  companionApi.indexOf('fastify.addHook("onClose"') < companionApi.indexOf("fastify.ready().then"),
  "Fastify cleanup hooks must be registered before the server starts listening"
);

assert.doesNotMatch(main, /update\.electronjs\.org|setFeedURL|checkForUpdates\(|quitAndInstall\(/);
assert.doesNotMatch(main, /\bautoUpdater\b/);
assert.match(main, /parsed\.hostname === "pair"/);
assert.match(main, /memoryStore\.set\("companionServerAuthWindowEnabled", true\)/);
assert.match(main, /app\.enableSandbox\(\)/);
assert.match(main, /companionServerEnabled:\s*true/);
assert.match(main, /spyRendererConsole:\s*false/);
assert.match(main, /nodeIntegration:\s*false/);
assert.match(main, /webSecurity:\s*true/);
assert.match(main, /allowRunningInsecureContent:\s*false/);
assert.match(main, /ytmSession\.on\("will-download", event => event\.preventDefault\(\)\)/);
assert.match(main, /permission === "fullscreen"/);
assert.match(main, /parsed\.protocol !== "labsuite-music:"/);
assert.doesNotMatch(settings, /Allow browser communication|companionServerCORSWildcardEnabled/);

console.log("YTmusic hardened security profile verified.");
