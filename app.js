// Constantes
const STORAGE_KEY = "mini-cave-a-vin";
const MOVEMENTS_KEY = "mini-cave-a-vin-movements";
const WISHLIST_KEY = "mini-cave-a-vin-wishlist";
const TASTING_NOTES_KEY = "mini-cave-a-vin-tasting-notes";
const ERROR_LOGS_KEY = "mini-cave-a-vin-error-logs";
const BACKUP_KEY = "mini-cave-a-vin-last-backup";
const MODIFICATION_COUNT_KEY = "mini-cave-a-vin-modification-count";
const APP_VERSION = "beta 0.1.0";
const SCHEMA_VERSION = 3;
const PHOTO_WARNING_BYTES = 900000;
const currentYear = new Date().getFullYear();

const COLORS = ["Rouge", "Blanc", "Rose", "Effervescent", "Liquoreux"];
const STATUSES = ["en cave", "bu", "vendu", "offert", "reserve"];
const FORMATS = ["37.5cl", "75cl", "Magnum", "Jeroboam", "autre"];
const SUPPLIERS = ["", "caviste", "domaine", "grande distribution", "encheres", "autre"];
const CSV_COLUMNS = [
  "domain", "cuvee", "color", "region", "appellation", "vintage", "quantity",
  "format", "status", "price", "purchasePrice", "estimatedValue", "drinkFrom",
  "drinkTo", "cellarName", "rack", "row", "column", "location", "tags",
  "favorite", "rating", "purchaseDate", "supplier", "consumedAt", "notes"
];

const sampleWines = [
  {
    domain: "Domaine Leflaive",
    cuvee: "Bourgogne Blanc",
    color: "Blanc",
    region: "Bourgogne",
    appellation: "Bourgogne",
    vintage: 2020,
    quantity: 4,
    price: 44,
    purchasePrice: 44,
    estimatedValue: 52,
    drinkFrom: 2024,
    drinkTo: 2028,
    cellarName: "Cave principale",
    rack: "A1",
    row: "1",
    column: "4",
    location: "Casier A1",
    tags: ["garde", "blanc"],
    notes: "A garder pour poissons nobles, volailles cremees ou fromages affines."
  },
  {
    domain: "Chateau Poujeaux",
    cuvee: "Grand vin",
    color: "Rouge",
    region: "Bordeaux",
    appellation: "Moulis-en-Medoc",
    vintage: 2016,
    quantity: 6,
    price: 32,
    purchasePrice: 32,
    estimatedValue: 40,
    drinkFrom: 2022,
    drinkTo: 2032,
    cellarName: "Cave principale",
    rack: "C2",
    row: "2",
    column: "1",
    location: "Casier C2",
    tags: ["repas", "rouge"],
    notes: "Structure encore presente, parfait avec une cote de boeuf."
  },
  {
    domain: "Champagne Billecart-Salmon",
    cuvee: "Brut Reserve",
    color: "Effervescent",
    region: "Champagne",
    appellation: "Champagne",
    vintage: 0,
    quantity: 3,
    price: 49,
    purchasePrice: 49,
    estimatedValue: 49,
    drinkFrom: currentYear,
    drinkTo: currentYear + 2,
    cellarName: "Armoire de service",
    rack: "Haut",
    row: "",
    column: "",
    location: "Haut de cave",
    tags: ["aperitif"],
    notes: "Bouteilles pretes pour aperitif ou grande occasion improvisee."
  }
].map(normalizeWine);

// Etat
let wines = loadCellar();
let movements = loadMovements();
let wishlist = loadWishlist();
let tastingNotes = loadTastingNotes();
let errorLogs = loadErrorLogs();
let modificationsSinceBackup = toNumber(localStorage.getItem(MODIFICATION_COUNT_KEY), 0);
let deferredInstallPrompt = null;
let pendingConfirm = null;
let lastUndo = null;

