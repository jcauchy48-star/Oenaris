const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const { sanitizeCsvFormula, formatCsvValue } = require(path.join(root, "src", "shared-helpers.js"));

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function countMatches(source, pattern) {
  return (source.match(pattern) || []).length;
}

assert.equal(sanitizeCsvFormula("=IMPORTXML(...)"), "'=IMPORTXML(...)");
assert.equal(sanitizeCsvFormula("+SUM(A1:A2)"), "'+SUM(A1:A2)");
assert.equal(sanitizeCsvFormula("-10"), "'-10");
assert.equal(sanitizeCsvFormula("@cmd"), "'@cmd");
assert.equal(formatCsvValue('=HYPERLINK("x")'), "\"'=HYPERLINK(\"\"x\"\")\"");

const app = read("app.js");
const landingHtml = read("index.html");
const appHtml = read("app.html");
const authClient = read("src/auth-client.js");
const landingAuth = read("src/landing-auth.js");
const manifest = JSON.parse(read("manifest.webmanifest"));

assert.match(landingHtml, /href="\.\/app\.html"/, "landing page must link to app.html");
assert.match(landingHtml, /id="landingSignUpForm"/, "landing page must include account creation");
assert.match(landingHtml, /id="landingSignUpConfirmation"/, "landing page must confirm the password");
assert.match(landingHtml, /Créer mon compte gratuit/, "landing page must offer free account creation");
assert.match(landingHtml, /Se connecter/, "landing page must offer sign in");
assert.match(landingHtml, /Essayer sans compte/, "landing page must keep local mode visible");
assert.match(landingHtml, /<section class="landing-hero"[\s\S]*Créer mon compte gratuit/, "hero must prioritize account creation");
assert.match(landingHtml, /Retours bêta/, "landing page must include transparent beta feedback");
assert.match(landingHtml, /Prêt à créer votre cave Oenova \?/, "landing page must include the final account CTA");
assert.match(landingHtml, /href="#landingAuthPanel" data-landing-auth-open="signup"/, "signup CTAs must open the account panel");
assert.match(landingHtml, /href="#landingAuthPanel" data-landing-auth-open="signin"/, "signin CTAs must open the account panel");
assert.ok(fs.existsSync(path.join(root, "app.html")), "app.html must remain present");
assert.match(landingHtml, /src="src\/auth-client\.js"/, "landing page must load shared auth");
assert.match(landingHtml, /src="src\/landing-auth\.js"/, "landing page must load landing auth");
assert.match(appHtml, /src="cloud-config-loader\.js"/, "app.html must load cloud config");
assert.match(appHtml, /src="src\/shared-helpers\.js"/, "app.html must load shared helpers");
assert.match(appHtml, /src="src\/auth-client\.js"/, "app.html must load shared auth");
assert.match(appHtml, /src="app\.js"/, "app.html must load the application script");
assert.ok(appHtml.indexOf('src="src/auth-client.js"') < appHtml.indexOf('src="app.js"'), "shared auth must load before app.js");
assert.ok(landingHtml.indexOf('src="src/auth-client.js"') < landingHtml.indexOf('src="src/landing-auth.js"'), "shared auth must load before landing auth");
assert.equal(manifest.start_url, "./app.html", "PWA must start on app.html");

["getCloudConfig", "isCloudConfigured", "loadSupabaseClient", "getSupabaseClient", "signUpWithEmail", "signInWithEmail", "signOut", "getCurrentSession", "onAuthStateChanged"].forEach((functionName) => {
  assert.match(authClient, new RegExp(`function ${functionName}\\(`), `shared auth must define ${functionName}`);
});
assert.match(landingAuth, /Compte créé\. Vérifiez votre email/);
assert.doesNotMatch(authClient, /localStorage\.(setItem|removeItem)/);
assert.doesNotMatch(authClient, /service_role/);

assert.equal(countMatches(app, /function renderSyncStatus\(/g), 1, "renderSyncStatus must be unique");
assert.equal(countMatches(app, /async function syncWineLibrary\(/g), 1, "syncWineLibrary must be unique");
assert.doesNotMatch(app, /authState\.accessToken|authState\.refreshToken/);
assert.doesNotMatch(app, /localStorage\.setItem\([^)]*(accessToken|refreshToken)/);
assert.match(app, /function installRuntimeGuards\(/);
assert.match(app, /function showStartupError\(/);
assert.match(app, /serviceWorker[\s\S]*\.catch\(\(error\) => logError\(error, "serviceWorker\.register"\)\)/);
assert.match(app, /function isScanApiConfigured\(/);
assert.match(app, /IA non configurée/);
assert.match(app, /function hasKnownUserProfile\(/);
assert.match(app, /function hasUsableCloudSession\(/);
assert.match(app, /initialRouteParams\.get\("view"\)/, "app must support direct account views");
assert.match(app, /initialRouteParams\.get\("mode"\)/, "app must support signin and signup routes");

const serviceWorker = read("service-worker.js");
const precacheBlock = serviceWorker.match(/const cachedFiles = \[([\s\S]*?)\];/);
assert.ok(precacheBlock, "service worker must define cachedFiles");
assert.doesNotMatch(precacheBlock[1], /cloud-config\.js/);
assert.match(precacheBlock[1], /\.\/index\.html/, "landing page must be cached");
assert.match(precacheBlock[1], /\.\/app\.html/, "application page must be cached");
assert.match(precacheBlock[1], /\.\/src\/auth-client\.js/, "shared auth must be cached");
assert.match(precacheBlock[1], /\.\/src\/landing-auth\.js/, "landing auth must be cached");
assert.match(serviceWorker, /response\.ok/);
assert.doesNotMatch(serviceWorker, /catch\(\(\) => caches\.match\("\.\/index\.html"\)\)/);

console.log("Oenova verification OK");
