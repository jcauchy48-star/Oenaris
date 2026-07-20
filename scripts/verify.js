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
const landingTabs = read("src/landing-tabs.js");
const landingAuth = read("src/landing-auth.js");
const pwaRegister = read("src/pwa-register.js");
const serviceWorker = read("service-worker.js");
const readme = read("README.md");
const wineAdviceFunction = read("supabase/functions/wine-advice/index.ts");
const wineToolsFunction = read("supabase/functions/wine-tools/index.ts");
const supabaseFunctionsWorkflow = read(".github/workflows/supabase-functions.yml");
const manifest = JSON.parse(read("manifest.webmanifest"));

assert.equal(countMatches(landingHtml, /href="\.\/app\.html/g), 1, "only the authenticated download flow may link directly to app.html");
assert.match(landingHtml, /href="\.\/app\.html\?installation=continue" data-continue-to-app/, "app access must be conditional on the download flow");
assert.match(landingHtml, /id="landingSignUpForm"/, "landing page must include account creation");
assert.match(landingHtml, /id="landingSignUpConfirmation"/, "landing page must confirm the password");
assert.match(landingHtml, /Créer mon compte gratuit/, "landing page must offer free account creation");
assert.match(landingHtml, /Se connecter/, "landing page must offer sign in");
assert.match(landingHtml, /Compte requis/, "landing page must state that an account is required");
assert.match(landingHtml, /Oenaris/, "landing page must expose the Oenaris brand");
assert.match(landingHtml, /Votre cave privée,<br>enfin maîtrisée\./, "landing hero must expose the official tagline");
assert.match(landingHtml, /Installer Oenaris/, "landing page must expose the installation path");
assert.doesNotMatch(landingHtml, /Essayer sans compte|Mode local disponible|compte optionnel/i, "public copy must not promise anonymous access");
assert.match(landingHtml, /<section class="landing-hero"[\s\S]*Créer mon compte gratuit/, "hero must prioritize account creation");
assert.match(landingHtml, /Retours bêta/, "landing page must include transparent beta feedback");
assert.match(landingHtml, /Votre cave privée, enfin maîtrisée\./, "landing page must repeat the official tagline");
assert.match(landingHtml, /class="demo-video"/, "landing demo must include the explainer video");
assert.match(landingHtml, /assets\/oenaris-demo-fr\.vtt/, "landing demo must include French captions");
assert.match(landingHtml, /Aperçu illustratif — données fictives/, "landing mockup must identify fictitious data");
assert.match(landingHtml, /Démonstration illustrative\./, "landing video must be identified as illustrative");
assert.ok(fs.statSync(path.join(root, "assets", "oenaris-demo.mp4")).size > 0, "demo video must exist");
assert.ok(fs.statSync(path.join(root, "assets", "oenaris-demo-poster.jpg")).size > 0, "demo poster must exist");
assert.ok(fs.existsSync(path.join(root, "icon.svg")), "PWA icon must exist");
assert.ok(fs.existsSync(path.join(root, "assets", "logo-oenaris.svg")), "main Oenaris logo must exist");
assert.ok(fs.existsSync(path.join(root, "assets", "logo-oenaris-horizontal.svg")), "horizontal Oenaris logo must exist");
assert.ok(fs.existsSync(path.join(root, "assets", "logo-oenaris-icon.svg")), "Oenaris app icon must exist");
assert.doesNotMatch(landingHtml, /Oenova|OENOVA/, "landing must not expose the former brand");
assert.doesNotMatch(appHtml, /Oenova|OENOVA/, "application HTML must not expose the former brand");
assert.doesNotMatch(JSON.stringify(manifest), /Oenova|OENOVA/, "manifest must not expose the former brand");
assert.doesNotMatch(readme, /Oenova|OENOVA/, "README must not expose the former brand");
assert.match(landingHtml, /data-site-tab="accueil"/);
["fonctionnalites", "demo", "tarifs", "securite", "telecharger", "compte"].forEach((tabName) => {
  assert.match(landingHtml, new RegExp(`data-site-tab="${tabName}"`), `landing must expose the ${tabName} tab`);
});
assert.match(landingHtml, /data-site-tab-target="compte" data-landing-auth-open="signup"/, "signup CTAs must open the account tab");
assert.match(landingHtml, /data-site-tab-target="compte" data-landing-auth-open="signin"/, "signin CTAs must open the account tab");
assert.ok(fs.existsSync(path.join(root, "app.html")), "app.html must remain present");
assert.match(landingHtml, /src="src\/auth-client\.js"/, "landing page must load shared auth");
assert.match(landingHtml, /src="src\/landing-tabs\.js"/, "landing page must load tab navigation");
assert.match(landingHtml, /src="src\/landing-auth\.js"/, "landing page must load landing auth");
assert.match(landingHtml, /src="src\/pwa-register\.js\?v=47"/, "landing page must refresh the PWA cache");
assert.match(appHtml, /id="appAccessGate"/, "app.html must provide an access gate");
assert.match(appHtml, /id="appLayout" hidden/, "application UI must start hidden");
assert.match(appHtml, /Oenaris/, "app.html must expose the Oenaris brand");
assert.match(appHtml, /Votre cave privée, enfin maîtrisée\./, "access gate must expose the official tagline");
assert.match(appHtml, /Votre cave est vide/);
assert.match(appHtml, /Scanner une étiquette/);
assert.match(appHtml, /src="cloud-config-loader\.js"/, "app.html must load cloud config");
assert.match(appHtml, /src="src\/shared-helpers\.js"/, "app.html must load shared helpers");
assert.match(appHtml, /src="src\/auth-client\.js"/, "app.html must load shared auth");
assert.match(appHtml, /src="src\/pwa-register\.js\?v=47"/, "app.html must register the shared service worker");
assert.match(appHtml, /src="app\.js\?v=47"/, "app.html must load the application script");
assert.ok(appHtml.indexOf('src="src/auth-client.js"') < appHtml.indexOf('src="app.js?v=47"'), "shared auth must load before app.js");
assert.ok(landingHtml.indexOf('src="src/auth-client.js"') < landingHtml.indexOf('src="src/landing-auth.js"'), "shared auth must load before landing auth");
assert.ok(landingHtml.indexOf('src="src/landing-tabs.js"') < landingHtml.indexOf('src="src/landing-auth.js"'), "tab navigation must load before landing auth");
assert.equal(manifest.start_url, "./app.html", "PWA must start on app.html");
assert.equal(manifest.name, "Oenaris");
assert.equal(manifest.short_name, "Oenaris");
assert.match(pwaRegister, /service-worker\.js\?v=47/, "service worker registration must be cache-busted");
assert.match(serviceWorker, /oenaris-v47/, "service worker cache must be incremented");
assert.doesNotMatch(pwaRegister, /Oenova|OENOVA/, "PWA registration must not expose the former brand");
assert.match(app, /function requestRemoteWineAdvice\(/, "frontend must support the secured wine advice endpoint");
assert.match(app, /wineAdviceApiEnabled === true/, "remote AI must require explicit activation");
assert.match(wineAdviceFunction, /Deno\.env\.get\("OPENAI_API_KEY"\)/, "OpenAI key must come from Supabase secrets");
assert.match(wineAdviceFunction, /\/auth\/v1\/user/, "wine advice endpoint must validate the Supabase session");
assert.match(wineAdviceFunction, /type: "json_schema"/, "wine advice endpoint must use structured outputs");
assert.match(appHtml, /id="aiToolActions"/, "assistant must expose the complementary AI tools");
assert.match(appHtml, /id="tastingAiButton"/, "tasting notes must expose AI assistance");
assert.match(app, /function requestWineTool\(/, "frontend must support the secured wine tools endpoint");
assert.match(app, /wineToolsApiEnabled === true/, "remote wine tools must require explicit activation");
assert.match(wineToolsFunction, /Deno\.env\.get\("OPENAI_API_KEY"\)/, "wine tools must read the OpenAI key from Supabase secrets");
assert.match(wineToolsFunction, /\/auth\/v1\/user/, "wine tools must validate the Supabase session");
assert.match(wineToolsFunction, /"scan-label"/, "wine tools must support label scanning");
assert.match(wineToolsFunction, /"tasting-note"/, "wine tools must support tasting-note assistance");
assert.match(wineToolsFunction, /"quality-audit"/, "wine tools must support data quality audits");
assert.match(wineToolsFunction, /"purchase-plan"/, "wine tools must support purchase suggestions");
assert.match(wineToolsFunction, /"cellar-summary"/, "wine tools must support cellar summaries");
assert.match(wineToolsFunction, /type: "json_schema"/, "wine tools must use structured outputs");
assert.match(supabaseFunctionsWorkflow, /secrets\.SUPABASE_ACCESS_TOKEN/, "Supabase deployment must read its token from GitHub Actions secrets");
assert.match(supabaseFunctionsWorkflow, /functions deploy wine-tools/, "Supabase workflow must deploy complementary wine tools");
assert.doesNotMatch(landingHtml + appHtml + app, /OPENAI_API_KEY/, "frontend must never expose the OpenAI key name or value");

["getCloudConfig", "isCloudConfigured", "loadSupabaseClient", "getSupabaseClient", "signUpWithEmail", "signInWithEmail", "resetPasswordForEmail", "resendConfirmationEmail", "signOut", "getCurrentSession", "onAuthStateChanged"].forEach((functionName) => {
  assert.match(authClient, new RegExp(`function ${functionName}\\(`), `shared auth must define ${functionName}`);
});
assert.match(landingAuth, /Compte créé\. Vérifiez votre email/);
assert.doesNotMatch(landingAuth, /location\.assign\("\.\/app\.html/);
assert.match(authClient, /\.\/index\.html\?tab=compte&mode=signin/);
assert.match(authClient, /\.\/index\.html\?tab=compte&mode=reset/);
assert.match(authClient, /global\.OenarisAuth = Object\.freeze/, "OenarisAuth must be the primary shared auth object");
assert.match(landingTabs, /global\.OenarisLandingTabs = Object\.freeze/, "OenarisLandingTabs must be the primary tab object");
assert.doesNotMatch(app + landingAuth, /OenovaAuth|OenovaLandingTabs/, "application code must use the Oenaris objects");
assert.match(landingTabs, /sessionStorage\.setItem\(INSTALL_FLOW_KEY/);
assert.match(landingTabs, /const INSTALL_FLOW_KEY = "oenaris-install-flow-confirmed"/);
assert.match(app, /const INSTALL_FLOW_KEY = "oenaris-install-flow-confirmed"/);
assert.match(app, /LEGACY_INSTALL_FLOW_KEY/, "legacy install state must remain readable during migration");
assert.match(landingTabs, /function setActiveTab\(/);
assert.doesNotMatch(authClient, /localStorage\.(setItem|removeItem)/);
assert.doesNotMatch(authClient, /service_role/);

assert.equal(countMatches(app, /function renderSyncStatus\(/g), 1, "renderSyncStatus must be unique");
assert.equal(countMatches(app, /async function syncWineLibrary\(/g), 1, "syncWineLibrary must be unique");
assert.doesNotMatch(app, /authState\.accessToken|authState\.refreshToken/);
assert.doesNotMatch(app, /localStorage\.setItem\([^)]*(accessToken|refreshToken)/);
assert.match(app, /function installRuntimeGuards\(/);
assert.match(app, /function showStartupError\(/);
assert.match(app, /oenaris:service-worker-error[\s\S]*logError\(event\.detail, "serviceWorker\.register"\)/);
assert.match(app, /function isScanApiConfigured\(/);
assert.match(app, /IA non configurée/);
assert.match(app, /function hasKnownUserProfile\(/);
assert.match(app, /function hasUsableCloudSession\(/);
assert.match(app, /async function bootstrapApplication\(/);
assert.match(app, /function showAppAccessGate\(/);
assert.match(app, /function hasCompletedInstallFlow\(/);
assert.match(app, /function getUserScopedKey\(/, "user data must use scoped storage keys");
assert.match(app, /`oenaris:\$\{storageScopeUserId\}:\$\{suffix\}`/, "scoped keys must include the Supabase user id");
assert.match(app, /async function offerLegacyDataMigration\(/, "legacy data migration must require a visible decision");
assert.match(appHtml, /id="legacyDataDialog"/, "legacy data migration must have a visible dialog");
assert.match(appHtml, /Importer dans ce compte/);
assert.match(appHtml, /Exporter avant migration/);
assert.match(appHtml, /Ignorer/);
assert.doesNotMatch(app, /scanLimit: 3|bottleLimit: 50|"3 scans IA \/ mois"/, "beta pricing must not promise former limits");
assert.match(app, /name: "Découverte"/);
assert.match(app, /monthlyPrice: "Gratuit pendant la bêta"/);
const loadCellarBlock = app.match(/function loadCellar\(\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.ok(loadCellarBlock, "loadCellar must exist");
assert.doesNotMatch(loadCellarBlock, /sampleWines/, "empty or invalid storage must not inject demo wines");
assert.match(loadCellarBlock, /return \[\]/, "a new cellar must be empty");
assert.match(app, /initialRouteParams\.get\("view"\)/, "app must support direct account views");
assert.match(app, /initialRouteParams\.get\("mode"\)/, "app must support signin and signup routes");

const precacheBlock = serviceWorker.match(/const cachedFiles = \[([\s\S]*?)\];/);
assert.ok(precacheBlock, "service worker must define cachedFiles");
assert.doesNotMatch(precacheBlock[1], /cloud-config\.js/);
assert.match(precacheBlock[1], /\.\/index\.html/, "landing page must be cached");
assert.match(precacheBlock[1], /\.\/app\.html/, "application page must be cached");
["privacy.html", "terms.html", "legal.html", "data-deletion.html"].forEach((legalPage) => {
  assert.ok(fs.existsSync(path.join(root, legalPage)), `${legalPage} must exist`);
  assert.match(precacheBlock[1], new RegExp(`\\.\\/${legalPage}`), `${legalPage} must be cached`);
});
assert.match(precacheBlock[1], /\.\/src\/auth-client\.js/, "shared auth must be cached");
assert.match(precacheBlock[1], /\.\/src\/landing-tabs\.js/, "landing tabs must be cached");
assert.match(precacheBlock[1], /\.\/src\/landing-auth\.js/, "landing auth must be cached");
assert.match(precacheBlock[1], /\.\/src\/pwa-register\.js/, "shared PWA registration must be cached");
assert.match(precacheBlock[1], /\.\/assets\/logo-oenaris\.svg/, "main logo must be cached");
assert.match(precacheBlock[1], /\.\/assets\/logo-oenaris-horizontal\.svg/, "horizontal logo must be cached");
assert.match(precacheBlock[1], /\.\/assets\/logo-oenaris-icon\.svg/, "app icon must be cached");
assert.match(precacheBlock[1], /\.\/assets\/oenaris-dashboard-hero-bg\.jpg/, "dashboard hero background must be cached");
assert.match(precacheBlock[1], /\.\/assets\/oenaris-sidebar-bg\.jpg/, "sidebar background must be cached");
[
  "icon-bottle-premium.png",
  "icon-buy.png",
  "icon-coins.png",
  "icon-drink.png",
  "icon-glass.png",
  "icon-grape.png",
  "icon-low-stock.png",
  "wine-action-panel-bg.webp",
  "wine-card-shell-bg.webp",
  "wine-landscape-divider.webp",
  "wine-note-panel-bg.webp",
  "wine-photo-frame-bg.webp"
].forEach((assetName) => {
  assert.match(precacheBlock[1], new RegExp(`\\.\\/assets\\/${assetName}`), `${assetName} must be cached`);
});
assert.match(serviceWorker, /oenaris-v47/);
assert.match(serviceWorker, /request\.destination === "video"/, "large videos must bypass service worker caching");
assert.match(serviceWorker, /response\.ok/);
assert.doesNotMatch(serviceWorker, /catch\(\(\) => caches\.match\("\.\/index\.html"\)\)/);

console.log("Oenaris verification OK");