// Selection DOM
const elements = {
  dialog: document.querySelector("#wineDialog"),
  form: document.querySelector("#wineForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  wineId: document.querySelector("#wineId"),
  openFormButton: document.querySelector("#openFormButton"),
  closeDialogButton: document.querySelector("#closeDialogButton"),
  deleteButton: document.querySelector("#deleteButton"),
  markConsumedFormButton: document.querySelector("#markConsumedFormButton"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  exportCsvButton: document.querySelector("#exportCsvButton"),
  importCsvButton: document.querySelector("#importCsvButton"),
  printButton: document.querySelector("#printButton"),
  importFileInput: document.querySelector("#importFileInput"),
  importCsvFileInput: document.querySelector("#importCsvFileInput"),
  installButton: document.querySelector("#installButton"),
  searchInput: document.querySelector("#searchInput"),
  colorFilter: document.querySelector("#colorFilter"),
  regionFilter: document.querySelector("#regionFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  drinkFilter: document.querySelector("#drinkFilter"),
  cellarFilter: document.querySelector("#cellarFilter"),
  rackFilter: document.querySelector("#rackFilter"),
  tagFilter: document.querySelector("#tagFilter"),
  favoriteFilter: document.querySelector("#favoriteFilter"),
  stockFilter: document.querySelector("#stockFilter"),
  vintageMinFilter: document.querySelector("#vintageMinFilter"),
  vintageMaxFilter: document.querySelector("#vintageMaxFilter"),
  priceMinFilter: document.querySelector("#priceMinFilter"),
  priceMaxFilter: document.querySelector("#priceMaxFilter"),
  valueMinFilter: document.querySelector("#valueMinFilter"),
  valueMaxFilter: document.querySelector("#valueMaxFilter"),
  resetFiltersButton: document.querySelector("#resetFiltersButton"),
  emptyAddButton: document.querySelector("#emptyAddButton"),
  sortSelect: document.querySelector("#sortSelect"),
  wineList: document.querySelector("#wineList"),
  watchList: document.querySelector("#watchList"),
  movementList: document.querySelector("#movementList"),
  wishlistList: document.querySelector("#wishlistList"),
  emptyState: document.querySelector("#emptyState"),
  resultCount: document.querySelector("#resultCount"),
  compactStats: document.querySelector("#compactStats"),
  statBottles: document.querySelector("#statBottles"),
  statRefs: document.querySelector("#statRefs"),
  statValue: document.querySelector("#statValue"),
  statReady: document.querySelector("#statReady"),
  statPurchaseValue: document.querySelector("#statPurchaseValue"),
  statGainLoss: document.querySelector("#statGainLoss"),
  statExpired: document.querySelector("#statExpired"),
  statTopValue: document.querySelector("#statTopValue"),
  statusMessage: document.querySelector("#statusMessage"),
  photoPreview: document.querySelector("#photoPreview"),
  photoInputHidden: document.querySelector("#photoInputHidden"),
  printView: document.querySelector("#printView"),
  createBackupButton: document.querySelector("#createBackupButton"),
  restoreBackupButton: document.querySelector("#restoreBackupButton"),
  restoreBackupInput: document.querySelector("#restoreBackupInput"),
  diagnosticButton: document.querySelector("#diagnosticButton"),
  feedbackButton: document.querySelector("#feedbackButton"),
  changelogButton: document.querySelector("#changelogButton"),
  clearDataButton: document.querySelector("#clearDataButton"),
  wineDetailDialog: document.querySelector("#wineDetailDialog"),
  closeDetailButton: document.querySelector("#closeDetailButton"),
  detailTitle: document.querySelector("#detailTitle"),
  wineDetailContent: document.querySelector("#wineDetailContent"),
  wishlistDialog: document.querySelector("#wishlistDialog"),
  wishlistForm: document.querySelector("#wishlistForm"),
  closeWishlistButton: document.querySelector("#closeWishlistButton"),
  openWishlistButton: document.querySelector("#openWishlistButton"),
  tastingDialog: document.querySelector("#tastingDialog"),
  tastingForm: document.querySelector("#tastingForm"),
  closeTastingButton: document.querySelector("#closeTastingButton"),
  feedbackDialog: document.querySelector("#feedbackDialog"),
  feedbackForm: document.querySelector("#feedbackForm"),
  closeFeedbackButton: document.querySelector("#closeFeedbackButton"),
  feedbackMailButton: document.querySelector("#feedbackMailButton"),
  changelogDialog: document.querySelector("#changelogDialog"),
  closeChangelogButton: document.querySelector("#closeChangelogButton"),
  confirmDialog: document.querySelector("#confirmDialog"),
  confirmTitle: document.querySelector("#confirmTitle"),
  confirmMessage: document.querySelector("#confirmMessage"),
  confirmCancelButton: document.querySelector("#confirmCancelButton"),
  confirmOkButton: document.querySelector("#confirmOkButton"),
  adviceQuestionInput: document.querySelector("#adviceQuestionInput"),
  askAdviceButton: document.querySelector("#askAdviceButton"),
  adviceResult: document.querySelector("#adviceResult"),
  betaState: document.querySelector("#betaState"),
  appVersion: document.querySelector("#appVersion")
};

const fields = {
  domain: document.querySelector("#domainInput"),
  cuvee: document.querySelector("#cuveeInput"),
  color: document.querySelector("#wineColorInput"),
  region: document.querySelector("#regionInput"),
  appellation: document.querySelector("#appellationInput"),
  vintage: document.querySelector("#vintageInput"),
  quantity: document.querySelector("#quantityInput"),
  price: document.querySelector("#priceInput"),
  drinkFrom: document.querySelector("#drinkFromInput"),
  drinkTo: document.querySelector("#drinkToInput"),
  location: document.querySelector("#locationInput"),
  notes: document.querySelector("#notesInput"),
  format: document.querySelector("#formatInput"),
  status: document.querySelector("#statusInput"),
  purchaseDate: document.querySelector("#purchaseDateInput"),
  supplier: document.querySelector("#supplierInput"),
  purchasePrice: document.querySelector("#purchasePriceInput"),
  estimatedValue: document.querySelector("#estimatedValueInput"),
  cellarName: document.querySelector("#cellarNameInput"),
  rack: document.querySelector("#rackInput"),
  row: document.querySelector("#rowInput"),
  column: document.querySelector("#columnInput"),
  tags: document.querySelector("#tagsInput"),
  favorite: document.querySelector("#favoriteInput"),
  rating: document.querySelector("#ratingInput"),
  consumedAt: document.querySelector("#consumedAtInput"),
  photo: document.querySelector("#photoInput")
};

const wishlistFields = {
  domain: document.querySelector("#wishDomainInput"),
  cuvee: document.querySelector("#wishCuveeInput"),
  color: document.querySelector("#wishColorInput"),
  region: document.querySelector("#wishRegionInput"),
  budget: document.querySelector("#wishBudgetInput"),
  priority: document.querySelector("#wishPriorityInput"),
  note: document.querySelector("#wishNoteInput")
};

const tastingFields = {
  wineId: document.querySelector("#tastingWineId"),
  date: document.querySelector("#tastingDateInput"),
  rating: document.querySelector("#tastingRatingInput"),
  comment: document.querySelector("#tastingCommentInput"),
  pairing: document.querySelector("#tastingPairingInput"),
  rebuy: document.querySelector("#tastingRebuyInput")
};

const feedbackFields = {
  satisfaction: document.querySelector("#feedbackSatisfactionInput"),
  bug: document.querySelector("#feedbackBugInput"),
  suggestion: document.querySelector("#feedbackSuggestionInput")
};

// Initialisation
bindEvents();
saveCellar(wines);
saveMovements(movements);
saveWishlist(wishlist);
saveTastingNotes(tastingNotes);
saveErrorLogs(errorLogs);
render();

// Evenements
function bindEvents() {
  elements.openFormButton.addEventListener("click", () => openForm());
  elements.emptyAddButton.addEventListener("click", () => openForm());
  elements.closeDialogButton.addEventListener("click", () => elements.dialog.close());
  elements.form.addEventListener("submit", saveWineFromForm);
  elements.deleteButton.addEventListener("click", deleteCurrentWine);
  elements.markConsumedFormButton.addEventListener("click", () => markWineConsumed(elements.wineId.value));
  elements.exportButton.addEventListener("click", exportJson);
  elements.importButton.addEventListener("click", () => elements.importFileInput.click());
  elements.exportCsvButton.addEventListener("click", exportCsv);
  elements.importCsvButton.addEventListener("click", () => elements.importCsvFileInput.click());
  elements.printButton.addEventListener("click", printInventory);
  elements.createBackupButton.addEventListener("click", createManualBackup);
  elements.restoreBackupButton.addEventListener("click", () => elements.restoreBackupInput.click());
  elements.restoreBackupInput.addEventListener("change", restoreBackupFromFile);
  elements.diagnosticButton.addEventListener("click", exportDiagnostic);
  elements.feedbackButton.addEventListener("click", () => elements.feedbackDialog.showModal());
  elements.changelogButton.addEventListener("click", () => elements.changelogDialog.showModal());
  elements.clearDataButton.addEventListener("click", clearAllData);
  elements.closeDetailButton.addEventListener("click", () => elements.wineDetailDialog.close());
  elements.closeWishlistButton.addEventListener("click", () => elements.wishlistDialog.close());
  elements.openWishlistButton.addEventListener("click", () => openWishlistForm());
  elements.wishlistForm.addEventListener("submit", saveWishlistFromForm);
  elements.closeTastingButton.addEventListener("click", () => elements.tastingDialog.close());
  elements.tastingForm.addEventListener("submit", saveTastingNoteFromForm);
  elements.closeFeedbackButton.addEventListener("click", () => elements.feedbackDialog.close());
  elements.feedbackForm.addEventListener("submit", exportFeedback);
  elements.feedbackMailButton.addEventListener("click", openFeedbackMail);
  elements.closeChangelogButton.addEventListener("click", () => elements.changelogDialog.close());
  elements.confirmCancelButton.addEventListener("click", () => resolveConfirm(false));
  elements.confirmOkButton.addEventListener("click", () => resolveConfirm(true));
  elements.askAdviceButton.addEventListener("click", () => requestWineAdvice(elements.adviceQuestionInput.value));
  document.querySelectorAll("[data-advice]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.adviceQuestionInput.value = button.dataset.advice;
      requestWineAdvice(button.dataset.advice);
    });
  });
  elements.importFileInput.addEventListener("change", importJson);
  elements.importCsvFileInput.addEventListener("change", importCsv);
  elements.resetFiltersButton.addEventListener("click", resetFilters);
  fields.photo.addEventListener("change", handlePhotoSelection);
  document.querySelector("#removePhotoButton").addEventListener("click", removePhoto);

  [
    elements.searchInput, elements.colorFilter, elements.regionFilter, elements.statusFilter,
    elements.drinkFilter, elements.cellarFilter, elements.rackFilter, elements.tagFilter,
    elements.favoriteFilter, elements.stockFilter, elements.vintageMinFilter,
    elements.vintageMaxFilter, elements.priceMinFilter, elements.priceMaxFilter,
    elements.valueMinFilter, elements.valueMaxFilter,
    elements.sortSelect
  ].forEach((control) => control.addEventListener("input", render));

  window.addEventListener("error", (event) => {
    logError(event.error || event.message, "window.error");
  });
  window.addEventListener("unhandledrejection", (event) => {
    logError(event.reason, "unhandledrejection");
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    elements.installButton.hidden = false;
  });

  elements.installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    elements.installButton.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    elements.installButton.hidden = true;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js");
    });
  }
}

// Storage et migration
function loadCellar() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return sampleWines;
  }

  try {
    const parsed = JSON.parse(stored);
    const rawWines = Array.isArray(parsed) ? parsed : parsed.wines;
    if (!Array.isArray(rawWines)) return sampleWines;
    return migrateWines(rawWines);
  } catch {
    return sampleWines;
  }
}

function migrateWines(rawWines) {
  return rawWines.map((wine) => normalizeWine(wine));
}

function saveCellar(nextWines = wines) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    wines: nextWines
  }));
}

function loadMovements() {
  const stored = localStorage.getItem(MOVEMENTS_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(normalizeMovement) : [];
  } catch {
    return [];
  }
}

function saveMovements(nextMovements = movements) {
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(nextMovements));
}

function loadWishlist() {
  return loadJsonArray(WISHLIST_KEY).map(normalizeWish);
}

function saveWishlist(nextWishlist = wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(nextWishlist));
}

function loadTastingNotes() {
  return loadJsonArray(TASTING_NOTES_KEY).map(normalizeTastingNote);
}

function saveTastingNotes(nextNotes = tastingNotes) {
  localStorage.setItem(TASTING_NOTES_KEY, JSON.stringify(nextNotes));
}

function loadErrorLogs() {
  return loadJsonArray(ERROR_LOGS_KEY).map(normalizeErrorLog);
}

function saveErrorLogs(nextLogs = errorLogs) {
  localStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(nextLogs));
}

function loadJsonArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function normalizeWine(wine = {}) {
  const quantity = toNumber(wine.quantity, 1);
  const price = toNumber(wine.price ?? wine.purchasePrice, 0);
  const purchasePrice = toNumber(wine.purchasePrice ?? wine.price, price);
  const estimatedValue = toNumber(wine.estimatedValue ?? wine.price, price);
  const status = normalizeStatus(wine.status, quantity);

  return {
    id: wine.id || crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    domain: cleanString(wine.domain) || "Domaine sans nom",
    cuvee: cleanString(wine.cuvee) || "Cuvee sans nom",
    color: normalizeColor(wine.color),
    region: cleanString(wine.region) || "Region non renseignee",
    appellation: cleanString(wine.appellation),
    vintage: normalizeVintage(wine.vintage),
    quantity: Math.max(0, quantity),
    price: Math.max(0, price),
    format: FORMATS.includes(wine.format) ? wine.format : "75cl",
    status,
    purchaseDate: cleanString(wine.purchaseDate),
    supplier: SUPPLIERS.includes(wine.supplier) ? wine.supplier : "",
    purchasePrice: Math.max(0, purchasePrice),
    estimatedValue: Math.max(0, estimatedValue),
    drinkFrom: normalizeYear(wine.drinkFrom),
    drinkTo: normalizeYear(wine.drinkTo),
    cellarName: cleanString(wine.cellarName),
    rack: cleanString(wine.rack),
    row: cleanString(wine.row),
    column: cleanString(wine.column),
    location: cleanString(wine.location),
    tags: normalizeTags(wine.tags),
    favorite: Boolean(wine.favorite),
    rating: clamp(toNumber(wine.rating, 0), 0, 5),
    consumedAt: cleanString(wine.consumedAt),
    photo: typeof wine.photo === "string" ? wine.photo : "",
    notes: cleanString(wine.notes)
  };
}

function normalizeMovement(movement = {}) {
  return {
    id: movement.id || crypto.randomUUID(),
    wineId: cleanString(movement.wineId),
    type: cleanString(movement.type) || "modification",
    date: cleanString(movement.date) || new Date().toISOString(),
    label: cleanString(movement.label) || "Mouvement",
    quantityChange: toNumber(movement.quantityChange, 0),
    snapshot: movement.snapshot || null
  };
}

function normalizeWish(wish = {}) {
  return {
    id: wish.id || crypto.randomUUID(),
    domain: cleanString(wish.domain) || "Domaine a trouver",
    cuvee: cleanString(wish.cuvee) || "Cuvee a trouver",
    color: normalizeColor(wish.color),
    region: cleanString(wish.region),
    budget: Math.max(0, toNumber(wish.budget, 0)),
    priority: ["low", "medium", "high"].includes(wish.priority) ? wish.priority : "medium",
    note: cleanString(wish.note),
    createdAt: wish.createdAt || new Date().toISOString()
  };
}

function normalizeTastingNote(note = {}) {
  return {
    id: note.id || crypto.randomUUID(),
    wineId: cleanString(note.wineId),
    date: cleanString(note.date) || today(),
    rating: clamp(toNumber(note.rating, 0), 0, 5),
    comment: cleanString(note.comment),
    pairing: cleanString(note.pairing),
    rebuy: Boolean(note.rebuy)
  };
}

function normalizeErrorLog(log = {}) {
  return {
    id: log.id || crypto.randomUUID(),
    date: cleanString(log.date) || new Date().toISOString(),
    context: cleanString(log.context),
    message: cleanString(log.message),
    stack: cleanString(log.stack)
  };
}

// Rendu
function render() {
  wines = wines.map(normalizeWine);
  renderFilterOptions();
  const filtered = getFilteredWines();
  renderStats();
  renderCompactStats();
  renderWineList(filtered);
  renderAlerts();
  renderMovements();
  renderWishlist();
  renderBetaState();
}

function renderFilterOptions() {
  updateSelectOptions(elements.regionFilter, uniqueValues(wines.map((wine) => wine.region)), "Toutes", "all");
  updateSelectOptions(elements.cellarFilter, uniqueValues(wines.map((wine) => wine.cellarName).filter(Boolean)), "Toutes", "all");
  updateSelectOptions(elements.rackFilter, uniqueValues(wines.map((wine) => wine.rack).filter(Boolean)), "Tous", "all");
  updateSelectOptions(elements.tagFilter, uniqueValues(wines.flatMap((wine) => wine.tags)), "Tous", "all");
}

function renderStats() {
  const active = wines.filter((wine) => wine.status !== "bu" && wine.status !== "vendu" && wine.status !== "offert");
  const totalBottles = active.reduce((sum, wine) => sum + wine.quantity, 0);
  const purchaseTotal = active.reduce((sum, wine) => sum + wine.quantity * wine.purchasePrice, 0);
  const estimatedTotal = active.reduce((sum, wine) => sum + wine.quantity * wine.estimatedValue, 0);
  const ready = active.filter((wine) => drinkStatus(wine).state === "ready").length;
  const expired = active.filter((wine) => drinkStatus(wine).state === "late").length;
  const top = [...active].sort((a, b) => bottleValue(b) - bottleValue(a))[0];

  elements.statBottles.textContent = totalBottles;
  elements.statRefs.textContent = wines.length;
  elements.statValue.textContent = formatMoney(estimatedTotal);
  elements.statReady.textContent = ready;
  elements.statPurchaseValue.textContent = formatMoney(purchaseTotal);
  elements.statGainLoss.textContent = formatMoney(estimatedTotal - purchaseTotal);
  elements.statExpired.textContent = expired;
  elements.statTopValue.textContent = top ? `${top.domain} (${formatMoney(bottleValue(top))})` : "-";
}

function renderCompactStats() {
  const byColor = countBy(wines, "color");
  const byRegion = countBy(wines, "region");
  const byCellar = countBy(wines, "cellarName");
  const valueByCellar = sumValueBy(wines, "cellarName");
  const keepCount = wines.filter((wine) => drinkStatus(wine).state === "wait").length;
  const favoriteCount = wines.filter((wine) => wine.favorite).length;
  const topRegions = Object.entries(byRegion).sort((a, b) => b[1] - a[1]).slice(0, 2);
  elements.compactStats.innerHTML = [
    `Couleurs: ${Object.entries(byColor).map(([key, value]) => `${escapeHtml(key)} ${value}`).join(" · ") || "-"}`,
    `Regions: ${topRegions.map(([key, value]) => `${escapeHtml(key)} ${value}`).join(" · ") || "-"}`,
    `A garder: ${keepCount} · Favoris: ${favoriteCount}`,
    `Stock par cave: ${Object.entries(byCellar).slice(0, 3).map(([key, value]) => `${escapeHtml(key)} ${value}`).join(" · ") || "-"}`,
    `Valeur par cave: ${Object.entries(valueByCellar).slice(0, 3).map(([key, value]) => `${escapeHtml(key)} ${formatMoney(value)}`).join(" · ") || "-"}`,
    `Top 5 valeur: ${getTopValuedWines().map((wine) => escapeHtml(wine.domain)).join(", ") || "-"}`
  ].map((text) => `<span class="compact-stat">${text}</span>`).join("");
}

function renderWishlist() {
  elements.wishlistList.innerHTML = "";
  if (!wishlist.length) {
    elements.wishlistList.innerHTML = `<p>Aucun achat en attente.</p>`;
    return;
  }

  wishlist.slice(0, 6).forEach((wish) => {
    const item = document.createElement("div");
    item.className = "wishlist-card";
    item.innerHTML = `
      <strong>${escapeHtml(wish.domain)} - ${escapeHtml(wish.cuvee)}</strong>
      <p>${escapeHtml(wish.color)}${wish.region ? ` · ${escapeHtml(wish.region)}` : ""}${wish.budget ? ` · ${formatMoney(wish.budget)}` : ""} · ${escapeHtml(priorityLabel(wish.priority))}</p>
      <div class="quick-advice-actions">
        <button class="card-action" type="button" data-wish-action="buy" data-id="${escapeAttribute(wish.id)}">Ajouter a la cave</button>
        <button class="card-action" type="button" data-wish-action="remove" data-id="${escapeAttribute(wish.id)}">Retirer</button>
      </div>
    `;
    elements.wishlistList.append(item);
  });

  elements.wishlistList.querySelectorAll("[data-wish-action]").forEach((button) => {
    button.addEventListener("click", () => handleWishlistAction(button.dataset.wishAction, button.dataset.id));
  });
}

function renderBetaState() {
  const storageSize = estimateStorageSize();
  const lastBackup = localStorage.getItem(BACKUP_KEY);
  elements.appVersion.textContent = `Version ${APP_VERSION}`;
  elements.betaState.innerHTML = `
    <div class="beta-card"><strong>Derniere sauvegarde</strong><p>${lastBackup ? formatDateTime(JSON.parse(lastBackup).createdAt) : "Aucune sauvegarde locale"}</p></div>
    <div class="beta-card"><strong>Inventaire</strong><p>${wines.length} references · ${movements.length} mouvements</p></div>
    <div class="beta-card"><strong>Stockage estime</strong><p>${formatBytes(storageSize)}</p></div>
    <div class="beta-card"><strong>PWA</strong><p>${navigator.serviceWorker ? "Service worker disponible" : "Service worker indisponible"}</p></div>
  `;
}

function renderWineList(filtered) {
  elements.wineList.innerHTML = "";
  elements.emptyState.hidden = filtered.length > 0;
  elements.resultCount.textContent = `${filtered.length} resultat${filtered.length > 1 ? "s" : ""}`;

  filtered.forEach((wine) => {
    const status = drinkStatus(wine);
    const card = document.createElement("article");
    card.className = "wine-card";
    card.dataset.color = wine.color;
    card.innerHTML = `
      <div class="wine-photo">${wine.photo ? `<img src="${escapeAttribute(wine.photo)}" alt="">` : `<span>${escapeHtml(wine.color.slice(0, 1))}</span>`}</div>
      <div>
        <div class="wine-title-row">
          <div class="wine-title">${escapeHtml(wineName(wine))}</div>
          <button class="favorite-toggle" type="button" data-action="favorite" data-id="${escapeAttribute(wine.id)}" aria-pressed="${wine.favorite}">${wine.favorite ? "Favori" : "Favori +"}</button>
        </div>
        <div class="wine-meta">
          <span>${escapeHtml(wine.color)}</span>
          <span>${escapeHtml(wine.region)}</span>
          <span>${escapeHtml(wine.appellation || "Sans appellation")}</span>
          <span>${wine.vintage ? escapeHtml(String(wine.vintage)) : "Non millesime"}</span>
          <span>${escapeHtml(wine.format)}</span>
          <span>${escapeHtml(wine.status)}</span>
          <span>${escapeHtml(formatLocation(wine) || "Emplacement non renseigne")}</span>
          ${hasLocationConflict(wine) ? `<span class="pill warning">Emplacement partage</span>` : ""}
          <span class="pill neutral">${escapeHtml(getDrinkPriorityLabel(wine))}</span>
        </div>
        <p class="wine-notes">${escapeHtml(wine.notes || "Aucune note pour le moment.")}</p>
        <div class="tag-list">${wine.tags.map((tag) => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join("")}</div>
      </div>
      <div class="wine-facts">
        <span class="pill ${status.state === "late" ? "danger" : status.state}">${status.label}</span>
        <strong>${wine.quantity} bouteille${wine.quantity > 1 ? "s" : ""}</strong>
        <span>${formatMoney(bottleValue(wine))}</span>
        <button class="card-action" type="button" data-action="view" data-id="${escapeAttribute(wine.id)}">Voir</button>
        <button class="card-action" type="button" data-action="consume" data-id="${escapeAttribute(wine.id)}">Marquer bue</button>
        <button class="card-action" type="button" data-action="move" data-id="${escapeAttribute(wine.id)}">Deplacer</button>
        <button class="card-action" type="button" data-action="edit" data-id="${escapeAttribute(wine.id)}">Modifier</button>
      </div>
    `;
    elements.wineList.append(card);
  });

  elements.wineList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleCardAction(button.dataset.action, button.dataset.id));
  });
}

function renderAlerts() {
  const alerts = getAlerts();
  elements.watchList.innerHTML = "";

  if (!alerts.length) {
    elements.watchList.innerHTML = `<p>Aucune alerte pour le moment.</p>`;
    return;
  }

  alerts.slice(0, 8).forEach((alert) => {
    const item = document.createElement("div");
    item.className = `watch-card ${alert.severity}`;
    item.innerHTML = `
      <strong>${escapeHtml(alert.title)}</strong>
      <p>${escapeHtml(alert.message)}</p>
    `;
    elements.watchList.append(item);
  });
}

function renderMovements() {
  elements.movementList.innerHTML = "";
  const recent = [...movements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  if (!recent.length) {
    elements.movementList.innerHTML = `<p>Aucun mouvement.</p>`;
    return;
  }

  recent.forEach((movement) => {
    const item = document.createElement("div");
    item.className = "movement-card";
    item.innerHTML = `
      <strong>${escapeHtml(movement.label)}</strong>
      <p>${formatDateTime(movement.date)}${movement.quantityChange ? ` · ${movement.quantityChange > 0 ? "+" : ""}${movement.quantityChange}` : ""}</p>
    `;
    elements.movementList.append(item);
  });
}

// Filtres et tri
function getFilteredWines() {
  const term = elements.searchInput.value.trim().toLowerCase();
  const color = elements.colorFilter.value;
  const region = elements.regionFilter.value;
  const status = elements.statusFilter.value;
  const drink = elements.drinkFilter.value;
  const cellar = elements.cellarFilter.value;
  const rack = elements.rackFilter.value;
  const tag = elements.tagFilter.value;
  const favorite = elements.favoriteFilter.value;
  const stock = elements.stockFilter.value;
  const vintageMin = toNumber(elements.vintageMinFilter.value, 0);
  const vintageMax = toNumber(elements.vintageMaxFilter.value, 0);
  const priceMin = toNumber(elements.priceMinFilter.value, 0);
  const priceMax = toNumber(elements.priceMaxFilter.value, 0);
  const valueMin = toNumber(elements.valueMinFilter.value, 0);
  const valueMax = toNumber(elements.valueMaxFilter.value, 0);
  const normalizedTerm = normalizeSearch(term);

  return wines
    .filter((wine) => color === "all" || wine.color === color)
    .filter((wine) => region === "all" || wine.region === region)
    .filter((wine) => status === "all" || wine.status === status)
    .filter((wine) => cellar === "all" || wine.cellarName === cellar)
    .filter((wine) => rack === "all" || wine.rack === rack)
    .filter((wine) => tag === "all" || wine.tags.includes(tag))
    .filter((wine) => favorite === "all" || wine.favorite)
    .filter((wine) => stock === "all" || wine.quantity <= 1)
    .filter((wine) => drink === "all" || drinkStatus(wine).state === drink || (drink === "expired" && drinkStatus(wine).state === "late"))
    .filter((wine) => !vintageMin || (wine.vintage && wine.vintage >= vintageMin))
    .filter((wine) => !vintageMax || (wine.vintage && wine.vintage <= vintageMax))
    .filter((wine) => !priceMin || wine.estimatedValue >= priceMin || wine.price >= priceMin)
    .filter((wine) => !priceMax || wine.estimatedValue <= priceMax || wine.price <= priceMax)
    .filter((wine) => !valueMin || wine.estimatedValue >= valueMin)
    .filter((wine) => !valueMax || wine.estimatedValue <= valueMax)
    .filter((wine) => {
      if (!term) return true;
      const haystack = [
        wine.domain, wine.cuvee, wine.region, wine.appellation, wine.location, wine.notes,
        wine.cellarName, wine.rack, wine.row, wine.column, wine.status, ...wine.tags,
        String(wine.vintage || "Non millesime")
      ].join(" ");
      return normalizeSearch(haystack).includes(normalizedTerm);
    })
    .sort(sortWines);
}

function sortWines(a, b) {
  const sort = elements.sortSelect.value;
  if (sort === "name") return wineName(a).localeCompare(wineName(b));
  if (sort === "quantity") return b.quantity - a.quantity;
  if (sort === "value") return bottleValue(b) - bottleValue(a);
  if (sort === "vintage") return Number(b.vintage || 0) - Number(a.vintage || 0);
  if (sort === "favorite") return Number(b.favorite) - Number(a.favorite) || wineName(a).localeCompare(wineName(b));
  return Number(a.drinkTo || 9999) - Number(b.drinkTo || 9999);
}

function resetFilters() {
  [
    elements.searchInput, elements.vintageMinFilter, elements.vintageMaxFilter,
    elements.priceMinFilter, elements.priceMaxFilter, elements.valueMinFilter, elements.valueMaxFilter
  ].forEach((input) => {
    input.value = "";
  });
  [
    elements.colorFilter, elements.regionFilter, elements.statusFilter, elements.drinkFilter,
    elements.cellarFilter, elements.rackFilter, elements.tagFilter, elements.favoriteFilter,
    elements.stockFilter
  ].forEach((select) => {
    select.value = "all";
  });
  elements.sortSelect.value = "drinkWindow";
  render();
}

// Formulaire
function openForm(wine = null) {
  elements.form.reset();
  elements.wineId.value = wine?.id || "";
  elements.dialogTitle.textContent = wine ? "Modifier une bouteille" : "Ajouter une bouteille";
  elements.deleteButton.hidden = !wine;
  elements.markConsumedFormButton.hidden = !wine;
  elements.photoInputHidden.value = wine?.photo || "";
  renderPhotoPreview(wine?.photo || "");

  if (wine) {
    Object.entries(fields).forEach(([key, input]) => {
      if (key === "photo") return;
      if (key === "tags") {
        input.value = wine.tags.join(", ");
      } else if (key === "favorite") {
        input.checked = wine.favorite;
      } else {
        input.value = wine[key] ?? "";
      }
    });
  } else {
    fields.vintage.value = currentYear;
    fields.quantity.value = 1;
    fields.price.value = "";
    fields.purchasePrice.value = "";
    fields.estimatedValue.value = "";
    fields.format.value = "75cl";
    fields.status.value = "en cave";
    fields.drinkFrom.value = currentYear;
    fields.drinkTo.value = currentYear + 5;
    fields.cellarName.value = "Cave principale";
  }

  elements.dialog.showModal();
  fields.domain.focus();
}

function saveWineFromForm(event) {
  event.preventDefault();
  const validation = validateForm();
  if (!validation.valid) {
    showStatus(validation.message, "error");
    return;
  }

  const oldWine = wines.find((wine) => wine.id === elements.wineId.value);
  const nextWine = normalizeWine({
    id: elements.wineId.value || crypto.randomUUID(),
    domain: fields.domain.value,
    cuvee: fields.cuvee.value,
    color: fields.color.value,
    region: fields.region.value,
    appellation: fields.appellation.value,
    vintage: fields.vintage.value,
    quantity: fields.quantity.value,
    price: fields.price.value,
    drinkFrom: fields.drinkFrom.value,
    drinkTo: fields.drinkTo.value,
    location: fields.location.value,
    notes: fields.notes.value,
    format: fields.format.value,
    status: fields.status.value,
    purchaseDate: fields.purchaseDate.value,
    supplier: fields.supplier.value,
    purchasePrice: fields.purchasePrice.value || fields.price.value,
    estimatedValue: fields.estimatedValue.value || fields.price.value,
    cellarName: fields.cellarName.value,
    rack: fields.rack.value,
    row: fields.row.value,
    column: fields.column.value,
    tags: fields.tags.value,
    favorite: fields.favorite.checked,
    rating: fields.rating.value,
    consumedAt: fields.consumedAt.value,
    photo: elements.photoInputHidden.value
  });

  const index = wines.findIndex((wine) => wine.id === nextWine.id);
  if (index >= 0) {
    wines[index] = nextWine;
    addMovement(nextWine.id, "modification", `Modification de ${wineName(nextWine)}`, 0);
    if (oldWine && locationKey(oldWine) !== locationKey(nextWine)) {
      addMovement(nextWine.id, "deplacement", `Deplacement de ${wineName(nextWine)} vers ${formatLocation(nextWine) || "emplacement non renseigne"}`, 0);
    }
  } else {
    wines = [nextWine, ...wines];
    addMovement(nextWine.id, "ajout", `Ajout de ${wineName(nextWine)}`, nextWine.quantity);
  }

  saveCellar(wines);
  saveMovements(movements);
  trackModification();
  elements.dialog.close();
  render();
  showStatus("Bouteille enregistree.");
}

function validateForm() {
  const quantity = toNumber(fields.quantity.value, 0);
  const price = toNumber(fields.price.value, 0);
  const purchasePrice = toNumber(fields.purchasePrice.value, 0);
  const estimatedValue = toNumber(fields.estimatedValue.value, 0);
  const drinkFrom = normalizeYear(fields.drinkFrom.value);
  const drinkTo = normalizeYear(fields.drinkTo.value);
  const vintage = normalizeVintage(fields.vintage.value);
  const rating = toNumber(fields.rating.value, 0);

  if (!fields.domain.value.trim() || !fields.cuvee.value.trim()) return { valid: false, message: "Domaine et cuvee sont obligatoires." };
  if (quantity < 0) return { valid: false, message: "La quantite ne peut pas etre negative." };
  if (price < 0 || purchasePrice < 0 || estimatedValue < 0) return { valid: false, message: "Les prix ne peuvent pas etre negatifs." };
  if (drinkFrom && drinkTo && drinkFrom > drinkTo) return { valid: false, message: "La date de debut de degustation doit etre avant la date de fin." };
  if (vintage && (vintage < 1900 || vintage > 2100)) return { valid: false, message: "Le millesime doit etre compris entre 1900 et 2100, ou 0 pour non millesime." };
  if (rating < 0 || rating > 5) return { valid: false, message: "La note doit etre comprise entre 0 et 5." };
  return { valid: true };
}

async function deleteCurrentWine() {
  const id = elements.wineId.value;
  const wine = wines.find((item) => item.id === id);
  if (!wine) return;
  const confirmed = await askConfirmation("Supprimer la bouteille", `Supprimer ${wineName(wine)} ? Une sauvegarde locale sera creee avant suppression.`, "Supprimer");
  if (!confirmed) return;

  exportBackup("suppression");
  wines = wines.filter((item) => item.id !== id);
  addMovement("suppression", wine, { label: `Suppression de ${wineName(wine)}`, quantityChange: -wine.quantity });
  saveCellar(wines);
  saveMovements(movements);
  trackModification();
  elements.dialog.close();
  render();
  showStatus("Bouteille supprimee.");
}

function handleCardAction(action, id) {
  const wine = wines.find((item) => item.id === id);
  if (!wine) return;
  if (action === "view") openWineDetail(wine);
  if (action === "edit") openForm(wine);
  if (action === "move") openMoveForm(wine);
  if (action === "consume") markWineConsumed(id);
  if (action === "favorite") toggleFavorite(id);
}

async function markWineConsumed(id) {
  const wine = wines.find((item) => item.id === id);
  if (!wine || wine.quantity <= 0) {
    showStatus("Aucune bouteille disponible a consommer.", "error");
    return;
  }
  const before = structuredClone(wine);
  const confirmed = await askConfirmation("Marquer comme bue", `Marquer une bouteille de ${wineName(wine)} comme bue ?`, "Marquer bue");
  if (!confirmed) return;

  wine.quantity = Math.max(0, wine.quantity - 1);
  wine.consumedAt = new Date().toISOString().slice(0, 10);
  if (wine.quantity === 0) wine.status = "bu";
  addMovement("consommation", wine, { label: `Consommation de ${wineName(wine)}`, quantityChange: -1 });
  saveCellar(wines);
  saveMovements(movements);
  trackModification();
  lastUndo = () => {
    const index = wines.findIndex((item) => item.id === before.id);
    if (index >= 0) wines[index] = before;
    saveCellar(wines);
    addMovement("restauration", before, { label: `Annulation consommation de ${wineName(before)}`, quantityChange: 1 });
    saveMovements(movements);
    render();
  };
  if (elements.dialog.open) elements.dialog.close();
  render();
  showStatus("Bouteille marquee comme bue.", "success", { label: "Annuler", action: undoLastAction });
}

function toggleFavorite(id) {
  const wine = wines.find((item) => item.id === id);
  if (!wine) return;
  wine.favorite = !wine.favorite;
  addMovement(wine.id, "modification", `${wine.favorite ? "Ajout aux favoris" : "Retrait des favoris"}: ${wineName(wine)}`, 0);
  saveCellar(wines);
  saveMovements(movements);
  trackModification();
  render();
}

// Photos
function handlePhotoSelection(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showStatus("Le fichier choisi n'est pas une image.", "error");
    fields.photo.value = "";
    return;
  }

  compressImage(file).then((dataUrl) => {
    elements.photoInputHidden.value = dataUrl;
    renderPhotoPreview(dataUrl);
  }).catch(() => showStatus("Impossible de lire cette image.", "error"));
}

function removePhoto() {
  elements.photoInputHidden.value = "";
  fields.photo.value = "";
  renderPhotoPreview("");
}

function renderPhotoPreview(dataUrl) {
  elements.photoPreview.innerHTML = dataUrl ? `<img src="${escapeAttribute(dataUrl)}" alt="">` : "Aucune photo";
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxSize = 720;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

// Import / export
function exportJson() {
  const backup = {
    app: "Cave a vin",
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    wines,
    movements,
    wishlist,
    tastingNotes,
    errorLogs
  };
  downloadFile(JSON.stringify(backup, null, 2), `cave-a-vin-${today()}.json`, "application/json");
  addMovement("export", {}, { label: "Export JSON de la cave", quantityChange: 0 });
  saveMovements(movements);
  renderMovements();
  showStatus("Sauvegarde JSON exportee.");
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  readTextFile(file, async (text) => {
    try {
      const data = JSON.parse(text);
      const importedWines = Array.isArray(data) ? data : data.wines;
      if (!Array.isArray(importedWines)) throw new Error("La cle wines est absente ou invalide.");
      const confirmed = await askConfirmation("Importer une sauvegarde", "Importer cette sauvegarde remplacera la cave actuelle. Une sauvegarde automatique sera creee avant import.", "Importer");
      if (!confirmed) return;
      exportBackup("avant-import-json");
      wines = importedWines.map(normalizeWine);
      movements = Array.isArray(data.movements) ? data.movements.map(normalizeMovement) : movements;
      wishlist = Array.isArray(data.wishlist) ? data.wishlist.map(normalizeWish) : wishlist;
      tastingNotes = Array.isArray(data.tastingNotes) ? data.tastingNotes.map(normalizeTastingNote) : tastingNotes;
      addMovement("", "import", `Import JSON de ${wines.length} reference(s)`, 0);
      saveCellar(wines);
      saveMovements(movements);
      saveWishlist(wishlist);
      saveTastingNotes(tastingNotes);
      trackModification();
      render();
      showStatus("Sauvegarde JSON importee.");
    } catch (error) {
      showStatus(`Import JSON impossible: ${error.message}`, "error");
    } finally {
      elements.importFileInput.value = "";
    }
  });
}

function exportCsv() {
  const rows = wines.map((wine) => CSV_COLUMNS.map((column) => formatCsvValue(csvValue(wine, column))).join(";"));
  const csv = "\ufeff" + CSV_COLUMNS.join(";") + "\n" + rows.join("\n");
  downloadFile(csv, `cave-a-vin-${today()}.csv`, "text/csv;charset=utf-8");
  addMovement("export", {}, { label: "Export CSV de la cave", quantityChange: 0 });
  saveMovements(movements);
  renderMovements();
  showStatus("Inventaire CSV exporte.");
}

function importCsv(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  readTextFile(file, async (text) => {
    try {
      const rows = parseCsv(text);
      if (rows.length < 2) throw new Error("Le fichier ne contient pas de donnees.");
      const headers = rows[0].map((header) => header.trim().replace(/^\ufeff/, ""));
      const missing = ["domain", "cuvee", "color", "quantity"].filter((column) => !headers.includes(column));
      if (missing.length) throw new Error(`Colonnes obligatoires manquantes: ${missing.join(", ")}.`);
      const confirmed = await askConfirmation("Importer un CSV", "Importer ce CSV remplacera la cave actuelle. Une sauvegarde automatique sera creee avant import.", "Importer");
      if (!confirmed) return;
      exportBackup("avant-import-csv");
      wines = rows.slice(1)
        .filter((row) => row.some((cell) => cell.trim()))
        .map((row) => rowToWine(headers, row));
      addMovement("", "import", `Import CSV de ${wines.length} reference(s)`, 0);
      saveCellar(wines);
      saveMovements(movements);
      trackModification();
      render();
      showStatus("CSV importe.");
    } catch (error) {
      showStatus(`Import CSV impossible: ${error.message}`, "error");
    } finally {
      elements.importCsvFileInput.value = "";
    }
  });
}

function printInventory() {
  const totalBottles = wines.reduce((sum, wine) => sum + wine.quantity, 0);
  const totalValue = wines.reduce((sum, wine) => sum + bottleValue(wine), 0);
  elements.printView.innerHTML = `
    <h1>Inventaire Cave a vin</h1>
    <p>Date d'export: ${escapeHtml(new Date().toLocaleDateString("fr-FR"))}</p>
    <p>Total: ${totalBottles} bouteilles · ${formatMoney(totalValue)}</p>
    <table>
      <thead>
        <tr>
          <th>Domaine</th><th>Cuvee</th><th>Couleur</th><th>Region</th><th>Millesime</th>
          <th>Quantite</th><th>Statut</th><th>Emplacement</th><th>Valeur</th>
        </tr>
      </thead>
      <tbody>
        ${wines.map((wine) => `
          <tr>
            <td>${escapeHtml(wine.domain)}</td>
            <td>${escapeHtml(wine.cuvee)}</td>
            <td>${escapeHtml(wine.color)}</td>
            <td>${escapeHtml(wine.region)}</td>
            <td>${wine.vintage || "NM"}</td>
            <td>${wine.quantity}</td>
            <td>${escapeHtml(wine.status)}</td>
            <td>${escapeHtml(formatLocation(wine))}</td>
            <td>${formatMoney(bottleValue(wine))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
  window.print();
}

// Fiche bouteille, wishlist et degustation
function openWineDetail(wine) {
  const notes = tastingNotes.filter((note) => note.wineId === wine.id);
  const wineMovements = movements.filter((movement) => movement.wineId === wine.id).slice(0, 8);
  elements.detailTitle.textContent = wineName(wine);
  elements.wineDetailContent.innerHTML = `
    <div class="detail-grid">
      <div class="detail-hero">
        <div class="detail-photo">${wine.photo ? `<img src="${escapeAttribute(wine.photo)}" alt="">` : escapeHtml(wine.color.slice(0, 1))}</div>
        <div>
          <p class="eyebrow">${escapeHtml(wine.region)}${wine.appellation ? ` · ${escapeHtml(wine.appellation)}` : ""}</p>
          <h3>${escapeHtml(wine.domain)}</h3>
          <p>${escapeHtml(wine.cuvee)} · ${wine.vintage || "Non millesime"} · ${escapeHtml(wine.format)}</p>
          <div class="tag-list">
            <span class="pill ${drinkStatus(wine).state === "late" ? "danger" : drinkStatus(wine).state}">${escapeHtml(drinkStatus(wine).label)}</span>
            <span class="pill neutral">${escapeHtml(getDrinkPriorityLabel(wine))}</span>
            ${wine.favorite ? `<span class="pill warning">Favori</span>` : ""}
            ${wine.tags.map((tag) => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </div>
      <div class="compact-stats">
        <span class="compact-stat">Quantite: ${wine.quantity}</span>
        <span class="compact-stat">Valeur: ${formatMoney(bottleValue(wine))}</span>
        <span class="compact-stat">Achat: ${formatMoney(wine.purchasePrice * wine.quantity)}</span>
        <span class="compact-stat">Emplacement: ${escapeHtml(getWineLocationLabel(wine) || "Non renseigne")}</span>
        <span class="compact-stat">Degustation: ${wine.drinkFrom || "?"} - ${wine.drinkTo || "?"}</span>
        <span class="compact-stat">Note moyenne: ${getWineAverageRating(wine.id) || "-"}/5</span>
      </div>
      <p>${escapeHtml(wine.notes || "Aucune note libre.")}</p>
      <div class="quick-advice-actions">
        <button class="card-action" type="button" data-detail-action="edit" data-id="${escapeAttribute(wine.id)}">Modifier</button>
        <button class="card-action" type="button" data-detail-action="consume" data-id="${escapeAttribute(wine.id)}">Marquer bue</button>
        <button class="card-action" type="button" data-detail-action="move" data-id="${escapeAttribute(wine.id)}">Deplacer</button>
        <button class="card-action" type="button" data-detail-action="taste" data-id="${escapeAttribute(wine.id)}">Ajouter une note</button>
        <button class="card-action" type="button" data-detail-action="wish" data-id="${escapeAttribute(wine.id)}">Ajouter a la wishlist</button>
      </div>
      <section>
        <h3>Notes de degustation</h3>
        ${renderTastingNotes(wine.id)}
      </section>
      <section>
        <h3>Historique de cette bouteille</h3>
        ${wineMovements.length ? wineMovements.map((movement) => `<div class="movement-card"><strong>${escapeHtml(movement.label)}</strong><p>${formatDateTime(movement.date)}</p></div>`).join("") : "<p>Aucun mouvement.</p>"}
      </section>
    </div>
  `;
  elements.wineDetailContent.querySelectorAll("[data-detail-action]").forEach((button) => {
    button.addEventListener("click", () => handleDetailAction(button.dataset.detailAction, button.dataset.id));
  });
  if (!elements.wineDetailDialog.open) elements.wineDetailDialog.showModal();
}

function handleDetailAction(action, id) {
  const wine = wines.find((item) => item.id === id);
  if (!wine) return;
  if (action === "edit") {
    elements.wineDetailDialog.close();
    openForm(wine);
  }
  if (action === "move") {
    elements.wineDetailDialog.close();
    openMoveForm(wine);
  }
  if (action === "consume") {
    markWineConsumed(id);
    elements.wineDetailDialog.close();
  }
  if (action === "taste") openTastingNoteForm(id);
  if (action === "wish") addWineToWishlist(wine);
}

function openMoveForm(wine) {
  openForm(wine);
  document.querySelector(".advanced-details").open = true;
  fields.cellarName.focus();
}

function openWishlistForm(wish = null) {
  elements.wishlistForm.reset();
  if (wish) {
    Object.entries(wishlistFields).forEach(([key, input]) => {
      input.value = wish[key] ?? "";
    });
  }
  elements.wishlistDialog.showModal();
  wishlistFields.domain.focus();
}

function saveWishlistFromForm(event) {
  event.preventDefault();
  const wish = normalizeWish({
    domain: wishlistFields.domain.value,
    cuvee: wishlistFields.cuvee.value,
    color: wishlistFields.color.value,
    region: wishlistFields.region.value,
    budget: wishlistFields.budget.value,
    priority: wishlistFields.priority.value,
    note: wishlistFields.note.value
  });
  wishlist = [wish, ...wishlist];
  saveWishlist(wishlist);
  trackModification();
  elements.wishlistDialog.close();
  render();
  showStatus("Bouteille ajoutee a la wishlist.");
}

function handleWishlistAction(action, id) {
  const wish = wishlist.find((item) => item.id === id);
  if (!wish) return;
  if (action === "remove") {
    wishlist = wishlist.filter((item) => item.id !== id);
    saveWishlist(wishlist);
    trackModification();
    render();
    showStatus("Souhait retire.");
  }
  if (action === "buy") {
    openForm();
    fields.domain.value = wish.domain;
    fields.cuvee.value = wish.cuvee;
    fields.color.value = wish.color;
    fields.region.value = wish.region;
    fields.price.value = wish.budget || "";
    fields.purchasePrice.value = wish.budget || "";
    fields.estimatedValue.value = wish.budget || "";
    fields.quantity.value = 1;
    fields.tags.value = "wishlist";
    wishlist = wishlist.filter((item) => item.id !== id);
    saveWishlist(wishlist);
    trackModification();
    render();
  }
}

function addWineToWishlist(wine) {
  const wish = normalizeWish({
    domain: wine.domain,
    cuvee: wine.cuvee,
    color: wine.color,
    region: wine.region,
    budget: wine.estimatedValue,
    priority: "medium",
    note: "Ajoute depuis la fiche bouteille."
  });
  wishlist = [wish, ...wishlist];
  saveWishlist(wishlist);
  trackModification();
  render();
  showStatus("Reference ajoutee a la wishlist.");
}

function openTastingNoteForm(wineId) {
  elements.tastingForm.reset();
  tastingFields.wineId.value = wineId;
  tastingFields.date.value = today();
  tastingFields.rating.value = "";
  elements.tastingDialog.showModal();
  tastingFields.rating.focus();
}

function saveTastingNoteFromForm(event) {
  event.preventDefault();
  const note = normalizeTastingNote({
    wineId: tastingFields.wineId.value,
    date: tastingFields.date.value,
    rating: tastingFields.rating.value,
    comment: tastingFields.comment.value,
    pairing: tastingFields.pairing.value,
    rebuy: tastingFields.rebuy.checked
  });
  tastingNotes = [note, ...tastingNotes];
  saveTastingNotes(tastingNotes);
  addMovement("modification", wines.find((wine) => wine.id === note.wineId) || {}, { label: "Ajout d'une note de degustation", quantityChange: 0 });
  saveMovements(movements);
  trackModification();
  elements.tastingDialog.close();
  render();
  const wine = wines.find((item) => item.id === note.wineId);
  if (wine && elements.wineDetailDialog.open) openWineDetail(wine);
  showStatus("Note de degustation ajoutee.");
}

function renderTastingNotes(wineId) {
  const notes = tastingNotes.filter((note) => note.wineId === wineId);
  if (!notes.length) return "<p>Aucune note de degustation.</p>";
  return notes.map((note) => `
    <div class="tasting-card">
      <strong>${escapeHtml(note.date)} · ${note.rating}/5${note.rebuy ? " · A racheter" : ""}</strong>
      <p>${escapeHtml(note.comment || "Sans commentaire.")}</p>
      ${note.pairing ? `<p>Accord: ${escapeHtml(note.pairing)}</p>` : ""}
    </div>
  `).join("");
}

function getWineAverageRating(wineId) {
  const notes = tastingNotes.filter((note) => note.wineId === wineId && note.rating);
  if (!notes.length) return 0;
  return Math.round((notes.reduce((sum, note) => sum + note.rating, 0) / notes.length) * 10) / 10;
}

// Assistant cave
function getAiEligibleWines() {
  return wines.filter((wine) => wine.quantity > 0 && !["bu", "vendu", "offert"].includes(wine.status));
}

function buildWineAdvicePrompt(userQuestion, eligibleWines) {
  return {
    question: userQuestion,
    wines: eligibleWines.map((wine) => ({
      id: wine.id,
      title: wineName(wine),
      color: wine.color,
      region: wine.region,
      appellation: wine.appellation,
      vintage: wine.vintage,
      drinkFrom: wine.drinkFrom,
      drinkTo: wine.drinkTo,
      notes: wine.notes,
      quantity: wine.quantity,
      location: getWineLocationLabel(wine)
    }))
  };
}

async function requestWineAdvice(userQuestion) {
  try {
    const question = cleanString(userQuestion);
    if (!question) {
      renderWineAdviceError("Indique un plat, une occasion ou une envie.");
      return;
    }
    const eligible = getAiEligibleWines();
    if (!eligible.length) {
      renderWineAdviceError("Aucune bouteille disponible pour une recommandation.");
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 1200);
      const response = await fetch("/api/wine-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildWineAdvicePrompt(question, eligible)),
        signal: controller.signal
      });
      window.clearTimeout(timeoutId);
      if (response.ok) {
        renderWineAdviceResult(await response.json());
        return;
      }
    } catch {
      // La route IA est optionnelle : fallback local obligatoire.
    }

    renderWineAdviceResult(getLocalWineAdvice(question, eligible));
  } catch (error) {
    logError(error, "requestWineAdvice");
    renderWineAdviceError("Impossible de generer un conseil pour le moment.");
  }
}

function getLocalWineAdvice(userQuestion, eligibleWines) {
  const query = normalizeSearch(userQuestion);
  const scored = eligibleWines.map((wine) => {
    let score = getDrinkPriorityScore(wine);
    const notes = normalizeSearch([wine.notes, wine.region, wine.appellation, wine.tags.join(" ")].join(" "));
    if (query.includes("viande") && wine.color === "Rouge") score += 40;
    if ((query.includes("poisson") || query.includes("fruit de mer")) && ["Blanc", "Effervescent"].includes(wine.color)) score += 40;
    if (query.includes("aperitif") && ["Blanc", "Effervescent", "Rose"].includes(wine.color)) score += 35;
    if (query.includes("fromage") && ["Blanc", "Rouge", "Liquoreux"].includes(wine.color)) score += 25;
    if (query.includes("dessert") && ["Liquoreux", "Effervescent"].includes(wine.color)) score += 45;
    if (query.includes("grande occasion") && bottleValue(wine) > 100) score += 35;
    if (query.includes("maintenant") && drinkStatus(wine).state === "ready") score += 35;
    if (notes && query.split(" ").some((word) => word.length > 3 && notes.includes(word))) score += 18;
    return { wine, score };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  return {
    recommendations: scored.map(({ wine, score }) => ({
      wineId: wine.id,
      title: wineName(wine),
      reason: `${drinkStatus(wine).label}, ${wine.color.toLowerCase()}, ${wine.region}.`,
      servingAdvice: wine.color === "Rouge" ? "Servir legerement rafraichi si le vin est jeune." : "Servir frais, sans excès.",
      foodPairing: userQuestion,
      confidence: score > 80 ? "high" : score > 45 ? "medium" : "low"
    })),
    generalAdvice: "Conseil genere a partir des informations de votre cave. A ajuster selon vos preferences."
  };
}

function renderWineAdviceResult(result) {
  elements.adviceResult.innerHTML = `
    ${result.recommendations.map((item) => `
      <div class="advice-card">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.reason)}</p>
        <p>${escapeHtml(item.servingAdvice)}</p>
      </div>
    `).join("")}
    <p>${escapeHtml(result.generalAdvice || "Conseil genere a partir des informations de votre cave. A ajuster selon vos preferences.")}</p>
  `;
}

function renderWineAdviceError(error) {
  elements.adviceResult.innerHTML = `<div class="advice-card"><strong>Conseil indisponible</strong><p>${escapeHtml(error)}</p></div>`;
}

// Outils beta, sauvegarde et diagnostics
function exportBackup(reason = "manuel") {
  const backup = {
    app: "Cave a vin",
    version: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    reason,
    createdAt: new Date().toISOString(),
    wines,
    movements,
    wishlist,
    tastingNotes
  };
  localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  return backup;
}

function createManualBackup() {
  const backup = exportBackup("manuel");
  downloadFile(JSON.stringify(backup, null, 2), `cave-a-vin-backup-${today()}.json`, "application/json");
  modificationsSinceBackup = 0;
  localStorage.setItem(MODIFICATION_COUNT_KEY, "0");
  renderBetaState();
  showStatus("Sauvegarde creee.");
}

function restoreBackupFromFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  readTextFile(file, async (text) => {
    try {
      const backup = JSON.parse(text);
      if (!Array.isArray(backup.wines)) throw new Error("Fichier de sauvegarde invalide.");
      const confirmed = await askConfirmation("Restaurer une sauvegarde", "Cette restauration remplacera les donnees locales actuelles.", "Restaurer");
      if (!confirmed) return;
      exportBackup("avant-restauration");
      wines = backup.wines.map(normalizeWine);
      movements = Array.isArray(backup.movements) ? backup.movements.map(normalizeMovement) : [];
      wishlist = Array.isArray(backup.wishlist) ? backup.wishlist.map(normalizeWish) : [];
      tastingNotes = Array.isArray(backup.tastingNotes) ? backup.tastingNotes.map(normalizeTastingNote) : [];
      addMovement("restauration", {}, { label: "Restauration d'une sauvegarde", quantityChange: 0 });
      saveCellar(wines);
      saveMovements(movements);
      saveWishlist(wishlist);
      saveTastingNotes(tastingNotes);
      render();
      showStatus("Sauvegarde restauree.");
    } catch (error) {
      showStatus(`Restauration impossible: ${error.message}`, "error");
    } finally {
      elements.restoreBackupInput.value = "";
    }
  });
}

async function clearAllData() {
  const first = await askConfirmation("Supprimer toutes les donnees", "Cette action cree d'abord une sauvegarde locale, puis supprime la cave, la wishlist, les notes et l'historique.", "Continuer");
  if (!first) return;
  const second = await askConfirmation("Derniere confirmation", "Confirme la suppression definitive des donnees locales.", "Tout supprimer");
  if (!second) return;
  exportBackup("avant-suppression-totale");
  wines = [];
  movements = [];
  wishlist = [];
  tastingNotes = [];
  saveCellar(wines);
  saveMovements(movements);
  saveWishlist(wishlist);
  saveTastingNotes(tastingNotes);
  render();
  showStatus("Toutes les donnees locales ont ete supprimees.");
}

function exportDiagnostic() {
  const diagnostic = {
    appVersion: APP_VERSION,
    userAgent: navigator.userAgent,
    date: new Date().toISOString(),
    wines: wines.length,
    movements: movements.length,
    wishlist: wishlist.length,
    tastingNotes: tastingNotes.length,
    storageBytes: estimateStorageSize(),
    serviceWorker: Boolean(navigator.serviceWorker?.controller),
    errors: errorLogs.slice(0, 20)
  };
  downloadFile(JSON.stringify(diagnostic, null, 2), `cave-a-vin-diagnostic-${today()}.json`, "application/json");
  showStatus("Diagnostic exporte.");
}

function exportFeedback(event) {
  event.preventDefault();
  const feedback = getFeedbackPayload();
  downloadFile(JSON.stringify(feedback, null, 2), `cave-a-vin-feedback-${today()}.json`, "application/json");
  elements.feedbackDialog.close();
  showStatus("Merci, avis exporte.");
}

function openFeedbackMail() {
  const feedback = getFeedbackPayload();
  const subject = encodeURIComponent(`Feedback Cave a vin ${APP_VERSION}`);
  const body = encodeURIComponent(JSON.stringify(feedback, null, 2));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function getFeedbackPayload() {
  return {
    satisfaction: feedbackFields.satisfaction.value,
    bug: feedbackFields.bug.value,
    suggestion: feedbackFields.suggestion.value,
    browser: navigator.userAgent,
    date: new Date().toISOString(),
    appVersion: APP_VERSION
  };
}

function logError(error, context = "") {
  const normalized = normalizeErrorLog({
    context,
    message: error?.message || String(error || "Erreur inconnue"),
    stack: error?.stack || ""
  });
  errorLogs = [normalized, ...errorLogs].slice(0, 50);
  saveErrorLogs(errorLogs);
}

function exportErrorLogs() {
  downloadFile(JSON.stringify(errorLogs, null, 2), `cave-a-vin-erreurs-${today()}.json`, "application/json");
}

function trackModification() {
  modificationsSinceBackup += 1;
  localStorage.setItem(MODIFICATION_COUNT_KEY, String(modificationsSinceBackup));
  if (modificationsSinceBackup >= 8) {
    showStatus("Pense a creer une sauvegarde de ta cave.", "success", { label: "Sauvegarder", action: createManualBackup });
  }
}

function undoLastAction() {
  if (!lastUndo) return;
  lastUndo();
  lastUndo = null;
  showStatus("Action annulee.");
}

function askConfirmation(title, message, okLabel = "Confirmer") {
  return new Promise((resolve) => {
    pendingConfirm = resolve;
    elements.confirmTitle.textContent = title;
    elements.confirmMessage.textContent = message;
    elements.confirmOkButton.textContent = okLabel;
    elements.confirmDialog.showModal();
  });
}

function resolveConfirm(value) {
  elements.confirmDialog.close();
  if (pendingConfirm) pendingConfirm(value);
  pendingConfirm = null;
}

// Mouvements
function addMovement(typeOrWineId, wineOrType, detailsOrLabel = {}, quantityChange = 0) {
  let type;
  let wine;
  let details;

  if (typeof wineOrType === "string") {
    wine = wines.find((item) => item.id === typeOrWineId) || { id: typeOrWineId };
    type = wineOrType;
    details = { label: detailsOrLabel, quantityChange };
  } else {
    type = typeOrWineId;
    wine = wineOrType || {};
    details = detailsOrLabel || {};
  }

  movements = [
    normalizeMovement({
      id: crypto.randomUUID(),
      wineId: wine.id || "",
      type,
      date: new Date().toISOString(),
      label: details.label || `${type} ${wine.domain || ""}`.trim(),
      quantityChange: details.quantityChange || 0,
      snapshot: wine.id ? {
        id: wine.id,
        domain: wine.domain,
        cuvee: wine.cuvee,
        vintage: wine.vintage,
        quantity: wine.quantity
      } : null
    }),
    ...movements
  ].slice(0, 300);
}

// Alertes
function getAlerts() {
  const alerts = [];
  const active = wines.filter((wine) => !["bu", "vendu", "offert"].includes(wine.status));

  active.forEach((wine) => {
    const status = drinkStatus(wine);
    if (status.state === "ready") {
      alerts.push({ type: "ready", severity: "info", title: "Pret a boire", message: `${wineName(wine)} est dans sa fenetre ideale.`, wineId: wine.id });
    }
    if (status.state === "soon") {
      alerts.push({ type: "soon", severity: "warning", title: "A boire bientot", message: `${wineName(wine)} arrive bientot a maturite.`, wineId: wine.id });
    }
    if (status.state === "late") {
      alerts.push({ type: "expired", severity: "danger", title: "Fenetre depassee", message: `${wineName(wine)} depasse sa fin conseillee (${wine.drinkTo}).`, wineId: wine.id });
    }
    if (wine.quantity <= 1) {
      alerts.push({ type: "low-stock", severity: "warning", title: "Stock faible", message: `${wineName(wine)}: ${wine.quantity} bouteille restante.`, wineId: wine.id });
    }
    if (bottleValue(wine) >= 250 || wine.estimatedValue >= 100) {
      alerts.push({ type: "high-value", severity: "info", title: "Valeur elevee", message: `${wineName(wine)} vaut environ ${formatMoney(bottleValue(wine))}.`, wineId: wine.id });
    }
    if (wine.drinkTo && wine.drinkTo - currentYear <= 1 && wine.drinkTo >= currentYear) {
      alerts.push({ type: "drink-window-end", severity: "warning", title: "Fenetre proche de la fin", message: `${wineName(wine)} est a boire avant ${wine.drinkTo}.`, wineId: wine.id });
    }
    if (!getWineLocationLabel(wine)) {
      alerts.push({ type: "missing-location", severity: "warning", title: "Emplacement manquant", message: `${wineName(wine)} n'a pas encore d'emplacement precis.`, wineId: wine.id });
    }
    if (!wine.region || !wine.purchasePrice || !wine.estimatedValue) {
      alerts.push({ type: "incomplete-data", severity: "info", title: "Donnees incompletes", message: `${wineName(wine)} merite quelques informations en plus.`, wineId: wine.id });
    }
  });

  getLocationConflicts().forEach(([key, conflictWines]) => {
    alerts.push({
      type: "location-conflict",
      severity: "warning",
      title: "Emplacement partage",
      message: `${conflictWines.length} references utilisent ${key}.`,
      wineId: conflictWines[0]?.id
    });
  });

  return alerts.sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity));
}

// Helpers metier
function drinkStatus(wine) {
  const from = Number(wine.drinkFrom || 0);
  const to = Number(wine.drinkTo || 0);

  if (to && currentYear > to) {
    return { state: "late", label: "Depasse", sentence: `La fenetre conseillee se terminait en ${to}.` };
  }
  if (to && currentYear >= to - 1) {
    return { state: "soon", label: "Bientot", sentence: `A boire bientot, jusqu'en ${to}.` };
  }
  if (from && currentYear < from) {
    return { state: "wait", label: "A garder", sentence: `Patience jusqu'en ${from}.` };
  }
  return { state: "ready", label: "Pret", sentence: to ? `Ideal maintenant, jusqu'en ${to}.` : "Pret a deguster." };
}

function wineName(wine) {
  return `${wine.domain} - ${wine.cuvee}`;
}

function bottleValue(wine) {
  return Number(wine.quantity || 0) * Number(wine.estimatedValue || wine.price || 0);
}

function formatLocation(wine) {
  const structured = [wine.cellarName, wine.rack && `casier ${wine.rack}`, wine.row && `rangee ${wine.row}`, wine.column && `colonne ${wine.column}`].filter(Boolean).join(" · ");
  return structured || wine.location || "";
}

function locationKey(wine) {
  return [wine.cellarName, wine.rack, wine.row, wine.column].map((value) => cleanString(value).toLowerCase()).join("|");
}

function getLocationConflicts() {
  const map = new Map();
  wines.forEach((wine) => {
    const key = locationKey(wine);
    if (key.replaceAll("|", "")) {
      map.set(key, [...(map.get(key) || []), wine]);
    }
  });
  return [...map.entries()].filter(([, items]) => items.length > 1);
}

function hasLocationConflict(wine) {
  const key = locationKey(wine);
  return Boolean(key.replaceAll("|", "")) && wines.filter((item) => item.id !== wine.id && locationKey(item) === key).length > 0;
}

function getTopValuedWines() {
  return [...wines].sort((a, b) => bottleValue(b) - bottleValue(a)).slice(0, 5);
}

// Helpers CSV
function csvValue(wine, column) {
  if (column === "tags") return wine.tags.join(",");
  if (column === "favorite") return wine.favorite ? "true" : "false";
  return wine[column] ?? "";
}

function formatCsvValue(value) {
  const text = String(value ?? "");
  if (/[;,"\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function parseCsv(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  const delimiter = firstLine.includes(";") ? ";" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted && char === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === delimiter) {
      row.push(cell);
      cell = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((line) => line.some((value) => value.trim()));
}

function rowToWine(headers, row) {
  const data = {};
  headers.forEach((header, index) => {
    data[header] = row[index] || "";
  });
  data.tags = data.tags ? data.tags.split(",") : [];
  data.favorite = String(data.favorite).toLowerCase() === "true";
  return normalizeWine(data);
}

function getWineLocationLabel(wine) {
  return formatLocation(wine);
}

function getDrinkPriorityScore(wine) {
  const status = drinkStatus(wine);
  let score = 0;
  if (status.state === "late") score += 90;
  if (status.state === "soon") score += 70;
  if (status.state === "ready") score += 55;
  if (status.state === "wait") score += 10;
  if (wine.drinkTo) score += Math.max(0, 25 - Math.abs(wine.drinkTo - currentYear) * 4);
  if (wine.quantity <= 1) score += 8;
  if (wine.estimatedValue > 80) score += 6;
  if (wine.favorite) score += 5;
  return Math.round(score);
}

function getDrinkPriorityLabel(wine) {
  const score = getDrinkPriorityScore(wine);
  if (score >= 90) return "Priorite tres haute";
  if (score >= 70) return "Priorite haute";
  if (score >= 45) return "Bonne fenetre";
  return "Peut attendre";
}

function priorityLabel(priority) {
  return { high: "Priorite haute", medium: "Priorite moyenne", low: "Priorite basse" }[priority] || "Priorite moyenne";
}

function sumValueBy(items, key) {
  return items.reduce((result, item) => {
    const label = item[key] || "Non renseigne";
    result[label] = (result[label] || 0) + bottleValue(item);
    return result;
  }, {});
}

function estimateStorageSize() {
  let total = 0;
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    total += key.length + String(localStorage.getItem(key) || "").length;
  }
  return total * 2;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Helpers generiques
function cleanString(value) {
  return String(value ?? "").trim();
}

function normalizeTags(value) {
  if (Array.isArray(value)) return uniqueValues(value.map(cleanString).filter(Boolean));
  return uniqueValues(String(value || "").split(",").map(cleanString).filter(Boolean));
}

function normalizeColor(value) {
  const normalized = cleanString(value).replace("Rosé", "Rose");
  return COLORS.includes(normalized) ? normalized : "Rouge";
}

function normalizeStatus(value, quantity) {
  const normalized = cleanString(value).replace("réservé", "reserve");
  if (STATUSES.includes(normalized)) return normalized;
  return quantity <= 0 ? "bu" : "en cave";
}

function normalizeVintage(value) {
  const year = toNumber(value, 0);
  if (!year) return 0;
  return clamp(Math.round(year), 1900, 2100);
}

function normalizeYear(value) {
  const year = toNumber(value, 0);
  if (!year) return 0;
  return clamp(Math.round(year), 1900, 2100);
}

function toNumber(value, fallback = 0) {
  const number = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "fr"));
}

function updateSelectOptions(select, values, allLabel, allValue) {
  const current = select.value;
  select.innerHTML = `<option value="${allValue}">${allLabel}</option>` + values.map((value) => `<option value="${escapeAttribute(value)}">${escapeHtml(value)}</option>`).join("");
  select.value = values.includes(current) ? current : allValue;
}

function countBy(items, key) {
  return items.reduce((result, item) => {
    const value = item[key] || "Non renseigne";
    result[value] = (result[value] || 0) + Number(item.quantity || 0);
    return result;
  }, {});
}

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDateTime(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function severityWeight(severity) {
  return { danger: 3, warning: 2, info: 1 }[severity] || 0;
}

function readTextFile(file, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(String(reader.result)));
  reader.addEventListener("error", () => showStatus("Impossible de lire ce fichier.", "error"));
  reader.readAsText(file);
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function showStatus(message, type = "success", action = null) {
  elements.statusMessage.innerHTML = `${escapeHtml(message)}${action ? ` <button class="toast-action" type="button">${escapeHtml(action.label)}</button>` : ""}`;
  elements.statusMessage.classList.toggle("error", type === "error");
  const actionButton = elements.statusMessage.querySelector(".toast-action");
  if (actionButton) {
    actionButton.addEventListener("click", action.action);
  }
  window.clearTimeout(showStatus.timeoutId);
  showStatus.timeoutId = window.setTimeout(() => {
    elements.statusMessage.innerHTML = "";
    elements.statusMessage.classList.remove("error");
  }, 4500);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
