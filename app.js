// Constantes
const STORAGE_KEY = "mini-cave-a-vin";
const MOVEMENTS_KEY = "mini-cave-a-vin-movements";
const WISHLIST_KEY = "mini-cave-a-vin-wishlist";
const TASTING_NOTES_KEY = "mini-cave-a-vin-tasting-notes";
const ERROR_LOGS_KEY = "mini-cave-a-vin-error-logs";
const BACKUP_KEY = "mini-cave-a-vin-last-backup";
const MODIFICATION_COUNT_KEY = "mini-cave-a-vin-modification-count";
const UI_PREFS_KEY = "mini-cave-a-vin-ui-preferences";
const LIBRARY_KEY = "mini-cave-a-vin-library";
const LIBRARY_SYNC_QUEUE_KEY = "mini-cave-a-vin-library-sync-queue";
const CELLAR_LAYOUTS_KEY = "mini-cave-a-vin-layouts";
const AI_QUEUE_KEY = "mini-cave-a-vin-ai-enrichment-queue";
const ADVICE_FEEDBACK_KEY = "mini-cave-a-vin-advice-feedback";
const SUBSCRIPTION_KEY = "mini-cave-a-vin-subscription";
const MIGRATION_STATE_KEY = "mini-cave-a-vin-migration-state";
const AUTH_STATE_KEY = "mini-cave-a-vin-auth-state";
const CLOUD_SYNC_STATE_KEY = "mini-cave-a-vin-cloud-sync-state";
const UI_PREFS_LEGACY_KEYS = ["mini-cave-a-vin-ui-pr\u003ff\u003frences", "mini-cave-a-vin-ui-préférences"];
const APP_VERSION = "bêta 0.1.0";
const SCHEMA_VERSION = 4;
const PHOTO_WARNING_BYTES = 900000;
const FILTER_RENDER_DELAY = 180;
const DEBUG_PERF = false;
const DATA_MIGRATION_VERSION = 4;
const VISIBLE_WINE_PAGE_SIZE = 36;
const DASHBOARD_WINE_LIMIT = 4;
const CLOUD_REQUEST_TIMEOUT = 9000;
const CLOUD_SYNC_DEBOUNCE = 1800;
const SUPABASE_CDN_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const currentYear = new Date().getFullYear();

const VALID_VIEWS = ["dashboard", "inventory", "cellar", "advice", "assistant", "wishlist", "history", "stats", "library", "scanner", "subscription", "account", "tools", "settings"];
const CLIENT_VISIBLE_VIEWS = ["dashboard", "inventory", "cellar", "advice", "assistant", "scanner", "wishlist", "history", "stats", "library", "account", "tools"];
const CLIENT_VISIBLE_NAV_KEYS = [...CLIENT_VISIBLE_VIEWS, "imports"];
const DEFAULT_UI_PREFERENCES = {
  activeView: "",
  activeNavKey: "",
  sidebarCollapsed: false,
  density: "balanced",
  cardStyle: "premium",
  background: "vine",
  motion: "normal",
  textScale: "normal",
  theme: "light",
  sidebarMode: "open",
  defaultView: "dashboard",
  showInventoryWidget: true,
  showAdviceWidget: true,
  showAssistantWidget: true,
  cellarSlotSize: "medium",
  cellarShowLabels: true,
  cellarColorMode: "marked",
  cellarViewStyle: "premium",
  cellarShowEmptySlots: true
};
const COLORS = ["Rouge", "Blanc", "Rose", "Effervescent", "Liquoreux"];
const STATUSES = ["en cave", "bu", "vendu", "offert", "reserve"];
const FORMATS = ["37.5cl", "75cl", "Magnum", "Jeroboam", "autre"];
const SUPPLIERS = ["", "caviste", "domaine", "grande distribution", "encheres", "autre"];
const LIBRARY_COLORS = [...COLORS, "Inconnu"];
const LIBRARY_REQUIRED_AI_FIELDS = [
  { key: "foodPairings", label: "accords mets-vins", type: "array" },
  { key: "servingTemperature", label: "temperature de service", type: "string" },
  { key: "openingAdvice", label: "conseil d'ouverture", type: "string" },
  { key: "drinkFrom", label: "debut de fenetre", type: "year" },
  { key: "drinkTo", label: "fin de fenetre", type: "year" },
  { key: "body", label: "corps", type: "enum", emptyValue: "unknown" },
  { key: "tannins", label: "tanins", type: "enum", emptyValue: "unknown" },
  { key: "acidity", label: "acidite", type: "enum", emptyValue: "unknown" },
  { key: "sweetness", label: "sucre", type: "enum", emptyValue: "unknown" },
  { key: "bestOccasions", label: "occasions", type: "array" }
];
const WINE_ADVICE_RESPONSE_SCHEMA = {
  recommendations: [{
    wineId: "string",
    title: "string",
    reason: "string",
    servingAdvice: "string",
    foodPairing: "string",
    confidence: "low|medium|high"
  }],
  generalAdvice: "string"
};
const WINE_REFERENCE_ENRICHMENT_SCHEMA = {
  referenceId: "string",
  fields: {
    foodPairings: ["string"],
    servingTemperature: "string",
    openingAdvice: "string",
    decantingTime: "number",
    drinkFrom: "number",
    drinkTo: "number",
    agingPotential: "string",
    body: "light|medium|full|unknown",
    tannins: "low|medium|high|unknown",
    acidity: "low|medium|high|unknown",
    sweetness: "dry|off-dry|sweet|unknown",
    bestOccasions: ["string"]
  },
  confidenceScore: "number",
  dataSource: "ai|ai_web|admin"
};
const DEFAULT_SUBSCRIPTION_STATE = {
  plan: "free",
  billingCycle: null,
  scanCredits: 3,
  monthlyScanLimit: 3,
  usedScansThisMonth: 0,
  renewalDate: null,
  isPaymentConfigured: false,
  lastUsageReset: today().slice(0, 7)
};
const PRICING_PLANS = [
  {
    id: "free",
    name: "Gratuit",
    monthlyPrice: "0 €",
    yearlyPrice: "0 €",
    bottleLimit: 50,
    scanLimit: 3,
    badge: "Local",
    features: ["50 bouteilles", "3 scans IA / mois", "Bibliothèque personnelle", "Exports JSON et CSV"]
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: "4,99 €/mois",
    yearlyPrice: "39,99 €/an",
    bottleLimit: Infinity,
    scanLimit: 20,
    badge: "Recommandé",
    recommended: true,
    features: ["Bouteilles illimitées", "20 scans IA / mois", "Sommelier personnel", "Stats avancées", "Sauvegarde cloud future"]
  },
  {
    id: "premium_plus",
    name: "Premium Plus",
    monthlyPrice: "7,99 €/mois",
    yearlyPrice: "69,99 €/an",
    bottleLimit: Infinity,
    scanLimit: 60,
    badge: "Intensif",
    features: ["Tout Premium", "Scans IA renforcés", "Recommandations avancées", "Multi-caves futur"]
  },
  {
    id: "family",
    name: "Famille",
    monthlyPrice: "9,99 €/mois",
    yearlyPrice: "89,99 €/an",
    bottleLimit: Infinity,
    scanLimit: 80,
    badge: "Partage",
    features: ["Cave partagée future", "Plusieurs utilisateurs", "Rôles", "Historique collaboratif"]
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "19,99 à 49,99 €/mois",
    yearlyPrice: "Sur devis",
    bottleLimit: Infinity,
    scanLimit: 200,
    badge: "Professionnel",
    features: ["Restaurants et cavistes", "Exports avancés", "Multi-utilisateurs", "Gestion professionnelle"]
  }
];
const SCAN_PACKS = [
  { id: "scan_10", scans: 10, price: "1,99 €", label: "10 scans" },
  { id: "scan_50", scans: 50, price: "6,99 €", label: "50 scans" },
  { id: "scan_100", scans: 100, price: "11,99 €", label: "100 scans" }
];
const CSV_COLUMNS = [
  "domain", "cuvee", "color", "region", "appellation", "vintage", "quantity",
  "format", "status", "price", "purchasePrice", "estimatedValue", "drinkFrom",
  "drinkTo", "cellarName", "rack", "row", "column", "location", "tags",
  "favorite", "rating", "purchaseDate", "supplier", "consumedAt", "cellarLayoutId",
  "slotId", "level", "positionLabel", "notes"
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
    notes: "À garder pour poissons nobles, volailles crémées ou fromages affinés."
  },
  {
    domain: "Château Poujeaux",
    cuvee: "Grand vin",
    color: "Rouge",
    region: "Bordeaux",
    appellation: "Moulis-en-Médoc",
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
    notes: "Structure encore présente, parfait avec une côte de boeuf."
  },
  {
    domain: "Champagne Billecart-Salmon",
    cuvee: "Brut Réserve",
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
    tags: ["apéritif"],
    notes: "Bouteilles prêtes pour apéritif ou grande occasion improvisée."
  },
  {
    domain: "Domaine Tempier",
    cuvee: "La Migoua",
    color: "Rouge",
    region: "Provence",
    appellation: "Bandol",
    vintage: 2019,
    quantity: 2,
    price: 38,
    purchasePrice: 38,
    estimatedValue: 46,
    drinkFrom: 2025,
    drinkTo: 2034,
    cellarName: "Cave principale",
    rack: "B1",
    row: "1",
    column: "2",
    tags: ["garde", "rouge"],
    notes: "Rouge de caractère pour agneau, gibier ou repas d'hiver."
  },
  {
    domain: "Clos Rougeard",
    cuvee: "Les Poyeux",
    color: "Rouge",
    region: "Loire",
    appellation: "Saumur-Champigny",
    vintage: 2017,
    quantity: 1,
    price: 160,
    purchasePrice: 160,
    estimatedValue: 260,
    drinkFrom: 2026,
    drinkTo: 2037,
    cellarName: "Cave principale",
    rack: "C1",
    row: "1",
    column: "1",
    tags: ["prestige", "cabernet franc"],
    notes: "À garder pour une très belle occasion."
  },
  {
    domain: "Domaine Huet",
    cuvee: "Le Mont Sec",
    color: "Blanc",
    region: "Loire",
    appellation: "Vouvray",
    vintage: 2021,
    quantity: 3,
    price: 29,
    purchasePrice: 29,
    estimatedValue: 34,
    drinkFrom: 2024,
    drinkTo: 2031,
    cellarName: "Armoire de service",
    rack: "Milieu",
    row: "2",
    column: "3",
    tags: ["blanc", "chenin"],
    notes: "Très bien sur poissons, fromages de chèvre et cuisine crémée."
  },
  {
    domain: "Château de Beaucastel",
    cuvee: "Châteauneuf-du-Pape",
    color: "Rouge",
    region: "Rhône",
    appellation: "Châteauneuf-du-Pape",
    vintage: 2018,
    quantity: 2,
    price: 72,
    purchasePrice: 72,
    estimatedValue: 88,
    drinkFrom: 2024,
    drinkTo: 2033,
    cellarName: "Cave principale",
    rack: "D2",
    row: "3",
    column: "4",
    tags: ["rhône", "garde"],
    notes: "Déjà abordable, mais peut encore gagner en complexité."
  },
  {
    domain: "Domaine Zind-Humbrecht",
    cuvee: "Riesling Roche Calcaire",
    color: "Blanc",
    region: "Alsace",
    appellation: "Alsace",
    vintage: 2022,
    quantity: 4,
    price: 24,
    purchasePrice: 24,
    estimatedValue: 27,
    drinkFrom: 2024,
    drinkTo: 2029,
    cellarName: "Armoire de service",
    rack: "Bas",
    row: "1",
    column: "5",
    tags: ["riesling", "poisson"],
    notes: "Acidité nette, parfait pour fruits de mer ou cuisine asiatique."
  },
  {
    domain: "Château d'Yquem",
    cuvee: "Sauternes",
    color: "Liquoreux",
    region: "Bordeaux",
    appellation: "Sauternes",
    vintage: 2009,
    quantity: 1,
    price: 310,
    purchasePrice: 310,
    estimatedValue: 420,
    drinkFrom: 2024,
    drinkTo: 2045,
    cellarName: "Cave principale",
    rack: "Prestige",
    row: "1",
    column: "1",
    tags: ["dessert", "prestige"],
    notes: "À réserver pour dessert noble ou fromage persillé."
  },
  {
    domain: "Domaine Ott",
    cuvee: "Clos Mireille",
    color: "Rose",
    region: "Provence",
    appellation: "Côtes de Provence",
    vintage: 2023,
    quantity: 5,
    price: 22,
    purchasePrice: 22,
    estimatedValue: 22,
    drinkFrom: currentYear,
    drinkTo: currentYear + 1,
    cellarName: "Armoire de service",
    rack: "Haut",
    row: "",
    column: "",
    tags: ["été", "rosé"],
    notes: "À boire jeune, apéritif, grillades et salades."
  },
  {
    domain: "Jacquesson",
    cuvee: "Cuvée 746",
    color: "Effervescent",
    region: "Champagne",
    appellation: "Champagne",
    vintage: 0,
    quantity: 2,
    price: 58,
    purchasePrice: 58,
    estimatedValue: 62,
    drinkFrom: currentYear,
    drinkTo: currentYear + 4,
    cellarName: "Armoire de service",
    rack: "Haut",
    row: "",
    column: "",
    tags: ["champagne", "apéritif"],
    notes: "Pour apéritif précis, fruits de mer ou grande occasion."
  },
  {
    domain: "Domaine des Ardoisières",
    cuvee: "Argile Blanc",
    color: "Blanc",
    region: "Savoie",
    appellation: "Vin de Savoie",
    vintage: 2022,
    quantity: 3,
    price: 31,
    purchasePrice: 31,
    estimatedValue: 35,
    drinkFrom: 2024,
    drinkTo: 2028,
    cellarName: "Cave principale",
    rack: "A2",
    row: "2",
    column: "2",
    tags: ["montagne", "blanc"],
    notes: "Minéral, énergique, idéal raclette moderne ou poisson."
  },
  {
    domain: "Château Montus",
    cuvee: "Prestige",
    color: "Rouge",
    region: "Sud-Ouest",
    appellation: "Madiran",
    vintage: 2015,
    quantity: 2,
    price: 44,
    purchasePrice: 44,
    estimatedValue: 55,
    drinkFrom: 2022,
    drinkTo: 2030,
    cellarName: "Cave principale",
    rack: "D1",
    row: "2",
    column: "6",
    tags: ["tannique", "rouge"],
    notes: "Puissant, à carafer avec viande rouge."
  },
  {
    domain: "Domaine de la Janasse",
    cuvee: "Terre d'Argile",
    color: "Rouge",
    region: "Rhône",
    appellation: "Côtes du Rhône Villages",
    vintage: 2020,
    quantity: 6,
    price: 18,
    purchasePrice: 18,
    estimatedValue: 22,
    drinkFrom: 2023,
    drinkTo: 2028,
    cellarName: "Cave secondaire",
    rack: "A",
    row: "1",
    column: "1",
    tags: ["quotidien", "rouge"],
    notes: "Très bon rapport plaisir/prix pour repas simples."
  },
  {
    domain: "Marcel Deiss",
    cuvee: "Engelgarten",
    color: "Blanc",
    region: "Alsace",
    appellation: "Alsace",
    vintage: 2019,
    quantity: 2,
    price: 36,
    purchasePrice: 36,
    estimatedValue: 42,
    drinkFrom: 2023,
    drinkTo: 2030,
    cellarName: "Cave principale",
    rack: "B2",
    row: "1",
    column: "3",
    tags: ["gastronomie", "blanc"],
    notes: "Blanc de gastronomie, très polyvalent."
  },
  {
    domain: "Château Simone",
    cuvee: "Palette Rosé",
    color: "Rose",
    region: "Provence",
    appellation: "Palette",
    vintage: 2021,
    quantity: 2,
    price: 39,
    purchasePrice: 39,
    estimatedValue: 48,
    drinkFrom: 2024,
    drinkTo: 2029,
    cellarName: "Cave principale",
    rack: "B3",
    row: "2",
    column: "5",
    tags: ["rosé", "garde"],
    notes: "Rosé de garde, plus sérieux qu'un rosé d'été."
  },
  {
    domain: "Burlotto",
    cuvee: "Barolo Acclivi",
    color: "Rouge",
    region: "Piémont",
    appellation: "Barolo",
    vintage: 2018,
    quantity: 1,
    price: 95,
    purchasePrice: 95,
    estimatedValue: 130,
    drinkFrom: 2026,
    drinkTo: 2038,
    cellarName: "Cave principale",
    rack: "Italie",
    row: "1",
    column: "2",
    tags: ["italie", "nebbiolo"],
    notes: "À attendre, idéal grande table italienne."
  },
  {
    domain: "Niepoort",
    cuvee: "Vintage Port",
    color: "Liquoreux",
    region: "Douro",
    appellation: "Porto",
    vintage: 2017,
    quantity: 1,
    price: 78,
    purchasePrice: 78,
    estimatedValue: 95,
    drinkFrom: 2030,
    drinkTo: 2050,
    cellarName: "Cave principale",
    rack: "Liquoreux",
    row: "1",
    column: "4",
    tags: ["porto", "dessert"],
    notes: "À oublier quelques années, parfait chocolat noir ou fin de repas."
  }
].map(normalizeWine);

// État
let wines = loadCellar();
let movements = loadMovements();
let wishlist = loadWishlist();
let tastingNotes = loadTastingNotes();
let errorLogs = loadErrorLogs();
let wineLibrary = loadWineLibrary();
let cellarLayouts = loadCellarLayouts();
let aiEnrichmentQueue = loadAiEnrichmentQueue();
let adviceFeedback = loadAdviceFeedback();
let subscriptionState = loadSubscriptionState();
let authState = loadAuthState();
let authSession = { accessToken: "", refreshToken: "" };
let cloudSyncState = loadCloudSyncState();
let uiPreferences = loadUiPreferences();
let preferredActiveView = VALID_VIEWS.includes(uiPreferences.activeView)
  ? uiPreferences.activeView
  : VALID_VIEWS.includes(uiPreferences.defaultView)
    ? uiPreferences.defaultView
    : "dashboard";
let activeView = CLIENT_VISIBLE_VIEWS.includes(preferredActiveView) ? preferredActiveView : "dashboard";
let activeNavKey = CLIENT_VISIBLE_NAV_KEYS.includes(uiPreferences.activeNavKey) ? uiPreferences.activeNavKey : activeView;
let modificationsSinceBackup = toNumber(localStorage.getItem(MODIFICATION_COUNT_KEY), 0);
let deferredInstallPrompt = null;
let pendingConfirm = null;
let lastUndo = null;
let renderTimer = null;
let renderFrameId = 0;
let pendingRenderTargets = new Set();
let filterCache = { key: "", result: [] };
let computedWineMap = new Map();
let locationConflictMap = new Map();
let librarySearchIndex = new Map();
let libraryDuplicateMap = new Map();
let librarySearchTimer = null;
let libraryRemoteState = {
  isLoading: false,
  loaded: false,
  lastQuery: "",
  lastLoadedAt: "",
  lastError: "",
  lastCount: 0
};
let pendingLibrarySyncQueue = loadPendingLibrarySyncQueue();
let cellarLayoutCache = {
  layoutsById: new Map(),
  slotsById: new Map(),
  winesBySlot: new Map(),
  unplacedWines: []
};
let activeCellarLayoutId = cellarLayouts[0]?.id || "";
let cellarMoveMode = { enabled: false, selectedWineId: "", sourceSlotId: "" };
let slotPickerState = { active: false, wineId: "" };
let lastAdviceResult = null;
let visibleWineLimit = VISIBLE_WINE_PAGE_SIZE;
let cloudConfig = getCloudConfig();
let supabaseClient = null;
let supabaseInitPromise = null;
let supabaseAuthSubscription = null;
let cloudSyncTimer = null;
let isApplyingCloudSnapshot = false;
let cloudHydrationPromise = null;
let scanState = {
  imageFile: null,
  imageDataUrl: "",
  imageThumbDataUrl: "",
  result: null,
  isLoading: false
};

// Selection DOM
const elements = {
  appLayout: document.querySelector("#appLayout"),
  appSidebar: document.querySelector("#appSidebar"),
  sidebarBackdrop: document.querySelector("#sidebarBackdrop"),
  mobileMenuButton: document.querySelector("#mobileMenuButton"),
  sidebarCloseButton: document.querySelector("#sidebarCloseButton"),
  sidebarCollapseButton: document.querySelector("#sidebarCollapseButton"),
  sidebarAddButton: document.querySelector("#sidebarAddButton"),
  sidebarPlanBadge: document.querySelector("#sidebarPlanBadge"),
  sidebarScanBadge: document.querySelector("#sidebarScanBadge"),
  sidebarItems: document.querySelectorAll(".sidebar-item"),
  viewSections: document.querySelectorAll("[data-view-section]"),
  dashboardWidgets: document.querySelectorAll("[data-dashboard-widget]"),
  preferenceControls: document.querySelectorAll("[data-ui-preference]"),
  resetPreferencesButton: document.querySelector("#resetPreferencesButton"),
  dialog: document.querySelector("#wineDialog"),
  form: document.querySelector("#wineForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  wineId: document.querySelector("#wineId"),
  openFormButton: document.querySelector("#openFormButton"),
  openAccountButton: document.querySelector("#openAccountButton"),
  openScannerButton: document.querySelector("#openScannerButton"),
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
  librarySuggestions: document.querySelector("#librarySuggestions"),
  librarySearchInput: document.querySelector("#librarySearchInput"),
  libraryColorFilter: document.querySelector("#libraryColorFilter"),
  libraryRegionFilter: document.querySelector("#libraryRegionFilter"),
  libraryAppellationFilter: document.querySelector("#libraryAppellationFilter"),
  libraryList: document.querySelector("#libraryList"),
  libraryCount: document.querySelector("#libraryCount"),
  librarySyncStatus: document.querySelector("#librarySyncStatus"),
  libraryImportButton: document.querySelector("#libraryImportButton"),
  libraryImportFileInput: document.querySelector("#libraryImportFileInput"),
  libraryImportResult: document.querySelector("#libraryImportResult"),
  libraryAdminTools: document.querySelector("#libraryAdminTools"),
  cellarLayoutSelect: document.querySelector("#cellarLayoutSelect"),
  configureCellarButton: document.querySelector("#configureCellarButton"),
  reorganizeCellarButton: document.querySelector("#reorganizeCellarButton"),
  cellarConfigForm: document.querySelector("#cellarConfigForm"),
  cellarLayoutNameInput: document.querySelector("#cellarLayoutNameInput"),
  cellarLayoutTypeInput: document.querySelector("#cellarLayoutTypeInput"),
  cellarLayoutModeInput: document.querySelector("#cellarLayoutModeInput"),
  cellarRowsInput: document.querySelector("#cellarRowsInput"),
  cellarColumnsInput: document.querySelector("#cellarColumnsInput"),
  cellarLevelsInput: document.querySelector("#cellarLevelsInput"),
  cellarSlotCapacityInput: document.querySelector("#cellarSlotCapacityInput"),
  duplicateCellarButton: document.querySelector("#duplicateCellarButton"),
  resetCellarLayoutButton: document.querySelector("#resetCellarLayoutButton"),
  cellarStats: document.querySelector("#cellarStats"),
  cellarLegend: document.querySelector("#cellarLegend"),
  virtualCellarGrid: document.querySelector("#virtualCellarGrid"),
  cellarPreview: document.querySelector("#cellarPreview"),
  openCellarFromDashboard: document.querySelector("#openCellarFromDashboard"),
  unplacedWineList: document.querySelector("#unplacedWineList"),
  unplacedCount: document.querySelector("#unplacedCount"),
  unplacedSearchInput: document.querySelector("#unplacedSearchInput"),
  unplacedColorFilter: document.querySelector("#unplacedColorFilter"),
  scanFileInput: document.querySelector("#scanFileInput"),
  scanPhotoButton: document.querySelector("#scanPhotoButton"),
  scanImportButton: document.querySelector("#scanImportButton"),
  scanAnalyzeButton: document.querySelector("#scanAnalyzeButton"),
  scanPreview: document.querySelector("#scanPreview"),
  scanManualText: document.querySelector("#scanManualText"),
  scanResult: document.querySelector("#scanResult"),
  scanUseButton: document.querySelector("#scanUseButton"),
  scanManualButton: document.querySelector("#scanManualButton"),
  scanCreditsLabel: document.querySelector("#scanCreditsLabel"),
  subscriptionPlanBadge: document.querySelector("#subscriptionPlanBadge"),
  subscriptionScanCredits: document.querySelector("#subscriptionScanCredits"),
  pricingPlans: document.querySelector("#pricingPlans"),
  scanPacks: document.querySelector("#scanPacks"),
  billingPortalButton: document.querySelector("#billingPortalButton"),
  accountStatusCard: document.querySelector("#accountStatusCard"),
  authForms: document.querySelector("#authForms"),
  accountPanel: document.querySelector("#accountPanel"),
  signInForm: document.querySelector("#signInForm"),
  signUpForm: document.querySelector("#signUpForm"),
  signInEmail: document.querySelector("#signInEmail"),
  signInPassword: document.querySelector("#signInPassword"),
  signUpDisplayName: document.querySelector("#signUpDisplayName"),
  signUpEmail: document.querySelector("#signUpEmail"),
  signUpPassword: document.querySelector("#signUpPassword"),
  resetPasswordButton: document.querySelector("#resetPasswordButton"),
  resendConfirmationButton: document.querySelector("#resendConfirmationButton"),
  authHelpMessage: document.querySelector("#authHelpMessage"),
  accountEmail: document.querySelector("#accountEmail"),
  accountProvider: document.querySelector("#accountProvider"),
  cloudConfigStatus: document.querySelector("#cloudConfigStatus"),
  cloudLastSync: document.querySelector("#cloudLastSync"),
  cloudLastError: document.querySelector("#cloudLastError"),
  syncLocalToCloudButton: document.querySelector("#syncLocalToCloudButton"),
  restoreCloudButton: document.querySelector("#restoreCloudButton"),
  refreshCloudButton: document.querySelector("#refreshCloudButton"),
  signOutButton: document.querySelector("#signOutButton"),
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
  photoThumbInputHidden: document.querySelector("#photoThumbInputHidden"),
  cellarLayoutIdInput: document.querySelector("#cellarLayoutIdInput"),
  slotIdInput: document.querySelector("#slotIdInput"),
  positionLabelInput: document.querySelector("#positionLabelInput"),
  selectedSlotLabel: document.querySelector("#selectedSlotLabel"),
  chooseSlotButton: document.querySelector("#chooseSlotButton"),
  clearSlotButton: document.querySelector("#clearSlotButton"),
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
  appVersion: document.querySelector("#appVersion"),
  inventoryTitle: document.querySelector(".inventory-panel .panel-heading h2")
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
installRuntimeGuards();
try {
  migrateAppData();
  cellarLayouts = ensureCellarLayouts(cellarLayouts);
  syncCellarLayoutWithWines({ persist: false });
  rebuildCellarLayoutCache();
  invalidateWineCaches();
  rebuildLibraryDerivedCaches();
  applyInitialUiState();
  bindEvents();
  render({ targets: ["view", "filters"] });
  window.CAVE_CLOUD_CONFIG_READY?.then(() => {
    cloudConfig = getCloudConfig();
    initSupabase()
      .then(() => syncPendingLibraryReferences({ silent: true }))
      .then(() => ensureRemoteLibraryLoaded({ silent: true }))
      .catch((error) => logError(error, "initSupabase"))
      .finally(() => render({ targets: ["account", "sidebar", "library"] }));
  });
} catch (error) {
  logError(error, "bootstrap");
  showStartupError(error);
}

// Evenements
function bindEvents() {
  elements.preferenceControls.forEach((control) => {
    control.addEventListener("change", handlePreferenceChange);
  });
  elements.resetPreferencesButton.addEventListener("click", resetUiPreferences);
  elements.sidebarItems.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveView(button.dataset.view, { navKey: button.dataset.navKey });
    });
  });
  elements.sidebarAddButton.addEventListener("click", () => {
    openForm();
    closeSidebar();
  });
  elements.mobileMenuButton.addEventListener("click", toggleSidebar);
  elements.sidebarBackdrop.addEventListener("click", closeSidebar);
  elements.sidebarCloseButton.addEventListener("click", closeSidebar);
  elements.sidebarCollapseButton.addEventListener("click", () => {
    setSidebarCollapsed(!document.body.classList.contains("sidebar-collapsed"));
  });
  elements.openFormButton.addEventListener("click", () => openForm());
  elements.openAccountButton?.addEventListener("click", () => setActiveView("account", { navKey: "account" }));
  elements.openScannerButton?.addEventListener("click", () => setActiveView("scanner", { navKey: "scanner" }));
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
  elements.wineList.addEventListener("click", handleWineListClick);
  elements.wishlistList.addEventListener("click", handleWishlistListClick);
  elements.libraryList?.addEventListener("click", handleLibraryListClick);
  elements.librarySuggestions?.addEventListener("click", handleLibrarySuggestionsClick);
  elements.pricingPlans?.addEventListener("click", handlePricingClick);
  elements.scanPacks?.addEventListener("click", handleScanPackClick);
  elements.libraryImportButton?.addEventListener("click", () => elements.libraryImportFileInput?.click());
  elements.libraryImportFileInput?.addEventListener("change", handleLibraryImportFile);
  elements.librarySearchInput?.addEventListener("input", handleLibrarySearchInput);
  elements.libraryColorFilter?.addEventListener("input", () => scheduleRender("library"));
  elements.libraryRegionFilter?.addEventListener("input", () => scheduleRender("library"));
  elements.libraryAppellationFilter?.addEventListener("input", () => scheduleRender("library"));
  elements.libraryAdminTools?.addEventListener("click", handleLibraryAdminToolsClick);
  elements.cellarLayoutSelect?.addEventListener("change", () => {
    activeCellarLayoutId = elements.cellarLayoutSelect.value;
    render({ targets: ["cellar"] });
  });
  elements.configureCellarButton?.addEventListener("click", toggleCellarConfigPanel);
  elements.cellarConfigForm?.addEventListener("submit", handleCellarConfigSubmit);
  elements.duplicateCellarButton?.addEventListener("click", duplicateActiveCellarLayout);
  elements.resetCellarLayoutButton?.addEventListener("click", resetActiveCellarLayout);
  elements.reorganizeCellarButton?.addEventListener("click", enableMoveMode);
  elements.openCellarFromDashboard?.addEventListener("click", () => setActiveView("cellar", { navKey: "cellar" }));
  elements.virtualCellarGrid?.addEventListener("click", handleVirtualCellarClick);
  elements.unplacedWineList?.addEventListener("click", handleUnplacedWineClick);
  elements.unplacedSearchInput?.addEventListener("input", () => renderUnplacedWines());
  elements.unplacedColorFilter?.addEventListener("input", () => renderUnplacedWines());
  elements.chooseSlotButton?.addEventListener("click", openSlotPicker);
  elements.clearSlotButton?.addEventListener("click", clearWineSlotSelection);
  elements.adviceResult?.addEventListener("click", handleAdviceFeedbackClick);
  elements.scanPhotoButton?.addEventListener("click", () => elements.scanFileInput?.click());
  elements.scanImportButton?.addEventListener("click", () => elements.scanFileInput?.click());
  elements.scanFileInput?.addEventListener("change", handleScanFileSelection);
  elements.scanAnalyzeButton?.addEventListener("click", () => scanWineLabel(scanState.imageFile));
  elements.scanUseButton?.addEventListener("click", () => applyScanResultToWineForm(scanState.result));
  elements.scanManualButton?.addEventListener("click", () => openForm());
  elements.billingPortalButton?.addEventListener("click", handleBillingPortal);
  elements.signInForm?.addEventListener("submit", (event) => handleAuthSubmit(event, "signin"));
  elements.signUpForm?.addEventListener("submit", (event) => handleAuthSubmit(event, "signup"));
  elements.resetPasswordButton?.addEventListener("click", requestPasswordReset);
  elements.resendConfirmationButton?.addEventListener("click", resendSignupConfirmation);
  elements.syncLocalToCloudButton?.addEventListener("click", syncLocalToCloud);
  elements.restoreCloudButton?.addEventListener("click", restoreFromCloud);
  elements.refreshCloudButton?.addEventListener("click", refreshCloudSession);
  elements.signOutButton?.addEventListener("click", signOut);
  [fields.domain, fields.cuvee].forEach((input) => {
    input.addEventListener("input", handleLibrarySuggestionInput);
  });
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
  window.addEventListener("online", () => {
    if (cloudSyncState.pendingChanges) {
      performCloudAutoSync({ reason: "online", silent: true })
        .catch((error) => logError(error, "onlineSync"));
    }
  });

  [
    elements.searchInput, elements.colorFilter, elements.regionFilter, elements.statusFilter,
    elements.drinkFilter, elements.cellarFilter, elements.rackFilter, elements.tagFilter,
    elements.favoriteFilter, elements.stockFilter, elements.vintageMinFilter,
    elements.vintageMaxFilter, elements.priceMinFilter, elements.priceMaxFilter,
    elements.valueMinFilter, elements.valueMaxFilter,
    elements.sortSelect
  ].forEach((control) => control.addEventListener("input", scheduleFilterRender));

  window.addEventListener("resize", updateSidebarControls);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
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
      navigator.serviceWorker
        .register("./service-worker.js")
        .catch((error) => logError(error, "serviceWorker.register"));
    });
  }
}

function installRuntimeGuards() {
  if (window.__oenovaRuntimeGuardsInstalled) return;
  window.__oenovaRuntimeGuardsInstalled = true;
  window.addEventListener("error", (event) => {
    logError(event.error || event.message, "window.error");
  });
  window.addEventListener("unhandledrejection", (event) => {
    logError(event.reason, "unhandledrejection");
  });
}

function showStartupError(error) {
  if (!elements.statusMessage) return;
  elements.statusMessage.textContent = "Oenova a rencontré une erreur au chargement. Rechargez la page ou exportez le diagnostic si le problème persiste.";
  elements.statusMessage.classList.add("error");
  elements.statusMessage.title = error?.message || String(error || "");
}

// Navigation et preferences UI
function applyInitialUiState() {
  applyUiPreferences();
  syncPreferenceControls();
  renderActiveView();
  updateSidebarControls();
}

function getClientVisibleView(viewName) {
  return CLIENT_VISIBLE_VIEWS.includes(viewName) ? viewName : "dashboard";
}

function setActiveView(viewName, options = {}) {
  measurePerf("setActiveView", () => {
    const requestedView = VALID_VIEWS.includes(viewName) ? viewName : "dashboard";
    const nextView = getClientVisibleView(requestedView);
    activeView = nextView;
    visibleWineLimit = VISIBLE_WINE_PAGE_SIZE;
    activeNavKey = CLIENT_VISIBLE_NAV_KEYS.includes(options.navKey) ? options.navKey : nextView;
    saveUiPreferences();
    closeSidebar();
    if (options.render !== false) render({ targets: ["view"], refreshFilterOptions: false });
    if (nextView === "library") ensureRemoteLibraryLoaded({ silent: true });
  });
}

function renderActiveView() {
  applyUiPreferences();
  VALID_VIEWS.forEach((view) => document.body.classList.remove(`view-${view}`));
  document.body.classList.add(`view-${activeView}`);

  elements.viewSections.forEach((section) => {
    const views = (section.dataset.viewSection || "").split(/\s+/);
    section.hidden = !views.includes(activeView);
  });

  elements.dashboardWidgets.forEach((widget) => {
    if (activeView !== "dashboard") return;
    const key = `show${widget.dataset.dashboardWidget.charAt(0).toUpperCase()}${widget.dataset.dashboardWidget.slice(1)}Widget`;
    if (Object.prototype.hasOwnProperty.call(uiPreferences, key)) {
      widget.hidden = !uiPreferences[key];
    }
  });

  elements.sidebarItems.forEach((button) => {
    const isActive = button.dataset.navKey === activeNavKey && button.dataset.view === activeView;
    button.classList.toggle("is-active", isActive);
    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (elements.inventoryTitle) {
    elements.inventoryTitle.textContent = activeView === "dashboard"
      ? "Aperçu inventaire"
      : activeView === "stats"
        ? "Statistiques détaillées"
        : "Inventaire";
  }
  updateSidebarControls();
}

function toggleSidebar() {
  if (isMobileSidebar()) {
    document.body.classList.toggle("sidebar-open");
    updateSidebarControls();
    return;
  }
  setSidebarCollapsed(!document.body.classList.contains("sidebar-collapsed"));
}

function closeSidebar() {
  if (document.body.classList.contains("sidebar-open")) {
    document.body.classList.remove("sidebar-open");
    updateSidebarControls();
  }
}

function setSidebarCollapsed(isCollapsed) {
  document.body.classList.toggle("sidebar-collapsed", Boolean(isCollapsed));
  uiPreferences.sidebarCollapsed = Boolean(isCollapsed);
  uiPreferences.sidebarMode = isCollapsed ? "collapsed" : "open";
  syncPreferenceControls();
  saveUiPreferences();
  updateSidebarControls();
}

function loadUiPreferences() {
  try {
    const stored = localStorage.getItem(UI_PREFS_KEY)
      || UI_PREFS_LEGACY_KEYS.map((key) => localStorage.getItem(key)).find(Boolean)
      || "{}";
    const parsed = JSON.parse(stored);
    const preferences = parsed && typeof parsed === "object" ? parsed : {};
    return normalizeUiPreferences(preferences);
  } catch {
    return { ...DEFAULT_UI_PREFERENCES };
  }
}

function saveUiPreferences() {
  uiPreferences = {
    ...DEFAULT_UI_PREFERENCES,
    ...uiPreferences,
    activeView,
    activeNavKey,
    sidebarCollapsed: document.body.classList.contains("sidebar-collapsed"),
    sidebarMode: document.body.classList.contains("sidebar-collapsed") ? "collapsed" : "open"
  };
  localStorage.setItem(UI_PREFS_KEY, JSON.stringify(uiPreferences));
}

function normalizeUiPreferences(preferences = {}) {
  const normalized = { ...DEFAULT_UI_PREFERENCES, ...preferences };
  if (!CLIENT_VISIBLE_VIEWS.includes(normalized.activeView)) normalized.activeView = "";
  if (!CLIENT_VISIBLE_VIEWS.includes(normalized.defaultView)) normalized.defaultView = "dashboard";
  if (!CLIENT_VISIBLE_NAV_KEYS.includes(normalized.activeNavKey)) normalized.activeNavKey = normalized.activeView || normalized.defaultView;
  if (!["compact", "balanced", "comfortable"].includes(normalized.density)) normalized.density = "balanced";
  if (!["classic", "premium", "visual"].includes(normalized.cardStyle)) normalized.cardStyle = "premium";
  if (!["static", "subtle", "vine"].includes(normalized.background)) normalized.background = "vine";
  if (!["low", "normal", "off"].includes(normalized.motion)) normalized.motion = "normal";
  if (!["small", "normal", "large"].includes(normalized.textScale)) normalized.textScale = "normal";
  if (!["light", "dark"].includes(normalized.theme)) normalized.theme = "light";
  normalized.sidebarMode = normalized.sidebarCollapsed ? "collapsed" : "open";
  normalized.showInventoryWidget = normalized.showInventoryWidget !== false;
  normalized.showAdviceWidget = normalized.showAdviceWidget !== false;
  normalized.showAssistantWidget = normalized.showAssistantWidget !== false;
  if (!["small", "medium", "large"].includes(normalized.cellarSlotSize)) normalized.cellarSlotSize = "medium";
  normalized.cellarShowLabels = normalized.cellarShowLabels !== false;
  if (!["subtle", "marked"].includes(normalized.cellarColorMode)) normalized.cellarColorMode = "marked";
  if (!["compact", "premium"].includes(normalized.cellarViewStyle)) normalized.cellarViewStyle = "premium";
  normalized.cellarShowEmptySlots = normalized.cellarShowEmptySlots !== false;
  return normalized;
}

function applyUiPreferences() {
  document.body.dataset.density = uiPreferences.density;
  document.body.dataset.cardStyle = uiPreferences.cardStyle;
  document.body.dataset.background = uiPreferences.background;
  document.body.dataset.motion = uiPreferences.motion;
  document.body.dataset.textScale = uiPreferences.textScale;
  document.body.dataset.theme = uiPreferences.theme;
  document.body.dataset.cellarSlotSize = uiPreferences.cellarSlotSize;
  document.body.dataset.cellarColorMode = uiPreferences.cellarColorMode;
  document.body.dataset.cellarViewStyle = uiPreferences.cellarViewStyle;
  document.body.classList.toggle("sidebar-collapsed", Boolean(uiPreferences.sidebarCollapsed));
}

function syncPreferenceControls() {
  elements.preferenceControls.forEach((control) => {
    const key = control.dataset.uiPreference;
    if (!key) return;
    if (control.type === "checkbox") {
      control.checked = Boolean(uiPreferences[key]);
      return;
    }
    control.value = uiPreferences[key] ?? DEFAULT_UI_PREFERENCES[key] ?? "";
  });
}

function handlePreferenceChange(event) {
  const control = event.currentTarget;
  const key = control.dataset.uiPreference;
  if (!key) return;
  uiPreferences[key] = control.type === "checkbox" ? control.checked : control.value;
  if (key === "sidebarMode") {
    uiPreferences.sidebarCollapsed = control.value === "collapsed";
  }
  applyUiPreferences();
  saveUiPreferences();
  syncPreferenceControls();
  renderActiveView();
}

function resetUiPreferences() {
  const nextDefaultView = uiPreferences.defaultView || "dashboard";
  uiPreferences = { ...DEFAULT_UI_PREFERENCES, defaultView: nextDefaultView };
  activeView = uiPreferences.defaultView;
  activeNavKey = activeView;
  saveUiPreferences();
  syncPreferenceControls();
  render();
  showStatus("Préférences visuelles rétablies.");
}

function scheduleRender(target = "inventory") {
  const normalizedTarget = typeof target === "string" ? target : "inventory";
  pendingRenderTargets.add(normalizedTarget);
  if (renderFrameId) window.cancelAnimationFrame(renderFrameId);
  renderFrameId = window.requestAnimationFrame(() => {
    const targets = [...pendingRenderTargets];
    pendingRenderTargets.clear();
    renderFrameId = 0;
    render({ targets, refreshFilterOptions: false });
  });
}

function scheduleFilterRender() {
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(() => {
    visibleWineLimit = VISIBLE_WINE_PAGE_SIZE;
    scheduleRender("inventory");
  }, FILTER_RENDER_DELAY);
}

function updateSidebarControls() {
  const isOpen = document.body.classList.contains("sidebar-open");
  const isCollapsed = document.body.classList.contains("sidebar-collapsed");
  elements.sidebarBackdrop.hidden = !isOpen;
  elements.mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  elements.sidebarCollapseButton.setAttribute("aria-pressed", String(isCollapsed));
  elements.sidebarCollapseButton.setAttribute("aria-label", isCollapsed ? "Déployer la navigation" : "Réduire la navigation");
  if (isOpen && isMobileSidebar()) {
    elements.appSidebar.style.setProperty("display", "flex", "important");
    elements.appSidebar.style.setProperty("left", "0", "important");
    elements.appSidebar.style.setProperty("transform", "translateX(0)", "important");
  } else {
    elements.appSidebar.style.removeProperty("display");
    elements.appSidebar.style.removeProperty("left");
    elements.appSidebar.style.removeProperty("transform");
  }
}

function isMobileSidebar() {
  return window.matchMedia("(max-width: 980px)").matches;
}

// Performance et caches
function measurePerf(label, callback) {
  if (!DEBUG_PERF || !window.performance) return callback();
  const start = performance.now();
  try {
    return callback();
  } finally {
    console.debug(`[perf] ${label}: ${(performance.now() - start).toFixed(1)} ms`);
  }
}

function invalidateWineCaches() {
  filterCache = { key: "", result: [] };
  visibleWineLimit = VISIBLE_WINE_PAGE_SIZE;
  rebuildComputedWineCache();
}

function rebuildComputedWineCache() {
  locationConflictMap = buildLocationConflictMap(wines);
  computedWineMap = new Map(wines.map((wine) => [wine.id, buildComputedWine(wine)]));
}

function buildComputedWine(wine) {
  const locationLabel = formatLocation(wine);
  const status = drinkStatus(wine);
  const value = bottleValue(wine);
  return {
    displayName: wineName(wine),
    bottleValue: value,
    formattedValue: formatMoney(value),
    drinkStatus: status,
    drinkPriority: getDrinkPriorityScore(wine),
    drinkPriorityLabel: getDrinkPriorityLabel(wine),
    locationLabel,
    locationConflict: Boolean(locationConflictMap.get(wine.id)?.count > 1),
    searchText: buildWineSearchIndex(wine),
    normalizedTags: wine.tags.map(normalizeSearchText),
    photoThumb: wine.photoThumb || (wine.photo && wine.photo.length < 120000 ? wine.photo : "")
  };
}

function getComputedWine(wine) {
  if (!computedWineMap.has(wine.id)) {
    computedWineMap.set(wine.id, buildComputedWine(wine));
  }
  return computedWineMap.get(wine.id);
}

function buildWineSearchIndex(wine) {
  return normalizeSearchText([
    wine.domain,
    wine.cuvee,
    wine.region,
    wine.appellation,
    wine.location,
    getWineLocationLabel(wine),
    wine.notes,
    wine.cellarName,
    wine.rack,
    wine.row,
    wine.column,
    wine.status,
    wine.vintage ? String(wine.vintage) : "non millesime",
    ...wine.tags
  ].join(" "));
}

function rebuildSearchIndex() {
  rebuildComputedWineCache();
}

function buildLocationConflictMap(items = wines) {
  const byLocation = new Map();
  items.forEach((wine) => {
    const key = locationKey(wine);
    if (!key.replaceAll("|", "")) return;
    byLocation.set(key, [...(byLocation.get(key) || []), wine.id]);
  });
  const conflicts = new Map();
  byLocation.forEach((ids, key) => {
    if (ids.length <= 1) return;
    ids.forEach((id) => conflicts.set(id, { key, count: ids.length, ids }));
  });
  return conflicts;
}

function normalizeSearchText(value) {
  return normalizeSearch(value).replace(/\s+/g, " ");
}

function getFilterCacheKey() {
  return [
    elements.searchInput.value,
    elements.colorFilter.value,
    elements.regionFilter.value,
    elements.statusFilter.value,
    elements.drinkFilter.value,
    elements.cellarFilter.value,
    elements.rackFilter.value,
    elements.tagFilter.value,
    elements.favoriteFilter.value,
    elements.stockFilter.value,
    elements.vintageMinFilter.value,
    elements.vintageMaxFilter.value,
    elements.priceMinFilter.value,
    elements.priceMaxFilter.value,
    elements.valueMinFilter.value,
    elements.valueMaxFilter.value,
    elements.sortSelect.value,
    wines.length,
    [...computedWineMap.keys()].join(",")
  ].join("::");
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
  markPersonalDataChanged("cellar");
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
  markPersonalDataChanged("movements");
}

function loadWishlist() {
  return loadJsonArray(WISHLIST_KEY).map(normalizeWish);
}

function saveWishlist(nextWishlist = wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(nextWishlist));
  markPersonalDataChanged("wishlist");
}

function loadTastingNotes() {
  return loadJsonArray(TASTING_NOTES_KEY).map(normalizeTastingNote);
}

function saveTastingNotes(nextNotes = tastingNotes) {
  localStorage.setItem(TASTING_NOTES_KEY, JSON.stringify(nextNotes));
  markPersonalDataChanged("tasting-notes");
}

function loadErrorLogs() {
  return loadJsonArray(ERROR_LOGS_KEY).map(normalizeErrorLog);
}

function saveErrorLogs(nextLogs = errorLogs) {
  localStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(nextLogs));
}

function loadWineLibrary() {
  return loadJsonArray(LIBRARY_KEY).map(normalizeLibraryWine);
}

function saveWineLibrary(nextLibrary = wineLibrary) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
}

function loadLocalCellarLayouts() {
  return loadJsonArray(CELLAR_LAYOUTS_KEY).map(normalizeCellarLayout);
}

function saveLocalCellarLayouts(nextLayouts = cellarLayouts) {
  localStorage.setItem(CELLAR_LAYOUTS_KEY, JSON.stringify(nextLayouts.map(normalizeCellarLayout)));
  markPersonalDataChanged("cellar-layouts");
}

function loadCellarLayouts() {
  return loadLocalCellarLayouts();
}

function saveCellarLayouts(nextLayouts = cellarLayouts) {
  saveLocalCellarLayouts(nextLayouts);
}

async function loadRemoteCellarLayouts() {
  return [];
}

async function saveRemoteCellarLayouts() {
  return { ok: false, pending: true };
}

async function syncCellarLayouts() {
  saveCellarLayouts(cellarLayouts);
  return { ok: true, local: true };
}

function loadAiEnrichmentQueue() {
  return loadJsonArray(AI_QUEUE_KEY).map(normalizeAiEnrichmentRequest);
}

function saveAiEnrichmentQueue(nextQueue = aiEnrichmentQueue) {
  aiEnrichmentQueue = nextQueue.map(normalizeAiEnrichmentRequest);
  localStorage.setItem(AI_QUEUE_KEY, JSON.stringify(aiEnrichmentQueue));
}

function loadAdviceFeedback() {
  return loadJsonArray(ADVICE_FEEDBACK_KEY).map(normalizeAdviceFeedback);
}

function saveAdviceFeedbackStore(nextFeedback = adviceFeedback) {
  adviceFeedback = nextFeedback.map(normalizeAdviceFeedback);
  localStorage.setItem(ADVICE_FEEDBACK_KEY, JSON.stringify(adviceFeedback));
}

function loadPendingLibrarySyncQueue() {
  return loadJsonArray(LIBRARY_SYNC_QUEUE_KEY).map(normalizeLibraryReference);
}

function savePendingLibrarySyncQueue(nextQueue = pendingLibrarySyncQueue) {
  pendingLibrarySyncQueue = nextQueue.map(normalizeLibraryReference);
  localStorage.setItem(LIBRARY_SYNC_QUEUE_KEY, JSON.stringify(pendingLibrarySyncQueue));
}

function loadSubscriptionState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SUBSCRIPTION_KEY) || "{}");
    return normalizeSubscriptionState(parsed);
  } catch {
    return { ...DEFAULT_SUBSCRIPTION_STATE };
  }
}

function saveSubscriptionState(nextState = subscriptionState) {
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(nextState));
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
    cuvee: cleanString(wine.cuvee) || "Cuvée sans nom",
    color: normalizeColor(wine.color),
    region: cleanString(wine.region) || "Région non renseignée",
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
    level: Math.max(1, toNumber(wine.level, 1)),
    cellarLayoutId: cleanString(wine.cellarLayoutId || wine.cellar_layout_id),
    slotId: cleanString(wine.slotId || wine.slot_id),
    positionLabel: cleanString(wine.positionLabel || wine.position_label),
    location: cleanString(wine.location),
    tags: normalizeTags(wine.tags),
    favorite: Boolean(wine.favorite),
    rating: clamp(toNumber(wine.rating, 0), 0, 5),
    consumedAt: cleanString(wine.consumedAt),
    photo: typeof wine.photo === "string" ? wine.photo : "",
    photoThumb: typeof wine.photoThumb === "string" ? wine.photoThumb : "",
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
    domain: cleanString(wish.domain) || "Domaine à trouver",
    cuvee: cleanString(wish.cuvee) || "Cuvée à trouver",
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

function normalizeCellarLayout(layout = {}) {
  const rows = clamp(Math.round(toNumber(layout.rows, 6)), 1, 30);
  const columns = clamp(Math.round(toNumber(layout.columns, 8)), 1, 30);
  const levels = clamp(Math.round(toNumber(layout.levels, 1)), 1, 8);
  const capacity = clamp(Math.round(toNumber(layout.capacity || layout.slotCapacity, 1)), 1, 12);
  const layoutMode = ["grid", "staggered", "stacked", "custom"].includes(layout.layoutMode) ? layout.layoutMode : "grid";
  const slots = Array.isArray(layout.slots) && layout.slots.length
    ? layout.slots.map((slot) => normalizeCellarSlot(slot, capacity))
    : generateSlotsForLayout({ rows, columns, levels, layoutMode, capacity });
  const now = new Date().toISOString();
  return {
    id: cleanString(layout.id) || crypto.randomUUID(),
    name: cleanString(layout.name) || "Cave principale",
    type: ["cellar", "cabinet", "rack", "custom"].includes(layout.type) ? layout.type : "cellar",
    layoutMode,
    rows,
    columns,
    levels,
    slotShape: ["circle", "bottle", "cell"].includes(layout.slotShape) ? layout.slotShape : "bottle",
    capacity,
    createdAt: cleanString(layout.createdAt) || now,
    updatedAt: cleanString(layout.updatedAt) || now,
    slots
  };
}

function normalizeCellarSlot(slot = {}, defaultCapacity = 1) {
  const row = Math.max(1, toNumber(slot.row, 1));
  const column = Math.max(1, toNumber(slot.column, 1));
  const level = Math.max(1, toNumber(slot.level, 1));
  return {
    id: cleanString(slot.id) || crypto.randomUUID(),
    row,
    column,
    level,
    x: toNumber(slot.x, column),
    y: toNumber(slot.y, row),
    label: cleanString(slot.label) || getSlotLabel(row, column, level),
    capacity: Math.max(1, toNumber(slot.capacity, defaultCapacity)),
    wineIds: Array.isArray(slot.wineIds) ? slot.wineIds.map(cleanString).filter(Boolean) : []
  };
}

function normalizeAiEnrichmentRequest(request = {}) {
  return {
    id: cleanString(request.id) || crypto.randomUUID(),
    wineReferenceId: cleanString(request.wineReferenceId || request.wine_reference_id),
    requestedFields: Array.isArray(request.requestedFields) ? request.requestedFields.map(cleanString).filter(Boolean) : normalizeTags(request.requestedFields),
    requestType: cleanString(request.requestType || request.request_type) || "complete_food_pairings",
    status: ["pending", "processing", "completed", "failed", "cancelled"].includes(request.status) ? request.status : "pending",
    createdBy: cleanString(request.createdBy || request.created_by),
    createdAt: cleanString(request.createdAt || request.created_at) || new Date().toISOString(),
    completedAt: cleanString(request.completedAt || request.completed_at),
    error: cleanString(request.error),
    resultPayload: request.resultPayload || request.result_payload || null
  };
}

function normalizeAdviceFeedback(feedback = {}) {
  return {
    id: cleanString(feedback.id) || crypto.randomUUID(),
    adviceId: cleanString(feedback.adviceId),
    wineId: cleanString(feedback.wineId),
    type: ["useful", "not_useful", "followed"].includes(feedback.type) ? feedback.type : "useful",
    context: cleanString(feedback.context),
    createdAt: cleanString(feedback.createdAt) || new Date().toISOString()
  };
}

function normalizeLibraryWine(reference = {}) {
  const now = new Date().toISOString();
  const remoteVintages = Array.isArray(reference.wine_vintages)
    ? reference.wine_vintages.map((item) => item?.vintage)
    : [];
  const remoteAliases = Array.isArray(reference.wine_aliases)
    ? reference.wine_aliases.map((item) => item?.alias)
    : [];
  const knownVintages = Array.isArray(reference.knownVintages)
    ? reference.knownVintages.map(normalizeVintage).filter(Boolean)
    : Array.isArray(reference.known_vintages)
      ? reference.known_vintages.map(normalizeVintage).filter(Boolean)
      : remoteVintages.length
        ? remoteVintages.map(normalizeVintage).filter(Boolean)
    : normalizeVintage(reference.vintage)
      ? [normalizeVintage(reference.vintage)]
      : [];
  const color = cleanString(reference.color);
  const source = cleanString(reference.source);
  const normalizedSource = ["manual", "scan", "import", "seed", "user", "remote"].includes(source) ? source : "manual";
  const dataSource = cleanString(reference.dataSource || reference.data_source || normalizedSource);
  const reviewStatus = cleanString(reference.reviewStatus || reference.review_status) || (normalizedSource === "seed" ? "verified" : "community");
  return {
    id: reference.id || crypto.randomUUID(),
    remoteId: cleanString(reference.remoteId || reference.remote_id || ""),
    domain: cleanString(reference.domain) || "Domaine à vérifier",
    cuvee: cleanString(reference.cuvee) || "Cuvée à vérifier",
    appellation: cleanString(reference.appellation),
    region: cleanString(reference.region),
    country: cleanString(reference.country) || "France",
    color: LIBRARY_COLORS.includes(color) ? color : normalizeColor(color || "Rouge"),
    knownVintages: uniqueValues(knownVintages.map(String)).map(Number),
    grapeVarieties: normalizeTags(reference.grapeVarieties || reference.grape_varieties),
    aliases: normalizeTags([...(Array.isArray(reference.aliases) ? reference.aliases : normalizeTags(reference.aliases)), ...remoteAliases]),
    foodPairings: normalizeTags(reference.foodPairings || reference.food_pairings),
    servingTemperature: cleanString(reference.servingTemperature || reference.serving_temperature),
    openingAdvice: cleanString(reference.openingAdvice || reference.opening_advice),
    decantingTime: Math.max(0, toNumber(reference.decantingTime ?? reference.decanting_time, 0)),
    drinkFrom: normalizeYear(reference.drinkFrom || reference.drink_from),
    drinkTo: normalizeYear(reference.drinkTo || reference.drink_to),
    agingPotential: cleanString(reference.agingPotential || reference.aging_potential),
    body: ["light", "medium", "full", "unknown"].includes(reference.body) ? reference.body : "unknown",
    tannins: ["low", "medium", "high", "unknown"].includes(reference.tannins) ? reference.tannins : "unknown",
    acidity: ["low", "medium", "high", "unknown"].includes(reference.acidity) ? reference.acidity : "unknown",
    sweetness: ["dry", "off-dry", "sweet", "unknown"].includes(reference.sweetness) ? reference.sweetness : "unknown",
    bestOccasions: normalizeTags(reference.bestOccasions || reference.best_occasions),
    labelPhotos: Array.isArray(reference.labelPhotos) ? reference.labelPhotos.filter((photo) => typeof photo === "string").slice(0, 3) : [],
    createdAt: cleanString(reference.createdAt) || now,
    updatedAt: cleanString(reference.updatedAt) || now,
    createdByUser: Boolean(reference.createdByUser ?? reference.created_by_user ?? normalizedSource !== "seed"),
    source: normalizedSource,
    dataSource: ["user", "scan", "import", "seed", "admin", "ai", "ai_web", "manual", "remote"].includes(dataSource) ? dataSource : normalizedSource,
    reviewStatus: ["community", "verified", "rejected", "duplicate", "pending_review"].includes(reviewStatus) ? reviewStatus : "community",
    lastReviewedAt: cleanString(reference.lastReviewedAt || reference.last_reviewed_at),
    verifiedBy: cleanString(reference.verifiedBy || reference.verified_by),
    confidenceScore: clamp(toNumber(reference.confidenceScore ?? reference.confidence_score, estimateReferenceConfidence(reference)), 0, 1),
    pendingSync: Boolean(reference.pendingSync ?? reference.pending_sync ?? false)
  };
}

function normalizeLibraryReference(reference = {}) {
  return normalizeLibraryWine(reference);
}

function normalizeSubscriptionState(state = {}) {
  const plan = PRICING_PLANS.some((item) => item.id === state.plan) ? state.plan : DEFAULT_SUBSCRIPTION_STATE.plan;
  const limits = getPlanLimits(plan);
  return {
    ...DEFAULT_SUBSCRIPTION_STATE,
    ...state,
    plan,
    billingCycle: ["monthly", "yearly"].includes(state.billingCycle) ? state.billingCycle : null,
    scanCredits: Math.max(0, toNumber(state.scanCredits, limits.scanLimit)),
    monthlyScanLimit: Math.max(0, toNumber(state.monthlyScanLimit, limits.scanLimit)),
    usedScansThisMonth: Math.max(0, toNumber(state.usedScansThisMonth, 0)),
    renewalDate: cleanString(state.renewalDate) || null,
    isPaymentConfigured: Boolean(state.isPaymentConfigured),
    lastUsageReset: cleanString(state.lastUsageReset) || today().slice(0, 7)
  };
}

function loadAuthState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AUTH_STATE_KEY) || "{}");
    const normalized = normalizeAuthState(parsed);
    if (parsed?.accessToken || parsed?.refreshToken) {
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return normalizeAuthState();
  }
}

function saveAuthState(nextState = authState) {
  authState = normalizeAuthState(nextState);
  localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));
}

function clearAuthState() {
  authState = normalizeAuthState();
  authSession = { accessToken: "", refreshToken: "" };
  localStorage.removeItem(AUTH_STATE_KEY);
}

function normalizeAuthState(state = {}) {
  return {
    provider: cleanString(state.provider) || "supabase",
    expiresAt: toNumber(state.expiresAt, 0),
    user: state.user && typeof state.user === "object" ? {
      id: cleanString(state.user.id),
      email: cleanString(state.user.email),
      displayName: cleanString(state.user.displayName || state.user.display_name || state.user.user_metadata?.display_name)
    } : null
  };
}

function loadCloudSyncState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CLOUD_SYNC_STATE_KEY) || "{}");
    return normalizeCloudSyncState(parsed);
  } catch {
    return normalizeCloudSyncState();
  }
}

function saveCloudSyncState(nextState = cloudSyncState) {
  cloudSyncState = normalizeCloudSyncState(nextState);
  localStorage.setItem(CLOUD_SYNC_STATE_KEY, JSON.stringify(cloudSyncState));
}

function normalizeCloudSyncState(state = {}) {
  return {
    lastSyncAt: cleanString(state.lastSyncAt),
    lastPullAt: cleanString(state.lastPullAt),
    lastPushAt: cleanString(state.lastPushAt),
    lastAutoSyncAt: cleanString(state.lastAutoSyncAt),
    lastRemoteAt: cleanString(state.lastRemoteAt),
    lastError: cleanString(state.lastError),
    lastReason: cleanString(state.lastReason),
    lastHydratedUserId: cleanString(state.lastHydratedUserId),
    syncStatus: cleanString(state.syncStatus) || "local-only",
    pendingChanges: Boolean(state.pendingChanges),
    pendingLocalMigration: state.pendingLocalMigration !== false
  };
}

function getCloudConfig() {
  const config = window.CAVE_CLOUD_CONFIG || {};
  const supabaseUrl = cleanString(config.supabaseUrl).replace(/\/$/, "");
  const supabaseAnonKey = cleanString(config.supabaseAnonKey);
  return {
    provider: config.provider || "supabase",
    supabaseUrl,
    supabaseAnonKey,
    enabled: Boolean(config.enabled !== false && supabaseUrl && supabaseAnonKey)
  };
}

function isCloudConfigured() {
  cloudConfig = getCloudConfig();
  return Boolean(cloudConfig.enabled);
}

function migrateAppData() {
  const state = loadMigrationState();
  const shouldRunFullMigration = state.version !== DATA_MIGRATION_VERSION;
  let didChangeLibrary = false;
  let didChangeSubscription = false;

  if (shouldRunFullMigration || !wineLibrary.length) {
    didChangeLibrary = migrateWineLibrary();
    if (shouldRunFullMigration) didChangeLibrary = true;
  } else {
    wineLibrary = wineLibrary.map(normalizeLibraryWine);
  }

  if (shouldRunFullMigration || !state.subscriptionMigrated) {
    didChangeSubscription = migrateSubscriptionState();
  } else {
    subscriptionState = normalizeSubscriptionState(subscriptionState);
  }

  if (didChangeLibrary) saveWineLibrary(wineLibrary);
  if (didChangeSubscription) saveSubscriptionState(subscriptionState);
  if (shouldRunFullMigration) {
    saveMigrationState({
      version: DATA_MIGRATION_VERSION,
      migratedAt: new Date().toISOString(),
      librarySeeded: Boolean(wineLibrary.length),
      subscriptionMigrated: true
    });
  }
}

function migrateWineLibrary() {
  const initialSize = wineLibrary.length;
  wineLibrary = wineLibrary.map(normalizeLibraryWine);
  wines.forEach((wine) => {
    addOrUpdateLibraryWine(createLibraryWineFromInventoryWine(wine), { persist: false, silent: true, rebuildCache: false });
  });
  rebuildLibraryDerivedCaches();
  return wineLibrary.length !== initialSize;
}

function migrateSubscriptionState() {
  const before = JSON.stringify(subscriptionState);
  subscriptionState = normalizeSubscriptionState(subscriptionState);
  resetMonthlyUsageIfNeeded({ persist: false });
  return JSON.stringify(subscriptionState) !== before;
}

function loadMigrationState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MIGRATION_STATE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveMigrationState(state) {
  localStorage.setItem(MIGRATION_STATE_KEY, JSON.stringify(state));
}

// Rendu
function render(options = {}) {
  return measurePerf("render", () => {
    const targets = normalizeRenderTargets(options);
    const all = targets.has("all");
    const activeChanged = all || targets.has("view");

    if (activeChanged) {
      renderActiveView();
    }
    if (all || targets.has("filters")) {
      renderFilterOptions();
    }
    if (all || activeChanged || targets.has("sidebar") || targets.has("subscription")) {
      renderPlanBadge();
    }
    if (all || targets.has("stats") || activeChanged && ["dashboard", "stats", "subscription"].includes(activeView)) {
      renderStats();
      renderCompactStats();
    }
    if (all || targets.has("inventory") || activeChanged && ["dashboard", "inventory", "stats"].includes(activeView)) {
      renderInventoryView();
    }
    if (all || targets.has("alerts") || activeChanged && ["dashboard", "advice"].includes(activeView)) {
      renderAlerts();
    }
    if (all || targets.has("wishlist") || activeChanged && activeView === "wishlist") {
      renderWishlist();
    }
    if (all || targets.has("movements") || activeChanged && activeView === "history") {
      renderMovements();
    }
    if (all || targets.has("library") || activeChanged && activeView === "library") {
      renderLibrary();
    }
    if (all || targets.has("cellar") || activeChanged && activeView === "cellar") {
      renderVirtualCellar();
    }
    if (all || targets.has("cellar") || activeChanged && activeView === "dashboard") {
      renderCellarPreview();
    }
    if (all || targets.has("scanner") || activeChanged && activeView === "scanner") {
      renderScanner();
    }
    if (all || targets.has("subscription") || activeChanged && activeView === "subscription") {
      renderSubscriptionView();
    }
    if (all || targets.has("account") || activeChanged && activeView === "account") {
      renderAccountView();
    }
    if (all || targets.has("beta") || activeChanged && ["tools", "settings"].includes(activeView)) {
      renderBetaState();
    }
  });
}

function normalizeRenderTargets(options) {
  if (typeof options === "string") return new Set([options]);
  if (Array.isArray(options)) return new Set(options);
  if (options?.targets) return new Set(options.targets);
  if (options?.target) return new Set([options.target]);
  return new Set(["all"]);
}

function renderDashboard() {
  renderStats();
  renderInventoryView();
  renderAlerts();
}

function renderInventoryView() {
  const filtered = getFilteredWines();
  renderWineList(filtered);
}

function renderSidebar() {
  renderActiveView();
  renderPlanBadge();
}

function renderAssistant() {
  return elements.adviceResult;
}

function renderSubscriptions() {
  renderSubscriptionView();
}

function renderPreferences() {
  if (activeView === "settings") renderBetaState();
}

function renderControlCenter() {
  if (activeView === "tools") renderBetaState();
}

function renderFilterOptions() {
  updateSelectOptions(elements.regionFilter, uniqueValues(wines.map((wine) => wine.region)), "Toutes", "all");
  updateSelectOptions(elements.cellarFilter, uniqueValues(wines.map((wine) => wine.cellarName).filter(Boolean)), "Toutes", "all");
  updateSelectOptions(elements.rackFilter, uniqueValues(wines.map((wine) => wine.rack).filter(Boolean)), "Tous", "all");
  updateSelectOptions(elements.tagFilter, uniqueValues(wines.flatMap((wine) => wine.tags)), "Tous", "all");
}

function renderStats() {
  return measurePerf("renderStats", () => {
  const active = wines.filter((wine) => wine.status !== "bu" && wine.status !== "vendu" && wine.status !== "offert");
  const totalBottles = active.reduce((sum, wine) => sum + wine.quantity, 0);
  const purchaseTotal = active.reduce((sum, wine) => sum + wine.quantity * wine.purchasePrice, 0);
  const estimatedTotal = active.reduce((sum, wine) => sum + getComputedWine(wine).bottleValue, 0);
  const ready = active.filter((wine) => getComputedWine(wine).drinkStatus.state === "ready").length;
  const expired = active.filter((wine) => getComputedWine(wine).drinkStatus.state === "late").length;
  const top = [...active].sort((a, b) => getComputedWine(b).bottleValue - getComputedWine(a).bottleValue)[0];

  elements.statBottles.textContent = totalBottles;
  elements.statRefs.textContent = wines.length;
  elements.statValue.textContent = formatMoney(estimatedTotal);
  elements.statReady.textContent = ready;
  elements.statPurchaseValue.textContent = formatMoney(purchaseTotal);
  elements.statGainLoss.textContent = formatMoney(estimatedTotal - purchaseTotal);
  elements.statExpired.textContent = expired;
  elements.statTopValue.textContent = top ? `${top.domain} (${getComputedWine(top).formattedValue})` : "-";
  });
}

function renderCompactStats() {
  const byColor = countBy(wines, "color");
  const byRegion = countBy(wines, "region");
  const byCellar = countBy(wines, "cellarName");
  const valueByCellar = sumValueBy(wines, "cellarName");
  const keepCount = wines.filter((wine) => getComputedWine(wine).drinkStatus.state === "wait").length;
  const favoriteCount = wines.filter((wine) => wine.favorite).length;
  const topRegions = Object.entries(byRegion).sort((a, b) => b[1] - a[1]).slice(0, 2);
  elements.compactStats.innerHTML = [
    `Couleurs: ${Object.entries(byColor).map(([key, value]) => `${escapeHtml(formatColorLabel(key))} ${value}`).join(" · ") || "-"}`,
    `Régions: ${topRegions.map(([key, value]) => `${escapeHtml(key)} ${value}`).join(" · ") || "-"}`,
    `À garder: ${keepCount} · Favoris: ${favoriteCount}`,
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

  const fragment = document.createDocumentFragment();
  wishlist.forEach((wish) => {
    const item = document.createElement("div");
    item.className = "wishlist-card";
    item.innerHTML = `
      <strong>${escapeHtml(wish.domain)} - ${escapeHtml(wish.cuvee)}</strong>
      <p>${escapeHtml(wish.color)}${wish.region ? ` · ${escapeHtml(wish.region)}` : ""}${wish.budget ? ` · ${formatMoney(wish.budget)}` : ""} · ${escapeHtml(priorityLabel(wish.priority))}</p>
      <div class="quick-advice-actions">
        <button class="card-action" type="button" data-wish-action="buy" data-id="${escapeAttribute(wish.id)}">Ajouter à la cave</button>
        <button class="card-action" type="button" data-wish-action="remove" data-id="${escapeAttribute(wish.id)}">Retirer</button>
      </div>
    `;
    fragment.append(item);
  });
  elements.wishlistList.append(fragment);
}

function renderBetaState() {
  const storageSize = estimateStorageSize();
  const lastBackup = localStorage.getItem(BACKUP_KEY);
  elements.appVersion.textContent = `Version ${APP_VERSION}`;
  elements.betaState.innerHTML = `
    <div class="beta-card"><strong>Dernière sauvegarde</strong><p>${lastBackup ? formatDateTime(JSON.parse(lastBackup).createdAt) : "Aucune sauvegarde locale"}</p></div>
    <div class="beta-card"><strong>Inventaire</strong><p>${wines.length} références · ${movements.length} mouvements</p></div>
    <div class="beta-card"><strong>Stockage estimé</strong><p>${formatBytes(storageSize)}</p></div>
    <div class="beta-card"><strong>PWA</strong><p>${navigator.serviceWorker ? "Service worker disponible" : "Service worker indisponible"}</p></div>
  `;
}

function renderWineList(filtered) {
  return measurePerf("renderWineList", () => {
    elements.wineList.innerHTML = "";
    elements.emptyState.hidden = filtered.length > 0;
    const fragment = document.createDocumentFragment();
    const isDashboard = activeView === "dashboard";
    const maxVisible = isDashboard ? DASHBOARD_WINE_LIMIT : visibleWineLimit;
    const visibleWines = filtered.slice(0, maxVisible);
    elements.resultCount.textContent = filtered.length > visibleWines.length
      ? `${visibleWines.length} sur ${filtered.length} résultats`
      : `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`;

    visibleWines.forEach((wine) => {
    const computed = getComputedWine(wine);
    const status = computed.drinkStatus;
    const locationLabel = computed.locationLabel || "Emplacement non renseigné";
    const vintageLabel = wine.vintage ? escapeHtml(String(wine.vintage)) : "Non millésimé";
    const photoMarkup = computed.photoThumb
      ? `<img src="${escapeAttribute(computed.photoThumb)}" alt="" loading="lazy" width="92" height="116">`
      : renderDefaultBottleIllustration(wine);
    const card = document.createElement("article");
    card.className = "wine-card";
    card.dataset.color = wine.color;
    card.innerHTML = `
      <div class="wine-photo">${photoMarkup}</div>
      <div class="wine-card-body">
        <div class="wine-kicker">
          <span class="color-chip"><span class="color-dot" aria-hidden="true"></span>${escapeHtml(formatColorLabel(wine.color))}</span>
          <span>${escapeHtml(wine.region || "Région non renseignée")}</span>
        </div>
        <div class="wine-title-row">
          <div>
            <p class="wine-domain">${escapeHtml(wine.domain)}</p>
            <h3 class="wine-title">${escapeHtml(wine.cuvee)}</h3>
          </div>
          <span class="wine-vintage">${vintageLabel}</span>
        </div>
        <div class="wine-meta">
          <span>${escapeHtml(wine.appellation || "Sans appellation")}</span>
          <span>${escapeHtml(locationLabel)}</span>
          ${computed.locationConflict ? `<span class="pill warning">Emplacement partagé</span>` : ""}
          <span class="pill neutral">${escapeHtml(computed.drinkPriorityLabel)}</span>
        </div>
        <p class="wine-notes">${escapeHtml(wine.notes || "Aucune note pour le moment.")}</p>
        <div class="tag-list">${wine.tags.map((tag) => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join("")}</div>
      </div>
      <div class="wine-facts">
        <span class="pill ${status.state === "late" ? "danger" : status.state}">${status.label}</span>
        <strong>${wine.quantity} bouteille${wine.quantity > 1 ? "s" : ""}</strong>
        <span class="fact-value">${computed.formattedValue}</span>
        <div class="wine-primary-actions">
          <button class="card-action" type="button" data-action="view" data-id="${escapeAttribute(wine.id)}">Voir</button>
          <button class="card-action" type="button" data-action="consume" data-id="${escapeAttribute(wine.id)}">Dégustée</button>
        </div>
        <details class="wine-actions-menu">
          <summary>Plus</summary>
          <div>
            <button class="card-action" type="button" data-action="edit" data-id="${escapeAttribute(wine.id)}">Modifier</button>
            <button class="card-action" type="button" data-action="move" data-id="${escapeAttribute(wine.id)}">Déplacer</button>
            <button class="card-action" type="button" data-action="favorite" data-id="${escapeAttribute(wine.id)}">${wine.favorite ? "Retirer favori" : "Ajouter favori"}</button>
            <button class="card-action" type="button" data-action="taste" data-id="${escapeAttribute(wine.id)}">Ajouter une note</button>
            <button class="card-action" type="button" data-action="wish" data-id="${escapeAttribute(wine.id)}">Ajouter à la liste d’achat</button>
            <button class="card-action danger-text" type="button" data-action="delete" data-id="${escapeAttribute(wine.id)}">Supprimer</button>
          </div>
        </details>
      </div>
    `;
    fragment.append(card);
  });

  if (filtered.length > visibleWines.length) {
    const moreButton = document.createElement("button");
    moreButton.className = "card-action inventory-more";
    moreButton.type = "button";
    moreButton.dataset.action = isDashboard ? "open-inventory" : "load-more-wines";
    moreButton.textContent = isDashboard
      ? "Voir tout l'inventaire"
      : `Charger ${Math.min(VISIBLE_WINE_PAGE_SIZE, filtered.length - visibleWines.length)} bouteilles de plus`;
    fragment.append(moreButton);
  }

    elements.wineList.append(fragment);
  });
}

function renderDefaultBottleIllustration(wine) {
  const label = wine.vintage ? String(wine.vintage) : wine.color.slice(0, 3).toUpperCase();
  return `
    <span class="bottle-illustration" aria-hidden="true">
      <span class="bottle-neck"></span>
      <span class="bottle-body">
        <span class="bottle-label">${escapeHtml(label)}</span>
      </span>
    </span>
  `;
}

function renderAlerts() {
  const alerts = getAlerts();
  const visibleAlerts = activeView === "dashboard" ? alerts.slice(0, 3) : alerts.slice(0, 8);
  elements.watchList.innerHTML = "";

  if (!alerts.length) {
    elements.watchList.innerHTML = `<p>Aucune alerte pour le moment.</p>`;
    return;
  }

  visibleAlerts.forEach((alert) => {
    const item = document.createElement("div");
    item.className = `watch-card ${alert.severity}`;
    item.innerHTML = `
      <strong>${escapeHtml(alert.title)}</strong>
      <p>${escapeHtml(alert.message)}</p>
    `;
    elements.watchList.append(item);
  });

  if (activeView === "dashboard" && alerts.length > visibleAlerts.length) {
    const moreButton = document.createElement("button");
    moreButton.className = "card-action advice-more";
    moreButton.type = "button";
    moreButton.textContent = "Voir tous les conseils";
    moreButton.addEventListener("click", () => setActiveView("advice", { navKey: "advice" }));
    elements.watchList.append(moreButton);
  }
}

function renderMovements() {
  elements.movementList.innerHTML = "";
  const limit = activeView === "history" ? 40 : 8;
  const recent = [...movements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

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
  return measurePerf("getFilteredWines", () => {
  const cacheKey = getFilterCacheKey();
  if (filterCache.key === cacheKey) return filterCache.result;

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
  const normalizedTerm = normalizeSearchText(term);

  const result = wines
    .filter((wine) => color === "all" || wine.color === color)
    .filter((wine) => region === "all" || wine.region === region)
    .filter((wine) => status === "all" || wine.status === status)
    .filter((wine) => cellar === "all" || wine.cellarName === cellar)
    .filter((wine) => rack === "all" || wine.rack === rack)
    .filter((wine) => tag === "all" || getComputedWine(wine).normalizedTags.includes(normalizeSearchText(tag)))
    .filter((wine) => favorite === "all" || wine.favorite)
    .filter((wine) => stock === "all" || wine.quantity <= 1)
    .filter((wine) => drink === "all" || getComputedWine(wine).drinkStatus.state === drink || (drink === "expired" && getComputedWine(wine).drinkStatus.state === "late"))
    .filter((wine) => !vintageMin || (wine.vintage && wine.vintage >= vintageMin))
    .filter((wine) => !vintageMax || (wine.vintage && wine.vintage <= vintageMax))
    .filter((wine) => !priceMin || wine.estimatedValue >= priceMin || wine.price >= priceMin)
    .filter((wine) => !priceMax || wine.estimatedValue <= priceMax || wine.price <= priceMax)
    .filter((wine) => !valueMin || wine.estimatedValue >= valueMin)
    .filter((wine) => !valueMax || wine.estimatedValue <= valueMax)
    .filter((wine) => {
      if (!term) return true;
      return getComputedWine(wine).searchText.includes(normalizedTerm);
    })
    .sort(sortWines);
  filterCache = { key: cacheKey, result };
  return result;
  });
}

function sortWines(a, b) {
  const sort = elements.sortSelect.value;
  if (sort === "name") return getComputedWine(a).displayName.localeCompare(getComputedWine(b).displayName);
  if (sort === "quantity") return b.quantity - a.quantity;
  if (sort === "value") return getComputedWine(b).bottleValue - getComputedWine(a).bottleValue;
  if (sort === "vintage") return Number(b.vintage || 0) - Number(a.vintage || 0);
  if (sort === "favorite") return Number(b.favorite) - Number(a.favorite) || getComputedWine(a).displayName.localeCompare(getComputedWine(b).displayName);
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
  render({ targets: ["inventory"], refreshFilterOptions: false });
}

// Formulaire
function openForm(wine = null) {
  elements.form.reset();
  elements.wineId.value = wine?.id || "";
  elements.dialogTitle.textContent = wine ? "Modifier une bouteille" : "Ajouter une bouteille";
  elements.deleteButton.hidden = !wine;
  elements.markConsumedFormButton.hidden = !wine;
  elements.photoInputHidden.value = wine?.photo || "";
  elements.photoThumbInputHidden.value = wine?.photoThumb || "";
  elements.cellarLayoutIdInput.value = wine?.cellarLayoutId || "";
  elements.slotIdInput.value = wine?.slotId || "";
  elements.positionLabelInput.value = wine?.positionLabel || "";
  renderPhotoPreview(wine?.photo || "");
  renderSelectedSlotLabel();
  renderLibrarySuggestions([]);

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
    level: cellarLayoutCache.slotsById.get(elements.slotIdInput.value)?.slot.level || oldWine?.level || 1,
    cellarLayoutId: elements.cellarLayoutIdInput.value,
    slotId: elements.slotIdInput.value,
    positionLabel: elements.positionLabelInput.value,
    tags: fields.tags.value,
    favorite: fields.favorite.checked,
    rating: fields.rating.value,
    consumedAt: fields.consumedAt.value,
    photo: elements.photoInputHidden.value,
    photoThumb: elements.photoThumbInputHidden.value
  });

  const index = wines.findIndex((wine) => wine.id === nextWine.id);
  if (index >= 0) {
    wines[index] = nextWine;
    addMovement(nextWine.id, "modification", `Modification de ${wineName(nextWine)}`, 0);
    if (oldWine && locationKey(oldWine) !== locationKey(nextWine)) {
      addMovement(nextWine.id, "déplacement", `Déplacement de ${wineName(nextWine)} vers ${formatLocation(nextWine) || "emplacement non renseigné"}`, 0);
    }
  } else {
    wines = [nextWine, ...wines];
    addMovement(nextWine.id, "ajout", `Ajout de ${wineName(nextWine)}`, nextWine.quantity);
  }

  invalidateWineCaches();
  const librarySource = scanState.result && elements.photoInputHidden.value === scanState.imageDataUrl ? "scan" : "user";
  addOrUpdateLibraryWine(createLibraryWineFromInventoryWine(nextWine, {
    source: librarySource,
    confidenceScore: scanState.result?.confidenceScore || undefined,
    labelPhoto: scanState.imageThumbDataUrl || ""
  }), { persist: false, silent: true });
  syncWineReferenceFromInventoryWine(nextWine, {
    source: librarySource,
    confidenceScore: scanState.result?.confidenceScore || undefined,
    labelPhoto: scanState.imageThumbDataUrl || ""
  });
  syncCellarLayoutWithWines({ persist: false });
  saveCellar(wines);
  saveMovements(movements);
  saveWineLibrary(wineLibrary);
  trackModification();
  elements.dialog.close();
  render({ targets: ["filters", "inventory", "stats", "alerts", "library", "cellar", "sidebar"] });
  showStatus("Bouteille enregistrée.");
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
  if (quantity < 0) return { valid: false, message: "La quantité ne peut pas être négative." };
  if (price < 0 || purchasePrice < 0 || estimatedValue < 0) return { valid: false, message: "Les prix ne peuvent pas être négatifs." };
  if (drinkFrom && drinkTo && drinkFrom > drinkTo) return { valid: false, message: "La date de début de dégustation doit être avant la date de fin." };
  if (vintage && (vintage < 1900 || vintage > 2100)) return { valid: false, message: "Le millésime doit être compris entre 1900 et 2100, ou 0 pour non millésimé." };
  if (rating < 0 || rating > 5) return { valid: false, message: "La note doit être comprise entre 0 et 5." };
  return { valid: true };
}

async function deleteCurrentWine() {
  const id = elements.wineId.value;
  const wine = wines.find((item) => item.id === id);
  if (!wine) return;
  await deleteWine(wine, { closeDialog: true });
}

async function deleteWine(wine, options = {}) {
  const confirmed = await askConfirmation("Supprimer la bouteille", `Supprimer ${wineName(wine)} ? Une sauvegarde locale sera créée avant suppression.`, "Supprimer");
  if (!confirmed) return;

  exportBackup("suppression");
  const id = wine.id;
  removeWineFromSlot(id, { silent: true });
  wines = wines.filter((item) => item.id !== id);
  invalidateWineCaches();
  rebuildCellarLayoutCache();
  addMovement("suppression", wine, { label: `Suppression de ${wineName(wine)}`, quantityChange: -wine.quantity });
  saveCellar(wines);
  saveMovements(movements);
  trackModification();
  if (options.closeDialog && elements.dialog.open) elements.dialog.close();
  if (elements.wineDetailDialog.open) elements.wineDetailDialog.close();
  render({ targets: ["filters", "inventory", "stats", "alerts", "movements", "library", "cellar"] });
  showStatus("Bouteille supprimée.");
}

function handleWineListClick(event) {
  if (event.target.closest(".wine-actions-menu summary")) {
    measurePerf("openMoreMenu", () => {});
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "open-inventory") {
    setActiveView("inventory", { navKey: "inventory" });
    return;
  }
  if (action === "load-more-wines") {
    visibleWineLimit += VISIBLE_WINE_PAGE_SIZE;
    render({ targets: ["inventory"], refreshFilterOptions: false });
    return;
  }
  handleCardAction(action, button.dataset.id);
}

function handleWishlistListClick(event) {
  const button = event.target.closest("[data-wish-action]");
  if (!button) return;
  handleWishlistAction(button.dataset.wishAction, button.dataset.id);
}

function handleLibraryListClick(event) {
  const button = event.target.closest("[data-library-action]");
  if (!button) return;
  const reference = wineLibrary.find((item) => item.id === button.dataset.id);
  if (!reference) return;
  if (button.dataset.libraryAction === "use") {
    applyLibraryReferenceToForm(reference);
  }
  if (button.dataset.libraryAction === "merge") {
    const duplicate = getLibraryDuplicates(reference)[0] || findPossibleDuplicates(reference).find((item) => item.id !== reference.id);
    if (duplicate) {
      mergeLibraryReferences(reference.id, duplicate.id);
      showStatus("Références fusionnées.");
    } else {
      showStatus("Aucun doublon évident à fusionner.", "error");
    }
  }
  if (button.dataset.libraryAction === "edit") {
    applyLibraryReferenceToForm(reference);
    showStatus("Référence chargée dans le formulaire. Ajustez puis enregistrez une bouteille.");
  }
  if (button.dataset.libraryAction === "queue-ai") {
    requestWineReferenceEnrichment(reference);
  }
  if (button.dataset.libraryAction === "verify") {
    markLibraryReferenceReviewStatus(reference.id, "verified");
  }
  if (button.dataset.libraryAction === "review") {
    markLibraryReferenceReviewStatus(reference.id, "pending_review");
  }
}

function handlePricingClick(event) {
  const button = event.target.closest("[data-plan]");
  if (!button) return;
  handleChoosePlan(button.dataset.plan, button.dataset.billingCycle || "monthly");
}

function handleScanPackClick(event) {
  const button = event.target.closest("[data-scan-pack]");
  if (!button) return;
  handleBuyScanPack(button.dataset.scanPack);
}

function handleCardAction(action, id) {
  const wine = wines.find((item) => item.id === id);
  if (!wine) return;
  if (action === "view") openWineDetail(wine);
  if (action === "edit") openForm(wine);
  if (action === "move") openMoveForm(wine);
  if (action === "consume") markWineConsumed(id);
  if (action === "favorite") toggleFavorite(id);
  if (action === "taste") openTastingNoteForm(id);
  if (action === "wish") addWineToWishlist(wine);
  if (action === "delete") deleteWine(wine);
}

async function markWineConsumed(id) {
  const wine = wines.find((item) => item.id === id);
  if (!wine || wine.quantity <= 0) {
    showStatus("Aucune bouteille disponible à consommer.", "error");
    return;
  }
  const before = structuredClone(wine);
  const confirmed = await askConfirmation("Marquer comme bue", `Marquer une bouteille de ${wineName(wine)} comme bue ?`, "Marquer bue");
  if (!confirmed) return;

  wine.quantity = Math.max(0, wine.quantity - 1);
  wine.consumedAt = new Date().toISOString().slice(0, 10);
  if (wine.quantity === 0) {
    wine.status = "bu";
    removeWineFromSlot(wine.id, { silent: true });
  }
  invalidateWineCaches();
  addMovement("consommation", wine, { label: `Consommation de ${wineName(wine)}`, quantityChange: -1 });
  saveCellar(wines);
  saveMovements(movements);
  trackModification();
  lastUndo = () => {
    const index = wines.findIndex((item) => item.id === before.id);
    if (index >= 0) wines[index] = before;
    invalidateWineCaches();
    saveCellar(wines);
    addMovement("restauration", before, { label: `Annulation consommation de ${wineName(before)}`, quantityChange: 1 });
    saveMovements(movements);
    render({ targets: ["inventory", "stats", "alerts", "movements", "cellar"] });
  };
  if (elements.dialog.open) elements.dialog.close();
  render({ targets: ["inventory", "stats", "alerts", "movements", "cellar"] });
  showStatus("Bouteille marquée comme bue.", "success", { label: "Annuler", action: undoLastAction });
}

function toggleFavorite(id) {
  const wine = wines.find((item) => item.id === id);
  if (!wine) return;
  wine.favorite = !wine.favorite;
  invalidateWineCaches();
  addMovement(wine.id, "modification", `${wine.favorite ? "Ajout aux favoris" : "Retrait des favoris"}: ${wineName(wine)}`, 0);
  saveCellar(wines);
  saveMovements(movements);
  trackModification();
  render({ targets: ["inventory", "stats", "alerts"] });
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

  compressImage(file).then(({ photoFull, photoThumb }) => {
    elements.photoInputHidden.value = photoFull;
    elements.photoThumbInputHidden.value = photoThumb;
    renderPhotoPreview(photoFull);
  }).catch((error) => showStatus(getPhotoErrorMessage(error), "error"));
}

function removePhoto() {
  elements.photoInputHidden.value = "";
  elements.photoThumbInputHidden.value = "";
  fields.photo.value = "";
  renderPhotoPreview("");
}

function renderPhotoPreview(dataUrl) {
  elements.photoPreview.innerHTML = dataUrl ? `<img src="${escapeAttribute(dataUrl)}" alt="">` : "Aucune photo";
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = reject;
    image.onload = () => resolve(image);
    image.src = dataUrl;
  });
}

function createImageThumbnail(image) {
  return resizeImageToDataUrl(image, 180, 0.66);
}

function validatePhotoSize(dataUrl, limit = PHOTO_WARNING_BYTES) {
  const bytes = window.OenovaHelpers?.estimateDataUrlBytes
    ? window.OenovaHelpers.estimateDataUrlBytes(dataUrl)
    : Math.ceil((String(dataUrl || "").split(",")[1]?.length || 0) * 3 / 4);
  return {
    valid: bytes <= limit,
    bytes,
    limit
  };
}

async function compressImage(file) {
  const sourceDataUrl = await readImageAsDataUrl(file);
  const image = await loadImageFromDataUrl(sourceDataUrl);
  const photoThumb = createImageThumbnail(image);
  const attempts = [
    { size: 720, quality: 0.78 },
    { size: 640, quality: 0.72 },
    { size: 560, quality: 0.66 },
    { size: 480, quality: 0.6 }
  ];

  for (const attempt of attempts) {
    const photoFull = resizeImageToDataUrl(image, attempt.size, attempt.quality);
    if (validatePhotoSize(photoFull).valid) {
      return { photoFull, photoThumb };
    }
  }

  const error = new Error("PHOTO_TOO_LARGE");
  error.code = "PHOTO_TOO_LARGE";
  throw error;
}

function getPhotoErrorMessage(error) {
  if (error?.code === "PHOTO_TOO_LARGE" || error?.message === "PHOTO_TOO_LARGE") {
    return `Image trop volumineuse. Choisissez une photo plus legere ou recadree, limite ${formatStorageSize(PHOTO_WARNING_BYTES)}.`;
  }
  return "Impossible de lire cette image.";
}

function resizeImageToDataUrl(image, maxSize, quality) {
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

// Import / export
function exportJson() {
  const backup = {
    app: "Cave à vin",
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    wines,
    movements,
    wishlist,
    tastingNotes,
    errorLogs,
    wineLibrary,
    cellarLayouts,
    aiEnrichmentQueue,
    adviceFeedback,
    subscriptionState
  };
  downloadFile(JSON.stringify(backup, null, 2), `cave-a-vin-${today()}.json`, "application/json");
  addMovement("export", {}, { label: "Export JSON de la cave", quantityChange: 0 });
  saveMovements(movements);
  renderMovements();
  showStatus("Sauvegarde JSON exportée.");
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
      wineLibrary = Array.isArray(data.wineLibrary) ? data.wineLibrary.map(normalizeLibraryWine) : wineLibrary;
      cellarLayouts = Array.isArray(data.cellarLayouts) ? data.cellarLayouts.map(normalizeCellarLayout) : cellarLayouts;
      aiEnrichmentQueue = Array.isArray(data.aiEnrichmentQueue) ? data.aiEnrichmentQueue.map(normalizeAiEnrichmentRequest) : aiEnrichmentQueue;
      adviceFeedback = Array.isArray(data.adviceFeedback) ? data.adviceFeedback.map(normalizeAdviceFeedback) : adviceFeedback;
      migrateWineLibrary();
      syncCellarLayoutWithWines({ persist: false });
      invalidateWineCaches();
      addMovement("", "import", `Import JSON de ${wines.length} référence(s)`, 0);
      saveCellar(wines);
      saveMovements(movements);
      saveWishlist(wishlist);
      saveTastingNotes(tastingNotes);
      saveWineLibrary(wineLibrary);
      saveCellarLayouts(cellarLayouts);
      saveAiEnrichmentQueue(aiEnrichmentQueue);
      saveAdviceFeedbackStore(adviceFeedback);
      trackModification();
      render();
      showStatus("Sauvegarde JSON importée.");
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
      if (rows.length < 2) throw new Error("Le fichier ne contient pas de données.");
      const headers = rows[0].map((header) => header.trim().replace(/^\ufeff/, ""));
      const missing = ["domain", "cuvee", "color", "quantity"].filter((column) => !headers.includes(column));
      if (missing.length) throw new Error(`Colonnes obligatoires manquantes: ${missing.join(", ")}.`);
      const confirmed = await askConfirmation("Importer un CSV", "Importer ce CSV remplacera la cave actuelle. Une sauvegarde automatique sera creee avant import.", "Importer");
      if (!confirmed) return;
      exportBackup("avant-import-csv");
      wines = rows.slice(1)
        .filter((row) => row.some((cell) => cell.trim()))
        .map((row) => rowToWine(headers, row));
      migrateWineLibrary();
      invalidateWineCaches();
      addMovement("", "import", `Import CSV de ${wines.length} référence(s)`, 0);
      saveCellar(wines);
      saveMovements(movements);
      saveWineLibrary(wineLibrary);
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
    <h1>Inventaire Cave à vin</h1>
    <p>Date d'export: ${escapeHtml(new Date().toLocaleDateString("fr-FR"))}</p>
    <p>Total: ${totalBottles} bouteilles · ${formatMoney(totalValue)}</p>
    <table>
      <thead>
        <tr>
          <th>Domaine</th><th>Cuvée</th><th>Couleur</th><th>Région</th><th>Millésime</th>
          <th>Quantité</th><th>Statut</th><th>Emplacement</th><th>Valeur</th>
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

// Fiche bouteille, wishlist et dégustation
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
          <p>${escapeHtml(wine.cuvee)} · ${wine.vintage || "Non millésimé"} · ${escapeHtml(wine.format)}</p>
          <div class="tag-list">
            <span class="pill ${drinkStatus(wine).state === "late" ? "danger" : drinkStatus(wine).state}">${escapeHtml(drinkStatus(wine).label)}</span>
            <span class="pill neutral">${escapeHtml(getDrinkPriorityLabel(wine))}</span>
            ${wine.favorite ? `<span class="pill warning">Favori</span>` : ""}
            ${wine.tags.map((tag) => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </div>
      <div class="compact-stats">
        <span class="compact-stat">Quantité: ${wine.quantity}</span>
        <span class="compact-stat">Valeur: ${formatMoney(bottleValue(wine))}</span>
        <span class="compact-stat">Achat: ${formatMoney(wine.purchasePrice * wine.quantity)}</span>
        <span class="compact-stat">Emplacement: ${escapeHtml(getWineLocationLabel(wine) || "Non renseigné")}</span>
        <span class="compact-stat">Dégustation: ${wine.drinkFrom || "?"} - ${wine.drinkTo || "?"}</span>
        <span class="compact-stat">Note moyenne: ${getWineAverageRating(wine.id) || "-"}/5</span>
      </div>
      <p>${escapeHtml(wine.notes || "Aucune note libre.")}</p>
      <div class="quick-advice-actions">
        <button class="card-action" type="button" data-detail-action="edit" data-id="${escapeAttribute(wine.id)}">Modifier</button>
        <button class="card-action" type="button" data-detail-action="consume" data-id="${escapeAttribute(wine.id)}">Marquer bue</button>
        <button class="card-action" type="button" data-detail-action="move" data-id="${escapeAttribute(wine.id)}">Déplacer</button>
        <button class="card-action" type="button" data-detail-action="taste" data-id="${escapeAttribute(wine.id)}">Ajouter une note</button>
        <button class="card-action" type="button" data-detail-action="wish" data-id="${escapeAttribute(wine.id)}">Ajouter à la liste d’achat</button>
      </div>
      <section>
        <h3>Notes de dégustation</h3>
        ${renderTastingNotes(wine.id)}
      </section>
      <section>
        <h3>Journal de cave de cette bouteille</h3>
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
  showStatus("Bouteille ajoutée à la liste d’achat.");
}

function handleWishlistAction(action, id) {
  const wish = wishlist.find((item) => item.id === id);
  if (!wish) return;
  if (action === "remove") {
    wishlist = wishlist.filter((item) => item.id !== id);
    saveWishlist(wishlist);
    trackModification();
    render();
    showStatus("Souhait retiré.");
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
  showStatus("Référence ajoutée à la liste d’achat.");
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
  addMovement("modification", wines.find((wine) => wine.id === note.wineId) || {}, { label: "Ajout d'une note de dégustation", quantityChange: 0 });
  saveMovements(movements);
  trackModification();
  elements.tastingDialog.close();
  render();
  const wine = wines.find((item) => item.id === note.wineId);
  if (wine && elements.wineDetailDialog.open) openWineDetail(wine);
  showStatus("Note de dégustation ajoutée.");
}

function renderTastingNotes(wineId) {
  const notes = tastingNotes.filter((note) => note.wineId === wineId);
  if (!notes.length) return "<p>Aucune note de dégustation.</p>";
  return notes.map((note) => `
    <div class="tasting-card">
      <strong>${escapeHtml(note.date)} · ${note.rating}/5${note.rebuy ? " · À racheter" : ""}</strong>
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

// Bibliothèque de références
function createLibraryReferenceFromWine(wine, options = {}) {
  return normalizeLibraryReference({
    domain: wine.domain,
    cuvee: wine.cuvee,
    appellation: wine.appellation,
    region: wine.region,
    country: options.country || "France",
    color: wine.color || "Inconnu",
    knownVintages: wine.vintage ? [wine.vintage] : [],
    grapeVarieties: options.grapeVarieties || [],
    aliases: [],
    labelPhotos: options.labelPhoto ? [options.labelPhoto] : [],
    createdByUser: true,
    source: options.source || "user",
    reviewStatus: "community",
    confidenceScore: options.confidenceScore || estimateReferenceConfidence(wine),
    pendingSync: true
  });
}

function createLibraryWineFromInventoryWine(wine, options = {}) {
  return normalizeLibraryWine({
    domain: wine.domain,
    cuvee: wine.cuvee,
    appellation: wine.appellation,
    region: wine.region,
    country: options.country || "France",
    color: wine.color || "Inconnu",
    knownVintages: wine.vintage ? [wine.vintage] : [],
    grapeVarieties: options.grapeVarieties || [],
    aliases: [],
    labelPhotos: options.labelPhoto ? [options.labelPhoto] : [],
    createdByUser: true,
    source: options.source || "manual",
    confidenceScore: options.confidenceScore || estimateReferenceConfidence(wine),
    pendingSync: true
  });
}

function addOrUpdateLibraryWine(reference, options = {}) {
  const incoming = normalizeLibraryWine(reference);
  const exactKey = getLibraryReferenceKey(incoming);
  const existing = wineLibrary.find((item) => getLibraryReferenceKey(item) === exactKey)
    || findPossibleDuplicates(incoming)[0];

  if (existing) {
    Object.assign(existing, mergeLibraryData(existing, incoming));
  } else {
    wineLibrary = [incoming, ...wineLibrary];
  }

  if (options.rebuildCache !== false) rebuildLibraryDerivedCaches();
  if (options.persist !== false) saveWineLibrary(wineLibrary);
  if (!options.silent && existing) {
    showStatus("Une référence similaire existait déjà : elle a été enrichie.");
  }
  return existing || incoming;
}

function findLocalLibraryMatches(query) {
  return findLibraryMatches(query);
}

async function findRemoteLibraryMatches(query) {
  return searchRemoteWineLibrary(query);
}

async function findDuplicateWineReference(reference) {
  const normalized = normalizeLibraryReference(reference);
  const localDuplicate = wineLibrary.find((item) => item.id !== normalized.id && getLibraryReferenceKey(item) === getLibraryReferenceKey(normalized))
    || findPossibleDuplicates(normalized)[0];
  if (localDuplicate) return localDuplicate;
  const remoteMatches = await findRemoteLibraryMatches(`${normalized.domain} ${normalized.cuvee} ${normalized.appellation}`);
  return remoteMatches.find((item) => getLibraryReferenceKey(item) === getLibraryReferenceKey(normalized)) || remoteMatches[0] || null;
}

async function upsertLibraryReference(reference, options = {}) {
  const normalized = normalizeLibraryReference(reference);
  const localReference = addOrUpdateLibraryWine(normalized, { persist: false, silent: true });

  if (!isCloudConfigured() || !isSignedIn()) {
    if (!options.fromQueue) queueLibrarySync(localReference);
    saveWineLibrary(wineLibrary);
    renderSyncStatus();
    return { ok: true, queued: true, reference: localReference };
  }

  const duplicate = await findDuplicateWineReference(localReference);
  if (duplicate?.remoteId || duplicate?.source === "remote") {
    const remoteId = duplicate.remoteId || duplicate.id;
    localReference.remoteId = remoteId;
    localReference.pendingSync = false;
    await addWineVintage(remoteId, localReference.knownVintages?.[0], options.wine || {});
    await addWineContribution(remoteId, "duplicate_match", { localReference });
    saveWineLibrary(wineLibrary);
    return { ok: true, duplicate: true, reference: localReference };
  }

  const row = libraryReferenceToSupabaseRow(localReference);
  const inserted = await insertRemoteLibraryReference(row);
  if (inserted?.id) {
    localReference.id = inserted.id;
    localReference.remoteId = inserted.id;
    localReference.pendingSync = false;
    localReference.source = inserted.source || localReference.source;
    localReference.reviewStatus = inserted.review_status || localReference.reviewStatus;
    localReference.updatedAt = inserted.updated_at || new Date().toISOString();
    await addWineVintage(inserted.id, localReference.knownVintages?.[0], options.wine || {});
    await addWineContribution(inserted.id, "create_reference", { localReference });
  }
  rebuildLibraryDerivedCaches();
  saveWineLibrary(wineLibrary);
  renderSyncStatus();
  return { ok: true, reference: localReference, remote: inserted };
}

async function addWineVintage(referenceId, vintage, wine = {}) {
  const normalizedVintage = normalizeVintage(vintage);
  if (!referenceId || !normalizedVintage) return null;
  const row = {
    reference_id: referenceId,
    vintage: normalizedVintage,
    drink_from: normalizeYear(wine.drinkFrom),
    drink_to: normalizeYear(wine.drinkTo),
    estimated_value: Math.max(0, toNumber(wine.estimatedValue, 0)),
    created_by: authState.user?.id || null,
    updated_at: new Date().toISOString()
  };
  const client = getSupabaseClient();
  if (client?.from) {
    const { data, error } = await client
      .from("wine_vintages")
      .upsert(row, { onConflict: "reference_id,vintage" })
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  }
  const rows = await supabaseRestRequest("/wine_vintages?on_conflict=reference_id,vintage", {
    method: "POST",
    body: [row],
    prefer: "resolution=merge-duplicates,return=representation"
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

async function addWineContribution(referenceId, type, details = {}) {
  if (!referenceId || !isCloudConfigured() || !isSignedIn()) return null;
  const row = {
    reference_id: referenceId,
    user_id: authState.user.id,
    contribution_type: cleanString(type) || "update",
    payload: details,
    created_at: new Date().toISOString()
  };
  const client = getSupabaseClient();
  if (client?.from) {
    const { data, error } = await client.from("wine_contributions").insert(row).select().maybeSingle();
    if (error) throw error;
    return data;
  }
  const rows = await supabaseRestRequest("/wine_contributions", {
    method: "POST",
    body: [row],
    prefer: "return=representation"
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

async function syncWineReferenceFromInventoryWine(wine, options = {}) {
  const reference = createLibraryReferenceFromWine(wine, options);
  addOrUpdateLibraryWine(reference, { persist: false, silent: true });
  try {
    return await upsertLibraryReference(reference, { wine });
  } catch (error) {
    logError(error, "syncWineReferenceFromInventoryWine");
    queueLibrarySync(reference);
    return { ok: false, queued: true, error };
  } finally {
    saveWineLibrary(wineLibrary);
    renderSyncStatus();
  }
}

function mergeLibraryData(primary, incoming) {
  return normalizeLibraryWine({
    ...primary,
    ...Object.fromEntries(Object.entries(incoming).filter(([, value]) => value !== "" && value !== null && value !== undefined)),
    id: primary.id,
    domain: primary.domain || incoming.domain,
    cuvee: primary.cuvee || incoming.cuvee,
    knownVintages: uniqueValues([...(primary.knownVintages || []), ...(incoming.knownVintages || [])].map(String)).map(Number),
    grapeVarieties: uniqueValues([...(primary.grapeVarieties || []), ...(incoming.grapeVarieties || [])]),
    aliases: uniqueValues([...(primary.aliases || []), ...(incoming.aliases || [])]),
    labelPhotos: uniqueValues([...(primary.labelPhotos || []), ...(incoming.labelPhotos || [])]).slice(0, 3),
    confidenceScore: Math.max(primary.confidenceScore || 0, incoming.confidenceScore || 0),
    source: ["remote", "seed"].includes(incoming.source) ? incoming.source : primary.source === "scan" || incoming.source !== "scan" ? primary.source : incoming.source,
    updatedAt: new Date().toISOString(),
    pendingSync: Boolean(incoming.pendingSync ?? primary.pendingSync ?? false)
  });
}

function findLibraryMatches(query) {
  const normalizedQuery = normalizeSearchText(typeof query === "string" ? query : Object.values(query || {}).join(" "));
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(" ").filter((term) => term.length > 1);
  return wineLibrary
    .map((reference) => {
      const searchText = librarySearchIndex.get(reference.id) || buildLibrarySearchText(reference);
      const score = terms.reduce((sum, term) => sum + (searchText.includes(term) ? 1 : 0), 0)
        + (searchText.startsWith(normalizedQuery) ? 3 : 0);
      return { reference, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.reference.confidenceScore - a.reference.confidenceScore)
    .map((item) => item.reference);
}

function findPossibleDuplicates(reference) {
  const key = getLibraryReferenceKey(reference);
  const domainCuvee = normalizeSearchText(`${reference.domain} ${reference.cuvee}`);
  return wineLibrary.filter((item) => {
    if (item.id === reference.id) return false;
    if (getLibraryReferenceKey(item) === key) return true;
    return normalizeSearchText(`${item.domain} ${item.cuvee}`) === domainCuvee
      && (!reference.appellation || !item.appellation || normalizeSearchText(reference.appellation) === normalizeSearchText(item.appellation));
  });
}

function mergeLibraryReferences(primaryId, duplicateId) {
  const primary = wineLibrary.find((item) => item.id === primaryId);
  const duplicate = wineLibrary.find((item) => item.id === duplicateId);
  if (!primary || !duplicate) return null;
  const merged = mergeLibraryData(primary, duplicate);
  wineLibrary = wineLibrary.filter((item) => item.id !== duplicateId).map((item) => item.id === primaryId ? merged : item);
  rebuildLibraryDerivedCaches();
  saveWineLibrary(wineLibrary);
  render({ targets: ["library"] });
  return merged;
}

function rebuildLibrarySearchIndex() {
  librarySearchIndex = new Map(wineLibrary.map((reference) => [reference.id, buildLibrarySearchText(reference)]));
}

function rebuildLibraryDerivedCaches() {
  rebuildLibrarySearchIndex();
  libraryDuplicateMap = buildLibraryDuplicateMap();
}

function buildLibraryDuplicateMap() {
  const exactGroups = new Map();
  const looseGroups = new Map();
  wineLibrary.forEach((reference) => {
    pushMapValue(exactGroups, getLibraryReferenceKey(reference), reference.id);
    pushMapValue(looseGroups, normalizeSearchText(`${reference.domain} ${reference.cuvee} ${reference.appellation || ""}`), reference.id);
  });
  const duplicates = new Map();
  [exactGroups, looseGroups].forEach((groups) => {
    groups.forEach((ids) => {
      if (ids.length <= 1) return;
      ids.forEach((id) => {
        const current = new Set(duplicates.get(id) || []);
        ids.filter((candidateId) => candidateId !== id).forEach((candidateId) => current.add(candidateId));
        duplicates.set(id, [...current]);
      });
    });
  });
  return duplicates;
}

function getLibraryDuplicates(reference) {
  const duplicateIds = libraryDuplicateMap.get(reference.id) || [];
  return duplicateIds.map((id) => wineLibrary.find((item) => item.id === id)).filter(Boolean);
}

function buildLibrarySearchText(reference) {
  return normalizeSearchText([
    reference.domain,
    reference.cuvee,
    reference.appellation,
    reference.region,
    reference.country,
    reference.color,
    reference.source,
    ...(reference.aliases || []),
    ...(reference.grapeVarieties || []),
    ...(reference.knownVintages || [])
  ].join(" "));
}

function getLibraryReferenceKey(reference) {
  return [
    reference.domain,
    reference.cuvee,
    reference.appellation,
    reference.region
  ].map(normalizeSearchText).join("|");
}

function estimateReferenceConfidence(reference = {}) {
  let score = 0.2;
  if (reference.domain) score += 0.22;
  if (reference.cuvee) score += 0.18;
  if (reference.vintage || reference.knownVintages?.length) score += 0.18;
  if (reference.appellation) score += 0.18;
  if (reference.region) score += 0.12;
  if (reference.color) score += 0.12;
  return clamp(Math.round(score * 100) / 100, 0, 1);
}

function getLibrarySourceLabel(reference = {}) {
  if (reference.source === "seed") return "Référence seed";
  if (reference.source === "remote") return "Bibliothèque commune";
  if (reference.source === "scan") return "Scan utilisateur";
  if (reference.source === "import") return "Import";
  if (reference.source === "user") return "Ajout utilisateur";
  return "Local";
}

function libraryReferenceToSupabaseRow(reference) {
  const normalized = normalizeLibraryReference(reference);
  const source = normalized.source === "scan" ? "scan" : normalized.source === "import" ? "import" : "user";
  return {
    domain: normalized.domain,
    cuvee: normalized.cuvee,
    appellation: normalized.appellation || null,
    region: normalized.region || null,
    country: normalized.country || "France",
    color: normalized.color || "Inconnu",
    grape_varieties: normalized.grapeVarieties || [],
    source,
    review_status: normalized.reviewStatus || "community",
    confidence_score: normalized.confidenceScore,
    created_by: authState.user?.id || null,
    updated_at: new Date().toISOString()
  };
}

function remoteLibraryRowToReference(row = {}) {
  return normalizeLibraryReference({
    ...row,
    id: row.id,
    remoteId: row.id,
    knownVintages: Array.isArray(row.wine_vintages) ? row.wine_vintages.map((item) => item.vintage) : [],
    aliases: Array.isArray(row.wine_aliases) ? row.wine_aliases.map((item) => item.alias) : [],
    grapeVarieties: row.grape_varieties || [],
    reviewStatus: row.review_status,
    confidenceScore: row.confidence_score,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pendingSync: false,
    source: row.source === "seed" ? "seed" : "remote"
  });
}

async function insertRemoteLibraryReference(row) {
  const client = getSupabaseClient();
  if (client?.from) {
    const { data, error } = await client
      .from("wine_references")
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const rows = await supabaseRestRequest("/wine_references", {
    method: "POST",
    body: [row],
    prefer: "return=representation"
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

function mergeRemoteLibraryReferences(remoteReferences = []) {
  let changed = false;
  remoteReferences.map(normalizeLibraryReference).forEach((reference) => {
    const before = wineLibrary.length;
    addOrUpdateLibraryWine({ ...reference, pendingSync: false }, { persist: false, silent: true, rebuildCache: false });
    changed = changed || wineLibrary.length !== before;
  });
  if (changed || remoteReferences.length) {
    rebuildLibraryDerivedCaches();
    saveWineLibrary(wineLibrary);
  }
  return changed;
}

function queueLibrarySync(reference) {
  const queued = normalizeLibraryReference({ ...reference, pendingSync: true });
  const key = getLibraryReferenceKey(queued);
  const existingIndex = pendingLibrarySyncQueue.findIndex((item) => getLibraryReferenceKey(item) === key);
  if (existingIndex >= 0) {
    pendingLibrarySyncQueue[existingIndex] = mergeLibraryData(pendingLibrarySyncQueue[existingIndex], queued);
  } else {
    pendingLibrarySyncQueue = [queued, ...pendingLibrarySyncQueue].slice(0, 250);
  }
  savePendingLibrarySyncQueue(pendingLibrarySyncQueue);
  renderSyncStatus();
  return queued;
}

async function syncPendingLibraryReferences(options = {}) {
  if (!pendingLibrarySyncQueue.length || !isCloudConfigured() || !isSignedIn()) {
    renderSyncStatus();
    return { synced: 0, pending: pendingLibrarySyncQueue.length };
  }
  const remaining = [];
  let synced = 0;
  for (const reference of pendingLibrarySyncQueue) {
    try {
      await upsertLibraryReference(reference, { fromQueue: true });
      synced += 1;
    } catch (error) {
      remaining.push(reference);
      logError(error, "syncPendingLibraryReferences");
    }
  }
  savePendingLibrarySyncQueue(remaining);
  renderSyncStatus();
  if (!options.silent) {
    showStatus(synced ? `${synced} référence(s) synchronisée(s).` : "Aucune référence à synchroniser.");
  }
  return { synced, pending: remaining.length };
}

function renderSyncStatus() {
  if (!elements.librarySyncStatus) return;
  const configured = isCloudConfigured();
  const signedIn = isSignedIn();
  const pending = pendingLibrarySyncQueue.length;
  const hasRemoteError = Boolean(libraryRemoteState.lastError);
  elements.librarySyncStatus.className = `pill ${libraryRemoteState.isLoading || pending || hasRemoteError ? "warning" : configured ? "ready" : "neutral"}`;
  elements.librarySyncStatus.textContent = !configured
    ? "Recherche locale"
    : libraryRemoteState.isLoading
      ? "Recherche Supabase"
      : hasRemoteError
        ? "Supabase indisponible"
        : pending
          ? `${pending} en attente`
          : signedIn
            ? "Recherche connectee"
            : libraryRemoteState.loaded
              ? "Recherche connectee"
              : "Base vins connectee";
}

function getMissingWineData(reference = {}) {
  const normalized = normalizeLibraryReference(reference);
  return LIBRARY_REQUIRED_AI_FIELDS.filter((field) => {
    const value = normalized[field.key];
    if (field.type === "array") return !Array.isArray(value) || !value.length;
    if (field.type === "year") return !normalizeYear(value);
    if (field.type === "enum") return !value || value === field.emptyValue;
    return !cleanString(value);
  });
}

function getWineDataQualityScore(reference = {}) {
  const missing = getMissingWineData(reference).length;
  const total = LIBRARY_REQUIRED_AI_FIELDS.length;
  return total ? Math.round(((total - missing) / total) * 100) : 100;
}

function getReviewStatusLabel(status) {
  return {
    verified: "Validee",
    community: "Communautaire",
    pending_review: "A relire",
    rejected: "Rejetee",
    duplicate: "Doublon"
  }[status] || "Communautaire";
}

function hasPendingAiRequest(referenceId) {
  return aiEnrichmentQueue.some((request) => request.wineReferenceId === referenceId && ["pending", "processing"].includes(request.status));
}

function queueAiEnrichmentForReference(reference, fields = getMissingWineData(reference)) {
  if (!reference?.id || !fields.length) return null;
  const fieldKeys = fields.map((field) => typeof field === "string" ? field : field.key).filter(Boolean);
  const existing = aiEnrichmentQueue.find((request) => request.wineReferenceId === reference.id && request.status === "pending");
  if (existing) {
    existing.requestedFields = uniqueValues([...existing.requestedFields, ...fieldKeys]);
    existing.createdAt = existing.createdAt || new Date().toISOString();
    saveAiEnrichmentQueue(aiEnrichmentQueue);
    return existing;
  }
  const request = normalizeAiEnrichmentRequest({
    wineReferenceId: reference.id,
    requestedFields: fieldKeys,
    requestType: "complete_reference",
    status: "pending",
    createdBy: authState.user?.id || "local-user"
  });
  aiEnrichmentQueue = [request, ...aiEnrichmentQueue].slice(0, 300);
  saveAiEnrichmentQueue(aiEnrichmentQueue);
  return request;
}

function scanLibraryForMissingData() {
  let queued = 0;
  wineLibrary.forEach((reference) => {
    const missing = getMissingWineData(reference);
    if (!missing.length || hasPendingAiRequest(reference.id)) return;
    queueAiEnrichmentForReference(reference, missing);
    queued += 1;
  });
  render({ targets: ["library"] });
  showStatus(queued ? `${queued} fiche(s) ajoutee(s) a la file d'enrichissement.` : "Aucune fiche incomplete a ajouter.");
}

function exportAiEnrichmentQueue() {
  downloadFile(JSON.stringify({
    appVersion: APP_VERSION,
    createdAt: new Date().toISOString(),
    responseSchema: WINE_REFERENCE_ENRICHMENT_SCHEMA,
    queue: aiEnrichmentQueue
  }, null, 2), `cave-a-vin-file-ia-${today()}.json`, "application/json");
  showStatus("File d'enrichissement exportee.");
}

function clearCompletedAiQueue() {
  const before = aiEnrichmentQueue.length;
  aiEnrichmentQueue = aiEnrichmentQueue.filter((request) => !["completed", "cancelled"].includes(request.status));
  saveAiEnrichmentQueue(aiEnrichmentQueue);
  render({ targets: ["library"] });
  showStatus(`${before - aiEnrichmentQueue.length} demande(s) nettoyee(s).`);
}

async function ensureRemoteLibraryLoaded(options = {}) {
  const query = cleanString(options.query || "");
  if (!isCloudConfigured()) {
    renderSyncStatus();
    return { ok: false, count: 0, reason: "cloud-not-configured" };
  }
  if (libraryRemoteState.isLoading) return { ok: true, count: libraryRemoteState.lastCount, loading: true };
  if (!options.force && libraryRemoteState.loaded && libraryRemoteState.lastQuery === query) {
    renderSyncStatus();
    return { ok: true, count: libraryRemoteState.lastCount, cached: true };
  }

  libraryRemoteState = {
    ...libraryRemoteState,
    isLoading: true,
    lastError: "",
    lastQuery: query
  };
  renderSyncStatus();

  try {
    const before = wineLibrary.length;
    const remote = await searchRemoteWineLibrary(query);
    const added = Math.max(0, wineLibrary.length - before);
    libraryRemoteState = {
      ...libraryRemoteState,
      isLoading: false,
      loaded: true,
      lastLoadedAt: new Date().toISOString(),
      lastError: "",
      lastCount: remote.length
    };
    render({ targets: ["library"] });
    if (!options.silent) {
      showStatus(`${remote.length} reference(s) lue(s) dans la base vins${added ? `, ${added} ajoutee(s) localement` : ""}.`);
    }
    return { ok: true, count: remote.length, added };
  } catch (error) {
    libraryRemoteState = {
      ...libraryRemoteState,
      isLoading: false,
      loaded: false,
      lastError: error?.message || String(error)
    };
    renderSyncStatus();
    logError(error, "ensureRemoteLibraryLoaded");
    if (!options.silent) showStatus("Impossible de charger la base vins Supabase.", "error");
    return { ok: false, count: 0, error };
  }
}

function renderLibraryAdminTools() {
  if (!elements.libraryAdminTools) return;
  const remoteLabel = libraryRemoteState.isLoading
    ? "Recherche en cours dans Supabase"
    : libraryRemoteState.loaded
      ? `${libraryRemoteState.lastCount} resultat(s) depuis Supabase`
      : isCloudConfigured()
        ? "Base Supabase connectee"
        : "Recherche locale uniquement";
  elements.libraryAdminTools.innerHTML = `
    <div>
      <strong>Bibliotheque connectee</strong>
      <p>La barre de recherche interroge vos references locales et la base vins Supabase automatiquement.</p>
      <p>${escapeHtml(remoteLabel)}</p>
    </div>
  `;
}

function handleLibraryAdminToolsClick(event) {
  const button = event.target.closest("[data-library-admin-action]");
  if (!button) return;
  if (button.dataset.libraryAdminAction === "scan-missing") scanLibraryForMissingData();
  if (button.dataset.libraryAdminAction === "export-ai-queue") exportAiEnrichmentQueue();
  if (button.dataset.libraryAdminAction === "clear-ai-queue") clearCompletedAiQueue();
}

function markLibraryReferenceReviewStatus(referenceId, status) {
  const reference = wineLibrary.find((item) => item.id === referenceId);
  if (!reference) return;
  reference.reviewStatus = status;
  reference.lastReviewedAt = new Date().toISOString();
  reference.verifiedBy = authState.user?.email || "validation locale";
  reference.updatedAt = new Date().toISOString();
  reference.pendingSync = true;
  rebuildLibraryDerivedCaches();
  saveWineLibrary(wineLibrary);
  queueLibrarySync(reference);
  render({ targets: ["library"] });
  showStatus(status === "verified" ? "Reference validee localement." : "Reference marquee a relire.");
}

function buildWineReferenceEnrichmentPrompt(reference, missingFields = getMissingWineData(reference)) {
  const normalized = normalizeLibraryReference(reference);
  return {
    task: "wine_reference_enrichment",
    language: "fr",
    constraints: [
      "Ne pas inventer de certitude forte sans source.",
      "Retourner uniquement du JSON conforme au schema.",
      "Ne pas demander de cle API au navigateur."
    ],
    missingFields: missingFields.map((field) => field.key),
    reference: {
      id: normalized.id,
      domain: normalized.domain,
      cuvee: normalized.cuvee,
      color: normalized.color,
      region: normalized.region,
      appellation: normalized.appellation,
      country: normalized.country,
      knownVintages: normalized.knownVintages
    },
    responseSchema: WINE_REFERENCE_ENRICHMENT_SCHEMA
  };
}

function validateWineReferenceEnrichmentPayload(payload = {}) {
  if (!payload || typeof payload !== "object") return { valid: false, message: "Payload absent." };
  if (payload.recommendations) return { valid: false, message: "Schema conseil recu au lieu du schema reference." };
  const fields = payload.fields && typeof payload.fields === "object" ? payload.fields : payload;
  return { valid: Boolean(fields), fields };
}

async function requestWineReferenceEnrichment(reference) {
  const missing = getMissingWineData(reference);
  if (!missing.length) {
    showStatus("Cette reference est deja suffisamment complete.");
    return null;
  }
  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 1500);
    const response = await fetch("/api/wine-reference-enrichment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWineReferenceEnrichmentPrompt(reference, missing)),
      signal: controller.signal
    });
    window.clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Route IA non disponible.");
    const payload = await response.json();
    const validation = validateWineReferenceEnrichmentPayload(payload);
    if (!validation.valid) throw new Error(validation.message);
    const enriched = addOrUpdateLibraryWine({
      ...reference,
      ...validation.fields,
      dataSource: payload.dataSource || "ai",
      confidenceScore: payload.confidenceScore || reference.confidenceScore,
      reviewStatus: "pending_review"
    });
    saveWineLibrary(wineLibrary);
    render({ targets: ["library"] });
    return enriched;
  } catch (error) {
    queueAiEnrichmentForReference(reference, missing);
    logError(error, "requestWineReferenceEnrichment");
    render({ targets: ["library"] });
    showStatus("Route IA absente : demande ajoutee a la file locale.");
    return null;
  }
}

function renderLibrary() {
  if (!elements.libraryList) return;
  renderSyncStatus();
  renderLibraryAdminTools();
  updateLibraryFilterOptions();
  const term = elements.librarySearchInput?.value || "";
  const color = elements.libraryColorFilter?.value || "all";
  const region = elements.libraryRegionFilter?.value || "all";
  const appellation = elements.libraryAppellationFilter?.value || "all";
  const matches = term ? findLibraryMatches(term) : [...wineLibrary];
  const filtered = matches
    .filter((reference) => color === "all" || reference.color === color)
    .filter((reference) => region === "all" || reference.region === region)
    .filter((reference) => appellation === "all" || reference.appellation === appellation)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  elements.libraryCount.textContent = `${filtered.length} référence${filtered.length > 1 ? "s" : ""}`;
  elements.libraryList.innerHTML = "";
  if (!filtered.length) {
    elements.libraryList.innerHTML = `<p class="soft-empty">Aucune référence pour ces critères. Les prochains ajouts alimenteront la bibliothèque.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.slice(0, 120).forEach((reference) => {
    const duplicates = getLibraryDuplicates(reference);
    const missing = getMissingWineData(reference);
    const quality = getWineDataQualityScore(reference);
    const pendingAi = hasPendingAiRequest(reference.id);
    const card = document.createElement("article");
    card.className = "library-card";
    card.innerHTML = `
      <div>
        <p class="eyebrow">${escapeHtml(formatColorLabel(reference.color))}${reference.region ? ` · ${escapeHtml(reference.region)}` : ""}</p>
        <h3>${escapeHtml(reference.domain)}</h3>
        <p>${escapeHtml(reference.cuvee)}${reference.appellation ? ` · ${escapeHtml(reference.appellation)}` : ""}</p>
        ${missing.length ? `<p class="library-missing">A completer : ${missing.slice(0, 4).map((field) => escapeHtml(field.label)).join(", ")}${missing.length > 4 ? "..." : ""}</p>` : `<p class="library-missing ready">Fiche suffisamment complete pour les conseils locaux.</p>`}
        <div class="tag-list">
          ${(reference.knownVintages || []).slice(0, 8).map((vintage) => `<span class="tag-badge">${escapeHtml(vintage)}</span>`).join("")}
          <span class="pill neutral">${escapeHtml(getLibrarySourceLabel(reference))}</span>
          <span class="pill ${reference.confidenceScore >= 0.7 ? "ready" : "warning"}">Confiance ${Math.round(reference.confidenceScore * 100)}%</span>
          <span class="pill ${quality >= 70 ? "ready" : "warning"}">Completude ${quality}%</span>
          <span class="pill ${reference.reviewStatus === "verified" ? "ready" : reference.reviewStatus === "pending_review" ? "warning" : "neutral"}">${escapeHtml(getReviewStatusLabel(reference.reviewStatus))}</span>
          ${pendingAi ? `<span class="pill warning">Enrichissement en attente</span>` : ""}
          ${reference.pendingSync ? `<span class="pill warning">À synchroniser</span>` : ""}
          ${duplicates.length ? `<span class="pill warning">${duplicates.length} doublon possible</span>` : ""}
        </div>
      </div>
      <div class="library-actions">
        <button class="card-action" type="button" data-library-action="use" data-id="${escapeAttribute(reference.id)}">Utiliser</button>
        <button class="card-action" type="button" data-library-action="edit" data-id="${escapeAttribute(reference.id)}">Modifier</button>
        <button class="card-action" type="button" data-library-action="merge" data-id="${escapeAttribute(reference.id)}">Fusionner</button>
      </div>
    `;
    fragment.append(card);
  });
  elements.libraryList.append(fragment);
}

function updateLibraryFilterOptions() {
  if (!elements.libraryColorFilter) return;
  updateSelectOptions(elements.libraryColorFilter, uniqueValues(wineLibrary.map((item) => item.color)), "Toutes", "all");
  updateSelectOptions(elements.libraryRegionFilter, uniqueValues(wineLibrary.map((item) => item.region).filter(Boolean)), "Toutes", "all");
  updateSelectOptions(elements.libraryAppellationFilter, uniqueValues(wineLibrary.map((item) => item.appellation).filter(Boolean)), "Toutes", "all");
}

function getFormLibraryQuery() {
  return [fields.domain.value, fields.cuvee.value].filter(Boolean).join(" ");
}

function handleLibrarySearchInput() {
  scheduleRender("library");
  scheduleLibraryRemoteSearch(elements.librarySearchInput?.value || "");
}

function handleLibrarySuggestionInput() {
  const query = getFormLibraryQuery();
  renderLibrarySuggestions(findLibraryMatches(query).slice(0, 5));
  scheduleLibraryRemoteSearch(query, { suggestions: true });
}

function scheduleLibraryRemoteSearch(query, options = {}) {
  window.clearTimeout(librarySearchTimer);
  const cleaned = cleanString(query);
  if (!isCloudConfigured()) {
    renderSyncStatus();
    return;
  }
  if (cleaned.length < 2) {
    const shouldRefreshFullLibrary = !cleaned && (!libraryRemoteState.loaded || libraryRemoteState.lastQuery);
    libraryRemoteState = {
      ...libraryRemoteState,
      isLoading: false,
      lastError: "",
      lastQuery: cleaned
    };
    renderSyncStatus();
    if (shouldRefreshFullLibrary) {
      librarySearchTimer = window.setTimeout(() => {
        ensureRemoteLibraryLoaded({ query: "", force: true, silent: true });
      }, 150);
    }
    return;
  }
  libraryRemoteState = {
    ...libraryRemoteState,
    isLoading: true,
    lastError: "",
    lastQuery: cleaned
  };
  renderSyncStatus();
  librarySearchTimer = window.setTimeout(async () => {
    try {
      const results = await searchWineLibrary(cleaned);
      const liveQuery = options.suggestions
        ? cleanString(getFormLibraryQuery())
        : cleanString(elements.librarySearchInput?.value || "");
      if (liveQuery !== cleaned) {
        libraryRemoteState = {
          ...libraryRemoteState,
          isLoading: false
        };
        renderSyncStatus();
        return;
      }
      libraryRemoteState = {
        ...libraryRemoteState,
        isLoading: false,
        loaded: true,
        lastLoadedAt: new Date().toISOString(),
        lastError: "",
        lastCount: results.length,
        lastQuery: cleaned
      };
      if (options.suggestions) {
        renderLibrarySuggestions(results.slice(0, 5));
      } else {
        renderLibrarySearchResults(results);
      }
      renderSyncStatus();
    } catch (error) {
      libraryRemoteState = {
        ...libraryRemoteState,
        isLoading: false,
        loaded: false,
        lastError: error?.message || String(error)
      };
      renderSyncStatus();
      logError(error, "scheduleLibraryRemoteSearch");
    }
  }, 350);
}

function renderLibrarySearchResults(results = []) {
  mergeRemoteLibraryReferences(results.filter((reference) => reference.remoteId));
  if (activeView === "library") render({ targets: ["library"] });
  return results;
}

function renderLibrarySuggestions(matches = []) {
  if (!elements.librarySuggestions) return;
  const query = getFormLibraryQuery();
  if (!query.trim() || !matches.length || !elements.dialog.open) {
    elements.librarySuggestions.hidden = true;
    elements.librarySuggestions.innerHTML = "";
    return;
  }
  elements.librarySuggestions.hidden = false;
  elements.librarySuggestions.innerHTML = `
    <p>Références proches</p>
    ${matches.map((reference) => `
      <button type="button" class="library-suggestion" data-library-suggestion="${escapeAttribute(reference.id)}">
        <strong>${escapeHtml(reference.domain)}</strong>
        <span>${escapeHtml(reference.cuvee)}${reference.region ? ` · ${escapeHtml(reference.region)}` : ""}</span>
      </button>
    `).join("")}
  `;
}

function handleLibrarySuggestionsClick(event) {
  const button = event.target.closest("[data-library-suggestion]");
  if (!button) return;
  const reference = wineLibrary.find((item) => item.id === button.dataset.librarySuggestion);
  if (reference) applyLibraryReferenceToForm(reference);
}

function applyLibraryReferenceToForm(reference) {
  if (!reference) return;
  if (!elements.dialog.open) openForm();
  fields.domain.value = reference.domain;
  fields.cuvee.value = reference.cuvee;
  fields.color.value = reference.color === "Inconnu" ? "Rouge" : reference.color;
  fields.region.value = reference.region;
  fields.appellation.value = reference.appellation;
  if (reference.knownVintages?.length && !fields.vintage.value) {
    fields.vintage.value = reference.knownVintages.at(-1);
  }
  renderLibrarySuggestions([]);
  showStatus("Référence chargée dans le formulaire.");
}

function applyLibraryReferenceToWineForm(reference) {
  return applyLibraryReferenceToForm(reference);
}

function readWineFromCurrentForm() {
  return normalizeWine({
    domain: fields.domain.value,
    cuvee: fields.cuvee.value,
    color: fields.color.value,
    region: fields.region.value,
    appellation: fields.appellation.value,
    vintage: fields.vintage.value,
    quantity: fields.quantity.value || 1,
    price: fields.price.value,
    drinkFrom: fields.drinkFrom.value,
    drinkTo: fields.drinkTo.value,
    notes: fields.notes.value,
    format: fields.format.value,
    status: fields.status.value,
    purchasePrice: fields.purchasePrice.value || fields.price.value,
    estimatedValue: fields.estimatedValue.value || fields.price.value,
    cellarName: fields.cellarName.value,
    rack: fields.rack.value,
    row: fields.row.value,
    column: fields.column.value,
    tags: fields.tags.value,
    favorite: fields.favorite.checked,
    photo: elements.photoInputHidden.value,
    photoThumb: elements.photoThumbInputHidden.value
  });
}

async function searchWineLibrary(query) {
  const local = searchLocalWineLibrary(query);
  const remote = await searchRemoteWineLibrary(query);
  const byKey = new Map();
  [...local, ...remote].forEach((reference) => {
    byKey.set(getLibraryReferenceKey(reference), reference);
  });
  return [...byKey.values()];
}

function searchLocalWineLibrary(query) {
  return findLibraryMatches(query);
}

async function searchRemoteWineLibrary(query = "") {
  if (!isCloudConfigured()) return [];
  const term = cleanString(query).replace(/[%,()]/g, " ").trim();
  try {
    await initSupabase();
    const client = getSupabaseClient();
    if (client?.from) {
      let request = client
        .from("wine_references")
        .select("*, wine_vintages(vintage, drink_from, drink_to), wine_aliases(alias)")
        .in("review_status", ["verified", "community"])
        .order("updated_at", { ascending: false })
        .limit(30);
      if (term) {
        const like = `%${term}%`;
        request = request.or(`domain.ilike.${like},cuvee.ilike.${like},region.ilike.${like},appellation.ilike.${like}`);
      }
      const { data, error } = await request;
      if (error) throw error;
      const references = (data || []).map(remoteLibraryRowToReference);
      mergeRemoteLibraryReferences(references);
      return references;
    }

    const params = new URLSearchParams();
    params.set("select", "*,wine_vintages(vintage,drink_from,drink_to),wine_aliases(alias)");
    params.set("review_status", "in.(verified,community)");
    params.set("order", "updated_at.desc");
    params.set("limit", "30");
    if (term) {
      params.set("or", `(domain.ilike.*${term}*,cuvee.ilike.*${term}*,region.ilike.*${term}*,appellation.ilike.*${term}*)`);
    }
    const rows = await supabaseRestRequest(`/wine_references?${params.toString()}`, { method: "GET" });
    const references = (Array.isArray(rows) ? rows : []).map(remoteLibraryRowToReference);
    mergeRemoteLibraryReferences(references);
    return references;
  } catch (error) {
    logError(error, "searchRemoteWineLibrary");
    renderSyncStatus();
    return [];
  }
}

async function submitWineReference() {
  const reference = createLibraryReferenceFromWine(readWineFromCurrentForm());
  return upsertLibraryReference(reference);
}

async function syncWineLibrary() {
  try {
    const pending = await syncPendingLibraryReferences({ silent: true });
    const remote = await ensureRemoteLibraryLoaded({
      force: true,
      silent: true,
      query: elements.librarySearchInput?.value || ""
    });
    render({ targets: ["library"] });
    showStatus(`Base vins chargee : ${remote.count || 0} reference(s) distante(s), ${pending.pending} en attente.`);
  } catch (error) {
    handleCloudError(error, "syncWineLibrary");
  }
}

function resolveLibraryConflict(localReference) {
  return localReference;
}

// Cave virtuelle 2D
function ensureCellarLayouts(layouts = []) {
  const normalized = layouts.map(normalizeCellarLayout).filter(Boolean);
  if (normalized.length) return normalized;
  return [createCellarLayout({
    name: "Cave principale",
    type: "cellar",
    layoutMode: "grid",
    rows: 6,
    columns: 8,
    levels: 1,
    capacity: 1
  })];
}

function createCellarLayout(config = {}) {
  const rows = clamp(Math.round(toNumber(config.rows, 6)), 1, 30);
  const columns = clamp(Math.round(toNumber(config.columns, 8)), 1, 30);
  const levels = clamp(Math.round(toNumber(config.levels, 1)), 1, 8);
  const layoutMode = ["grid", "staggered", "stacked", "custom"].includes(config.layoutMode) ? config.layoutMode : "grid";
  const capacity = clamp(Math.round(toNumber(config.capacity || config.slotCapacity, 1)), 1, 12);
  const now = new Date().toISOString();
  return normalizeCellarLayout({
    id: config.id || crypto.randomUUID(),
    name: config.name || "Cave principale",
    type: config.type || "cellar",
    layoutMode,
    rows,
    columns,
    levels,
    capacity,
    slotShape: config.slotShape || "bottle",
    createdAt: config.createdAt || now,
    updatedAt: now,
    slots: generateSlotsForLayout({ rows, columns, levels, layoutMode, capacity })
  });
}

function generateSlotsForLayout(config = {}) {
  if (config.layoutMode === "staggered") return generateStaggeredSlots(config.rows, config.columns, config.capacity);
  if (config.layoutMode === "stacked") return generateStackedSlots(config.rows, config.columns, config.levels, config.capacity);
  return generateGridSlots(config.rows, config.columns, config.capacity);
}

function generateGridSlots(rows = 6, columns = 8, capacity = 1) {
  const slots = [];
  for (let row = 1; row <= rows; row += 1) {
    for (let column = 1; column <= columns; column += 1) {
      slots.push({
        id: crypto.randomUUID(),
        row,
        column,
        level: 1,
        x: column,
        y: row,
        label: getSlotLabel(row, column, 1),
        capacity,
        wineIds: []
      });
    }
  }
  return slots;
}

function generateStaggeredSlots(rows = 6, columns = 8, capacity = 1) {
  return generateGridSlots(rows, columns, capacity).map((slot) => ({
    ...slot,
    x: slot.column + (slot.row % 2 === 0 ? 0.45 : 0),
    label: getSlotLabel(slot.row, slot.column, 1)
  }));
}

function generateStackedSlots(rows = 6, columns = 8, levels = 2, capacity = 2) {
  const slots = [];
  for (let level = 1; level <= levels; level += 1) {
    for (let row = 1; row <= rows; row += 1) {
      for (let column = 1; column <= columns; column += 1) {
        slots.push({
          id: crypto.randomUUID(),
          row,
          column,
          level,
          x: column,
          y: row + (level - 1) * (rows + 0.8),
          label: getSlotLabel(row, column, level),
          capacity,
          wineIds: []
        });
      }
    }
  }
  return slots;
}

function updateCellarLayout(layoutId, config = {}) {
  const index = cellarLayouts.findIndex((layout) => layout.id === layoutId);
  if (index < 0) return null;
  const current = cellarLayouts[index];
  const nextBase = {
    ...current,
    ...config,
    rows: clamp(Math.round(toNumber(config.rows ?? current.rows, current.rows)), 1, 30),
    columns: clamp(Math.round(toNumber(config.columns ?? current.columns, current.columns)), 1, 30),
    levels: clamp(Math.round(toNumber(config.levels ?? current.levels, current.levels)), 1, 8),
    capacity: clamp(Math.round(toNumber(config.capacity ?? current.capacity, current.capacity)), 1, 12),
    updatedAt: new Date().toISOString()
  };
  const oldSlotsByLabel = new Map(current.slots.map((slot) => [slot.label, slot]));
  const generatedSlots = generateSlotsForLayout(nextBase).map((slot) => ({
    ...slot,
    id: oldSlotsByLabel.get(slot.label)?.id || slot.id
  }));
  cellarLayouts[index] = normalizeCellarLayout({ ...nextBase, slots: generatedSlots });
  repairInvalidWinePositions();
  saveCellarLayouts(cellarLayouts);
  saveCellar(wines);
  rebuildCellarLayoutCache();
  return cellarLayouts[index];
}

function deleteCellarLayout(layoutId) {
  if (cellarLayouts.length <= 1) {
    showStatus("Gardez au moins une cave virtuelle.", "error");
    return false;
  }
  cellarLayouts = cellarLayouts.filter((layout) => layout.id !== layoutId);
  wines.forEach((wine) => {
    if (wine.cellarLayoutId === layoutId) removeWineFromSlot(wine.id, { silent: true });
  });
  activeCellarLayoutId = cellarLayouts[0]?.id || "";
  saveCellarLayouts(cellarLayouts);
  saveCellar(wines);
  rebuildCellarLayoutCache();
  render({ targets: ["cellar", "inventory"] });
  return true;
}

function getActiveCellarLayout() {
  if (!cellarLayouts.length) cellarLayouts = ensureCellarLayouts(cellarLayouts);
  return cellarLayouts.find((layout) => layout.id === activeCellarLayoutId) || cellarLayouts[0];
}

function getSlotLabel(row, column, level = 1) {
  const rowLabel = String.fromCharCode(64 + clamp(Math.round(row), 1, 26));
  return `${level > 1 ? `N${level}-` : ""}${rowLabel}${column}`;
}

function invalidateCellarLayoutCache() {
  cellarLayoutCache = {
    layoutsById: new Map(),
    slotsById: new Map(),
    winesBySlot: new Map(),
    unplacedWines: []
  };
}

function rebuildCellarLayoutCache() {
  const layoutsById = new Map(cellarLayouts.map((layout) => [layout.id, layout]));
  const slotsById = new Map();
  cellarLayouts.forEach((layout) => {
    layout.slots.forEach((slot) => slotsById.set(slot.id, { layout, slot }));
  });
  const winesBySlot = new Map();
  const unplacedWines = [];
  wines
    .filter((wine) => wine.quantity > 0 && !["bu", "vendu", "offert"].includes(wine.status))
    .forEach((wine) => {
      if (wine.slotId && slotsById.has(wine.slotId)) {
        pushMapValue(winesBySlot, wine.slotId, wine);
      } else {
        unplacedWines.push(wine);
      }
    });
  cellarLayoutCache = { layoutsById, slotsById, winesBySlot, unplacedWines };
  return cellarLayoutCache;
}

function syncCellarLayoutWithWines(options = {}) {
  cellarLayouts = ensureCellarLayouts(cellarLayouts);
  const defaultLayout = cellarLayouts[0];
  rebuildCellarLayoutCache();
  wines.forEach((wine) => {
    if (wine.slotId || !wine.row || !wine.column) return;
    const layout = cellarLayouts.find((item) => normalizeSearchText(item.name) === normalizeSearchText(wine.cellarName)) || defaultLayout;
    const slot = layout?.slots.find((item) => Number(item.row) === toNumber(wine.row, 0)
      && Number(item.column) === toNumber(wine.column, 0)
      && Number(item.level) === toNumber(wine.level, 1));
    if (slot && canPlaceWineInSlot(wine.id, slot.id)) {
      applySlotToWine(wine, slot, layout);
    }
  });
  repairInvalidWinePositions();
  if (options.persist !== false) {
    saveCellar(wines);
    saveCellarLayouts(cellarLayouts);
  }
  rebuildCellarLayoutCache();
}

function validateWinePositions() {
  rebuildCellarLayoutCache();
  return wines.filter((wine) => wine.slotId && !cellarLayoutCache.slotsById.has(wine.slotId));
}

function repairInvalidWinePositions() {
  const invalid = validateWinePositions();
  invalid.forEach((wine) => removeWineFromSlot(wine.id, { silent: true }));
  rebuildCellarLayoutCache();
  return invalid.length;
}

function getUnplacedWines() {
  rebuildCellarLayoutCache();
  return cellarLayoutCache.unplacedWines;
}

function renderVirtualCellar() {
  if (!elements.virtualCellarGrid) return;
  cellarLayouts = ensureCellarLayouts(cellarLayouts);
  if (!activeCellarLayoutId) activeCellarLayoutId = cellarLayouts[0].id;
  rebuildCellarLayoutCache();
  const layout = getActiveCellarLayout();
  renderCellarLayoutSelect(layout);
  renderCellarConfigForm(layout);
  renderCellarStats();
  renderCellarLegend();
  renderCellarGrid(layout);
  renderUnplacedWines();
}

function renderCellarPreview() {
  if (!elements.cellarPreview) return;
  cellarLayouts = ensureCellarLayouts(cellarLayouts);
  rebuildCellarLayoutCache();
  const layout = getActiveCellarLayout();
  const stats = getCellarLayoutStats(layout.id);
  elements.cellarPreview.innerHTML = `
    <div class="cellar-preview-meter" style="--occupancy:${stats.occupancyRate}%">
      <span></span>
    </div>
    <div class="compact-stats">
      <span class="compact-stat">${escapeHtml(layout.name)}</span>
      <span class="compact-stat">${stats.occupiedSlots}/${stats.totalSlots} occupes</span>
      <span class="compact-stat">${stats.unplacedCount} a placer</span>
    </div>
  `;
}

function toggleCellarConfigPanel() {
  if (!elements.cellarConfigForm) return;
  elements.cellarConfigForm.classList.toggle("is-highlighted");
  elements.cellarConfigForm.scrollIntoView({ behavior: uiPreferences.motion === "off" ? "auto" : "smooth", block: "nearest" });
  elements.cellarLayoutNameInput?.focus();
}

function renderCellarLayoutSelect(activeLayout) {
  if (!elements.cellarLayoutSelect) return;
  elements.cellarLayoutSelect.innerHTML = cellarLayouts.map((layout) => (
    `<option value="${escapeAttribute(layout.id)}"${layout.id === activeLayout.id ? " selected" : ""}>${escapeHtml(layout.name)}</option>`
  )).join("");
}

function renderCellarConfigForm(layout) {
  if (!layout || !elements.cellarConfigForm) return;
  elements.cellarLayoutNameInput.value = layout.name;
  elements.cellarLayoutTypeInput.value = layout.type;
  elements.cellarLayoutModeInput.value = layout.layoutMode;
  elements.cellarRowsInput.value = layout.rows;
  elements.cellarColumnsInput.value = layout.columns;
  elements.cellarLevelsInput.value = layout.levels;
  elements.cellarSlotCapacityInput.value = layout.capacity;
}

function renderCellarGrid(layout) {
  elements.virtualCellarGrid.innerHTML = "";
  elements.virtualCellarGrid.dataset.mode = layout.layoutMode;
  elements.virtualCellarGrid.style.setProperty("--cellar-columns", layout.columns);
  const fragment = document.createDocumentFragment();
  layout.slots.forEach((slot) => {
    const winesInSlot = getWinesInSlot(slot.id);
    if (!uiPreferences.cellarShowEmptySlots && !winesInSlot.length) return;
    fragment.append(renderCellarSlot(slot, winesInSlot));
  });
  elements.virtualCellarGrid.append(fragment);
}

function renderCellarSlot(slot, slotWines = getWinesInSlot(slot.id)) {
  const button = document.createElement("button");
  const occupancy = getSlotOccupancy(slot.id);
  button.type = "button";
  button.className = `cellar-slot ${occupancy.count ? "is-occupied" : "is-empty"} ${isSlotFull(slot.id) ? "is-full" : ""} ${cellarMoveMode.sourceSlotId === slot.id ? "is-selected" : ""}`;
  button.dataset.slotId = slot.id;
  button.dataset.color = slotWines[0]?.color || "";
  button.style.setProperty("--slot-x", slot.x);
  button.style.setProperty("--slot-y", slot.y);
  button.setAttribute("role", "gridcell");
  button.setAttribute("aria-label", renderSlotTooltip(slot, slotWines));
  button.innerHTML = `
    <span class="slot-visual">${slotWines.length ? renderBottleInSlot(slotWines[0], slot) : ""}</span>
    ${uiPreferences.cellarShowLabels ? `<span class="slot-label">${escapeHtml(slot.label)}</span>` : ""}
    ${occupancy.count > 1 ? `<span class="slot-count">${occupancy.count}</span>` : ""}
  `;
  return button;
}

function renderBottleInSlot(wine) {
  return `
    <span class="slot-bottle" data-color="${escapeAttribute(wine.color)}">
      <span></span>
    </span>
  `;
}

function renderSlotTooltip(slot, slotWines = []) {
  if (!slotWines.length) return `${slot.label}, emplacement libre`;
  return `${slot.label}: ${slotWines.map(wineName).join(", ")}`;
}

function renderCellarLegend() {
  if (!elements.cellarLegend) return;
  const layout = getActiveCellarLayout();
  const stats = getCellarLayoutStats(layout.id);
  elements.cellarLegend.innerHTML = `
    <span><i class="legend-dot empty"></i>${stats.freeSlots} libres</span>
    <span><i class="legend-dot occupied"></i>${stats.occupiedSlots} occupés</span>
    ${COLORS.map((color) => `<span><i class="legend-dot color-${normalizeSearchText(color)}"></i>${escapeHtml(formatColorLabel(color))}</span>`).join("")}
  `;
}

function getCellarLayoutStats(layoutId = getActiveCellarLayout()?.id) {
  const layout = cellarLayouts.find((item) => item.id === layoutId) || getActiveCellarLayout();
  const activeSlots = layout.slots;
  const occupiedSlots = activeSlots.filter((slot) => getSlotOccupancy(slot.id).count > 0).length;
  const totalSlots = activeSlots.length;
  const selectedWines = wines.filter((wine) => wine.cellarLayoutId === layout.id && wine.slotId && wine.quantity > 0);
  const byColor = countBy(selectedWines, "color");
  return {
    totalSlots,
    occupiedSlots,
    freeSlots: Math.max(0, totalSlots - occupiedSlots),
    occupancyRate: totalSlots ? Math.round((occupiedSlots / totalSlots) * 100) : 0,
    unplacedCount: getUnplacedWines().length,
    byColor
  };
}

function renderCellarStats() {
  if (!elements.cellarStats) return;
  const stats = getCellarLayoutStats();
  elements.cellarStats.innerHTML = `
    <span class="compact-stat">Emplacements: ${stats.totalSlots}</span>
    <span class="compact-stat">Occupés: ${stats.occupiedSlots}</span>
    <span class="compact-stat">Libres: ${stats.freeSlots}</span>
    <span class="compact-stat">Occupation: ${stats.occupancyRate}%</span>
    <span class="compact-stat">Non positionnées: ${stats.unplacedCount}</span>
  `;
}

function renderUnplacedWines() {
  if (!elements.unplacedWineList) return;
  const term = normalizeSearchText(elements.unplacedSearchInput?.value || "");
  const color = elements.unplacedColorFilter?.value || "all";
  const unplaced = getUnplacedWines()
    .filter((wine) => color === "all" || wine.color === color)
    .filter((wine) => !term || getComputedWine(wine).searchText.includes(term))
    .slice(0, 80);
  if (elements.unplacedCount) elements.unplacedCount.textContent = String(unplaced.length);
  elements.unplacedWineList.innerHTML = unplaced.length ? unplaced.map((wine) => `
    <article class="unplaced-wine-card">
      <div>
        <strong>${escapeHtml(wine.domain)}</strong>
        <p>${escapeHtml(wine.cuvee)} · ${wine.vintage || "NM"} · ${escapeHtml(formatColorLabel(wine.color))}</p>
      </div>
      <button class="card-action" type="button" data-place-wine="${escapeAttribute(wine.id)}">Placer</button>
    </article>
  `).join("") : `<p class="soft-empty">Toutes les bouteilles actives sont positionnées.</p>`;
}

function handleCellarConfigSubmit(event) {
  event.preventDefault();
  const layout = getActiveCellarLayout();
  updateCellarLayout(layout.id, {
    name: elements.cellarLayoutNameInput.value,
    type: elements.cellarLayoutTypeInput.value,
    layoutMode: elements.cellarLayoutModeInput.value,
    rows: elements.cellarRowsInput.value,
    columns: elements.cellarColumnsInput.value,
    levels: elements.cellarLevelsInput.value,
    capacity: elements.cellarSlotCapacityInput.value
  });
  render({ targets: ["cellar", "inventory"] });
  showStatus("Configuration de cave appliquée.");
}

function duplicateActiveCellarLayout() {
  const layout = getActiveCellarLayout();
  const clone = createCellarLayout({
    ...layout,
    id: crypto.randomUUID(),
    name: `${layout.name} copie`
  });
  cellarLayouts = [clone, ...cellarLayouts];
  activeCellarLayoutId = clone.id;
  saveCellarLayouts(cellarLayouts);
  rebuildCellarLayoutCache();
  render({ targets: ["cellar"] });
  showStatus("Configuration dupliquée.");
}

function resetActiveCellarLayout() {
  const layout = getActiveCellarLayout();
  updateCellarLayout(layout.id, {
    rows: 6,
    columns: 8,
    levels: 1,
    layoutMode: "grid",
    capacity: 1
  });
  showStatus("Plan réinitialisé en grille 6 x 8.");
}

function handleVirtualCellarClick(event) {
  const slotButton = event.target.closest("[data-slot-id]");
  if (!slotButton) return;
  const slotId = slotButton.dataset.slotId;
  const slotWines = getWinesInSlot(slotId);
  if (slotPickerState.active) {
    selectSlotForWine(slotId);
    return;
  }
  if (cellarMoveMode.enabled && !cellarMoveMode.selectedWineId && slotWines.length) {
    cellarMoveMode = { enabled: true, selectedWineId: slotWines[0].id, sourceSlotId: slotId };
    showStatus("Bouteille selectionnee. Choisissez son nouvel emplacement.");
    render({ targets: ["cellar"] });
    return;
  }
  if (cellarMoveMode.enabled && cellarMoveMode.selectedWineId) {
    confirmMoveWine(cellarMoveMode.selectedWineId, slotId);
    return;
  }
  if (slotWines.length) {
    openWineFromCellar(slotWines[0].id);
    return;
  }
  showStatus("Emplacement libre. Sélectionnez une bouteille non positionnée pour la placer ici.");
}

function handleUnplacedWineClick(event) {
  const button = event.target.closest("[data-place-wine]");
  if (!button) return;
  cellarMoveMode = { enabled: true, selectedWineId: button.dataset.placeWine, sourceSlotId: "" };
  showStatus("Choisissez un emplacement disponible sur le plan.");
}

function getWinesInSlot(slotId) {
  return cellarLayoutCache.winesBySlot.get(slotId) || [];
}

function getSlotOccupancy(slotId) {
  const slotMeta = cellarLayoutCache.slotsById.get(slotId);
  const count = getWinesInSlot(slotId).length;
  return {
    count,
    capacity: slotMeta?.slot.capacity || 1,
    free: Math.max(0, (slotMeta?.slot.capacity || 1) - count)
  };
}

function isSlotFull(slotId) {
  const occupancy = getSlotOccupancy(slotId);
  return occupancy.count >= occupancy.capacity;
}

function canPlaceWineInSlot(wineId, slotId) {
  const slotMeta = cellarLayoutCache.slotsById.get(slotId);
  if (!slotMeta) return false;
  const wine = wines.find((item) => item.id === wineId);
  if (!wine) return false;
  if (wine.slotId === slotId) return true;
  return !isSlotFull(slotId);
}

function applySlotToWine(wine, slot, layout) {
  wine.cellarLayoutId = layout.id;
  wine.slotId = slot.id;
  wine.cellarName = layout.name;
  wine.rack = slot.label;
  wine.row = String(slot.row);
  wine.column = String(slot.column);
  wine.level = slot.level;
  wine.positionLabel = `${layout.name} · ${slot.label}`;
  wine.location = wine.positionLabel;
}

function moveWineToSlot(wineId, targetSlotId) {
  rebuildCellarLayoutCache();
  const wine = wines.find((item) => item.id === wineId);
  const slotMeta = cellarLayoutCache.slotsById.get(targetSlotId);
  if (!wine || !slotMeta) return false;
  if (!canPlaceWineInSlot(wineId, targetSlotId)) {
    showStatus("Cet emplacement est plein.", "error");
    return false;
  }
  const previousLocation = getWineLocationLabel(wine) || "emplacement non défini";
  applySlotToWine(wine, slotMeta.slot, slotMeta.layout);
  invalidateWineCaches();
  rebuildCellarLayoutCache();
  addMovement("déplacement", wine, { label: `Déplacement de ${wineName(wine)} vers ${wine.positionLabel}`, quantityChange: 0 });
  saveCellar(wines);
  saveMovements(movements);
  render({ targets: ["cellar", "inventory", "alerts", "movements"] });
  showStatus(`${wineName(wine)} déplacé depuis ${previousLocation}.`);
  return true;
}

function removeWineFromSlot(wineId, options = {}) {
  const wine = wines.find((item) => item.id === wineId);
  if (!wine) return false;
  wine.cellarLayoutId = "";
  wine.slotId = "";
  wine.positionLabel = "";
  if (!options.keepLocationText) {
    wine.location = "";
    wine.rack = "";
    wine.row = "";
    wine.column = "";
    wine.level = 1;
  }
  invalidateWineCaches();
  rebuildCellarLayoutCache();
  if (!options.silent) {
    addMovement("déplacement", wine, { label: `Retrait de l'emplacement pour ${wineName(wine)}`, quantityChange: 0 });
    saveCellar(wines);
    saveMovements(movements);
    render({ targets: ["cellar", "inventory", "alerts", "movements"] });
  }
  return true;
}

function swapWineSlots(wineIdA, wineIdB) {
  const wineA = wines.find((wine) => wine.id === wineIdA);
  const wineB = wines.find((wine) => wine.id === wineIdB);
  if (!wineA || !wineB) return false;
  const slotA = wineA.slotId;
  const slotB = wineB.slotId;
  const metaA = cellarLayoutCache.slotsById.get(slotA);
  const metaB = cellarLayoutCache.slotsById.get(slotB);
  if (metaB) applySlotToWine(wineA, metaB.slot, metaB.layout);
  if (metaA) applySlotToWine(wineB, metaA.slot, metaA.layout);
  invalidateWineCaches();
  rebuildCellarLayoutCache();
  addMovement("déplacement", wineA, { label: `Permutation de ${wineName(wineA)} et ${wineName(wineB)}`, quantityChange: 0 });
  saveCellar(wines);
  saveMovements(movements);
  render({ targets: ["cellar", "inventory"] });
  return true;
}

function handleCellarDragStart() {
  return false;
}

function handleCellarDrop() {
  return false;
}

function enableMoveMode() {
  cellarMoveMode = { enabled: true, selectedWineId: "", sourceSlotId: "" };
  showStatus("Mode réorganisation actif : choisissez une bouteille non positionnée ou une bouteille sur le plan.");
}

function confirmMoveWine(wineId, targetSlotId) {
  const targetWines = getWinesInSlot(targetSlotId);
  let moved = false;
  if (!canPlaceWineInSlot(wineId, targetSlotId) && targetWines.length === 1 && targetWines[0].id !== wineId) {
    moved = swapWineSlots(wineId, targetWines[0].id);
    if (moved) showStatus("Emplacements permutes.");
  } else {
    moved = moveWineToSlot(wineId, targetSlotId);
  }
  if (moved) cellarMoveMode = { enabled: false, selectedWineId: "", sourceSlotId: "" };
  render({ targets: ["cellar", "inventory", "alerts"] });
}

function assignUnplacedWineToSlot(wineId, slotId) {
  return moveWineToSlot(wineId, slotId);
}

function openSlotPicker() {
  slotPickerState = { active: true, wineId: elements.wineId.value || "" };
  if (elements.dialog.open) elements.dialog.close();
  setActiveView("cellar", { navKey: "cellar" });
  showStatus("Choisissez un emplacement sur le plan de cave.");
}

function selectSlotForWine(slotId) {
  const slotMeta = cellarLayoutCache.slotsById.get(slotId);
  if (!slotMeta) return;
  applySlotToWineForm(slotMeta.slot, slotMeta.layout);
  slotPickerState = { active: false, wineId: "" };
  if (!elements.dialog.open) elements.dialog.showModal();
  showStatus("Emplacement appliqué au formulaire. Validez la fiche pour enregistrer.");
}

function applySlotToWineForm(slot, layout = getActiveCellarLayout()) {
  elements.cellarLayoutIdInput.value = layout.id;
  elements.slotIdInput.value = slot.id;
  elements.positionLabelInput.value = `${layout.name} · ${slot.label}`;
  fields.cellarName.value = layout.name;
  fields.rack.value = slot.label;
  fields.row.value = slot.row;
  fields.column.value = slot.column;
  renderSelectedSlotLabel();
}

function clearWineSlotSelection() {
  elements.cellarLayoutIdInput.value = "";
  elements.slotIdInput.value = "";
  elements.positionLabelInput.value = "";
  renderSelectedSlotLabel();
}

function renderSelectedSlotLabel() {
  if (!elements.selectedSlotLabel) return;
  elements.selectedSlotLabel.textContent = elements.positionLabelInput.value || "Emplacement non défini";
}

function openWineFromCellar(wineId) {
  const wine = wines.find((item) => item.id === wineId);
  if (wine) openWineDetail(wine);
}

function renderCellarContextMenu(wineId, slotId) {
  const wine = wines.find((item) => item.id === wineId);
  if (!wine) return "";
  return `
    <div class="cellar-context-menu">
      <button type="button" data-action="view" data-id="${escapeAttribute(wineId)}">Voir fiche</button>
      <button type="button" data-action="consume" data-id="${escapeAttribute(wineId)}">Marquer dégustée</button>
      <button type="button" data-action="move" data-id="${escapeAttribute(wineId)}">Déplacer</button>
      <button type="button" data-remove-slot="${escapeAttribute(slotId)}">Retirer</button>
    </div>
  `;
}

async function handleLibraryImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const rows = await parseLibraryImportFile(file);
    const validated = validateLibraryImportRows(rows);
    const result = await importLibraryReferences(validated);
    renderLibraryImportResult(result);
    render({ targets: ["library"] });
  } catch (error) {
    renderLibraryImportResult({ ok: false, errors: [error.message] });
    showStatus(`Import de références impossible : ${error.message}`, "error");
  } finally {
    elements.libraryImportFileInput.value = "";
  }
}

async function parseLibraryImportFile(file) {
  const text = await file.text();
  if (!text.trim()) throw new Error("Le fichier est vide.");
  if (file.name.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.references)) return parsed.references;
    throw new Error("JSON invalide : tableau ou clé references attendue.");
  }
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error("Le CSV ne contient aucune référence.");
  const headers = rows[0].map((header) => header.trim().replace(/^\ufeff/, ""));
  return rows.slice(1)
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function validateLibraryImportRows(rows = []) {
  const errors = [];
  const references = rows.map((row, index) => {
    const reference = normalizeLibraryReference({
      domain: row.domain || row.domaine,
      cuvee: row.cuvee || row.cuvée || row.nom,
      color: row.color || row.couleur || "Inconnu",
      region: row.region || row.région,
      appellation: row.appellation,
      country: row.country || row.pays || "France",
      knownVintages: normalizeTags(row.knownVintages || row.millesimes || row.millésimes || row.vintage).map(normalizeVintage).filter(Boolean),
      grapeVarieties: row.grapeVarieties || row.cepages || row.cépages,
      aliases: row.aliases,
      source: "import",
      reviewStatus: "community",
      pendingSync: true
    });
    if (!reference.domain || reference.domain === "Domaine à vérifier") errors.push(`Ligne ${index + 2}: domaine manquant.`);
    if (!reference.cuvee || reference.cuvee === "Cuvée à vérifier") errors.push(`Ligne ${index + 2}: cuvée manquante.`);
    return reference;
  });
  if (errors.length) throw new Error(errors.slice(0, 5).join(" "));
  return references;
}

async function importLibraryReferences(rows = []) {
  const batch = await createImportBatch({ count: rows.length, source: "frontend-import" });
  let synced = 0;
  let queued = 0;
  rows.forEach((reference) => addOrUpdateLibraryWine(reference, { persist: false, silent: true, rebuildCache: false }));
  for (const reference of rows) {
    try {
      const result = await upsertLibraryReference(reference);
      if (result.queued) queued += 1;
      else synced += 1;
    } catch (error) {
      queueLibrarySync(reference);
      queued += 1;
      logError(error, "importLibraryReferences");
    }
  }
  rebuildLibraryDerivedCaches();
  saveWineLibrary(wineLibrary);
  return { ok: true, imported: rows.length, synced, queued, batchId: batch?.id || "" };
}

async function createImportBatch(metadata = {}) {
  if (!isCloudConfigured() || !isSignedIn()) {
    return { id: crypto.randomUUID(), local: true, metadata };
  }
  const row = {
    user_id: authState.user.id,
    file_name: metadata.fileName || "frontend-import",
    row_count: toNumber(metadata.count, 0),
    metadata,
    created_at: new Date().toISOString()
  };
  const client = getSupabaseClient();
  if (client?.from) {
    const { data, error } = await client.from("wine_import_batches").insert(row).select().maybeSingle();
    if (error) throw error;
    return data;
  }
  const rows = await supabaseRestRequest("/wine_import_batches", {
    method: "POST",
    body: [row],
    prefer: "return=representation"
  });
  return Array.isArray(rows) ? rows[0] : rows;
}

function renderLibraryImportResult(result = {}) {
  if (!elements.libraryImportResult) return;
  if (!result.ok) {
    elements.libraryImportResult.textContent = result.errors?.join(" ") || "Import invalide.";
    return;
  }
  elements.libraryImportResult.textContent = `${result.imported} référence(s) importée(s), ${result.synced} synchronisée(s), ${result.queued} en attente.`;
}

// Scan de bouteille
function handleScanFileSelection(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showStatus("Choisissez une image d'étiquette.", "error");
    return;
  }
  scanState.imageFile = file;
  scanState.result = null;
  compressImage(file).then(({ photoFull, photoThumb }) => {
    scanState.imageDataUrl = photoFull;
    scanState.imageThumbDataUrl = photoThumb;
    render({ targets: ["scanner"] });
  }).catch((error) => {
    logError(error, "handleScanFileSelection");
    showStatus(getPhotoErrorMessage(error), "error");
  });
}

async function scanWineLabel(imageFile) {
  try {
    const manualText = cleanString(elements.scanManualText?.value);
    if (!imageFile && !manualText) {
      renderScanResult(null, "Ajoutez une photo ou collez le texte de l'étiquette.");
      showStatus("Ajoutez une photo ou un texte d'étiquette.", "error");
      return;
    }
    scanState.isLoading = true;
    render({ targets: ["scanner"] });

    let result = null;
    if (imageFile && canUseScan().allowed) {
      try {
        result = await scanWineLabelWithApi(imageFile);
        if (result?._apiUsed) consumeScanCredit();
      } catch {
        result = null;
      }
    }
    if (!result) {
      result = await scanWineLabelLocally(imageFile);
    }
    scanState.result = normalizeScanResult(result);
    render({ targets: ["scanner", "subscription", "sidebar"] });
  } catch (error) {
    logError(error, "scanWineLabel");
    renderScanResult(null, "Analyse impossible pour le moment.");
  } finally {
    scanState.isLoading = false;
    render({ targets: ["scanner"] });
  }
}

async function scanWineLabelWithApi(imageFile) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 1800);
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("language", "fr");
  const response = await fetch("/api/scan-wine-label", {
    method: "POST",
    body: formData,
    signal: controller.signal
  });
  window.clearTimeout(timeoutId);
  if (!response.ok) throw new Error("Route scan indisponible");
  return { ...await response.json(), _apiUsed: true };
}

async function scanWineLabelLocally(imageFile) {
  const rawText = cleanString(elements.scanManualText?.value) || cleanString(imageFile?.name).replace(/\.[^.]+$/, "");
  const parsed = parseWineLabelText(rawText);
  return {
    ...parsed,
    rawText,
    confidenceScore: parsed.domain || parsed.cuvee ? 0.42 : 0.18,
    warnings: ["Détection locale limitée : vérifiez les champs avant d'enregistrer."],
    needsReview: true
  };
}

function normalizeScanResult(result = {}) {
  return {
    domain: cleanString(result.domain),
    cuvee: cleanString(result.cuvee),
    vintage: normalizeVintage(result.vintage),
    appellation: cleanString(result.appellation),
    region: cleanString(result.region),
    country: cleanString(result.country) || "France",
    color: LIBRARY_COLORS.includes(result.color) ? result.color : guessWineColorFromText(result.rawText || ""),
    format: FORMATS.includes(result.format) ? result.format : "75cl",
    grapeVarieties: normalizeTags(result.grapeVarieties),
    confidenceScore: clamp(toNumber(result.confidenceScore, 0), 0, 1),
    rawText: cleanString(result.rawText),
    warnings: Array.isArray(result.warnings) ? result.warnings.map(cleanString).filter(Boolean) : [],
    needsReview: result.needsReview !== false,
    _apiUsed: Boolean(result._apiUsed)
  };
}

function renderScanner() {
  if (!elements.scanPreview) return;
  const remaining = getRemainingScans();
  elements.scanCreditsLabel.textContent = `${remaining} scan${remaining > 1 ? "s" : ""} IA disponible${remaining > 1 ? "s" : ""}`;
  elements.scanPreview.innerHTML = scanState.imageDataUrl
    ? `<img src="${escapeAttribute(scanState.imageDataUrl)}" alt="Aperçu de l'étiquette" loading="lazy">`
    : `<p>Aucune photo sélectionnée.</p>`;
  elements.scanAnalyzeButton.disabled = scanState.isLoading;
  elements.scanAnalyzeButton.textContent = scanState.isLoading ? "Analyse..." : "Analyser l'étiquette";
  renderScanResult(scanState.result);
}

function renderScanResult(result, error = "") {
  if (!elements.scanResult) return;
  elements.scanUseButton.hidden = !result;
  if (error) {
    elements.scanResult.innerHTML = `<div class="advice-card"><strong>Scan indisponible</strong><p>${escapeHtml(error)}</p></div>`;
    return;
  }
  if (!result) {
    elements.scanResult.innerHTML = `<div class="advice-card"><strong>Mode assisté</strong><p>Collez le texte visible sur l'étiquette si l'analyse automatique n'est pas disponible.</p></div>`;
    return;
  }
  elements.scanResult.innerHTML = `
    <div class="scan-result-card">
      <span class="pill ${result._apiUsed ? "ready" : "warning"}">${result._apiUsed ? "Analyse IA" : "Détection locale limitée"}</span>
      <h3>${escapeHtml(result.domain || "Domaine à vérifier")}</h3>
      <p>${escapeHtml(result.cuvee || "Cuvée à compléter")} · ${result.vintage || "Non millésimé"} · ${escapeHtml(formatColorLabel(result.color))}</p>
      <div class="compact-stats">
        <span class="compact-stat">Région: ${escapeHtml(result.region || "à confirmer")}</span>
        <span class="compact-stat">Appellation: ${escapeHtml(result.appellation || "à confirmer")}</span>
        <span class="compact-stat">Confiance: ${Math.round(result.confidenceScore * 100)}%</span>
      </div>
      ${result.warnings.length ? `<p>${escapeHtml(result.warnings.join(" "))}</p>` : ""}
    </div>
  `;
}

function applyScanResultToWineForm(result) {
  if (!result) return;
  openForm();
  fields.domain.value = result.domain || "";
  fields.cuvee.value = result.cuvee || "";
  fields.vintage.value = result.vintage || "";
  fields.color.value = result.color === "Inconnu" ? "Rouge" : result.color;
  fields.region.value = result.region || "";
  fields.appellation.value = result.appellation || "";
  fields.format.value = result.format || "75cl";
  fields.tags.value = uniqueValues(["scan", ...result.grapeVarieties]).join(", ");
  fields.notes.value = result.rawText ? `Scan étiquette : ${result.rawText}` : "";
  if (scanState.imageDataUrl) {
    elements.photoInputHidden.value = scanState.imageDataUrl;
    elements.photoThumbInputHidden.value = scanState.imageThumbDataUrl || scanState.imageDataUrl;
    renderPhotoPreview(scanState.imageDataUrl);
  }
  showStatus("Scan appliqué au formulaire. Vérifiez puis enregistrez.");
}

function parseWineLabelText(rawText = "") {
  const text = cleanString(rawText);
  const lines = text.split(/\r?\n/).map(cleanString).filter(Boolean);
  const vintage = guessVintageFromText(text);
  const region = guessRegionFromText(text);
  const color = guessWineColorFromText(text);
  const appellationLine = lines.find((line) => /aoc|aop|igp|grand cru|premier cru|appellation/i.test(line)) || "";
  return {
    domain: lines.find((line) => /domaine|chateau|clos|maison/i.test(line)) || lines[0] || "",
    cuvee: lines.find((line) => line !== lines[0] && !String(vintage).includes(line)) || "",
    vintage,
    appellation: appellationLine,
    region,
    country: "France",
    color,
    format: "75cl",
    grapeVarieties: guessGrapeVarietiesFromText(text)
  };
}

function guessWineColorFromText(text = "") {
  const normalized = normalizeSearchText(text);
  if (/champagne|cremant|brut|mousseux/.test(normalized)) return "Effervescent";
  if (/liquoreux|sauternes|monbazillac|moelleux/.test(normalized)) return "Liquoreux";
  if (/rose|rosado/.test(normalized)) return "Rose";
  if (/blanc|chardonnay|riesling|sauvignon|chenin/.test(normalized)) return "Blanc";
  if (/rouge|pinot noir|merlot|syrah|grenache|cabernet/.test(normalized)) return "Rouge";
  return "Inconnu";
}

function guessRegionFromText(text = "") {
  const normalized = normalizeSearchText(text);
  const regions = ["Bordeaux", "Bourgogne", "Champagne", "Loire", "Rhône", "Alsace", "Provence", "Languedoc", "Roussillon", "Jura", "Savoie", "Sud-Ouest"];
  return regions.find((region) => normalized.includes(normalizeSearchText(region))) || "";
}

function guessVintageFromText(text = "") {
  const match = String(text).match(/\b(19[5-9]\d|20[0-4]\d)\b/);
  return match ? normalizeVintage(match[1]) : 0;
}

function guessGrapeVarietiesFromText(text = "") {
  const normalized = normalizeSearchText(text);
  return ["pinot noir", "chardonnay", "merlot", "cabernet", "syrah", "grenache", "sauvignon", "chenin", "riesling"]
    .filter((grape) => normalized.includes(grape));
}

// Abonnements et packs
function getCurrentPlan() {
  return PRICING_PLANS.find((plan) => plan.id === subscriptionState.plan) || PRICING_PLANS[0];
}

function getPlanLimits(planId = subscriptionState.plan) {
  const plan = PRICING_PLANS.find((item) => item.id === planId) || PRICING_PLANS[0];
  return {
    bottleLimit: plan.bottleLimit,
    scanLimit: plan.scanLimit
  };
}

function getRemainingScans() {
  resetMonthlyUsageIfNeeded({ persist: false });
  return Math.max(0, toNumber(subscriptionState.scanCredits, 0));
}

function canUseScan() {
  const remaining = getRemainingScans();
  return {
    allowed: remaining > 0,
    remaining,
    reason: remaining > 0 ? "" : "Plus aucun scan IA disponible ce mois-ci."
  };
}

function consumeScanCredit() {
  const availablePackCredits = toNumber(subscriptionState.scanCredits, 0);
  if (availablePackCredits > 0) {
    subscriptionState.scanCredits = availablePackCredits - 1;
  }
  subscriptionState.usedScansThisMonth = toNumber(subscriptionState.usedScansThisMonth, 0) + 1;
  saveSubscriptionState(subscriptionState);
}

function resetMonthlyUsageIfNeeded(options = {}) {
  const currentMonth = today().slice(0, 7);
  if (subscriptionState.lastUsageReset === currentMonth) return;
  subscriptionState.usedScansThisMonth = 0;
  subscriptionState.lastUsageReset = currentMonth;
  subscriptionState.monthlyScanLimit = getPlanLimits(subscriptionState.plan).scanLimit;
  subscriptionState.scanCredits = subscriptionState.monthlyScanLimit;
  if (options.persist !== false) saveSubscriptionState(subscriptionState);
}

function renderSubscriptionView() {
  if (!elements.pricingPlans) return;
  const plan = getCurrentPlan();
  const remaining = getRemainingScans();
  elements.subscriptionPlanBadge.textContent = plan.name;
  elements.subscriptionScanCredits.textContent = `${remaining} scan${remaining > 1 ? "s" : ""} restant${remaining > 1 ? "s" : ""}`;
  elements.pricingPlans.innerHTML = PRICING_PLANS.map((item) => `
    <article class="plan-card ${item.recommended ? "recommended" : ""} ${item.id === subscriptionState.plan ? "current" : ""}">
      <span class="pill ${item.recommended ? "warning" : "neutral"}">${escapeHtml(item.badge)}</span>
      <h3>${escapeHtml(item.name)}</h3>
      <p class="plan-price">${escapeHtml(item.monthlyPrice)}</p>
      <p>${escapeHtml(item.yearlyPrice)}</p>
      <ul>${item.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
      <div class="plan-actions">
        <button class="primary-action" type="button" data-plan="${escapeAttribute(item.id)}" data-billing-cycle="monthly">Choisir</button>
        <button class="card-action" type="button" data-plan="${escapeAttribute(item.id)}" data-billing-cycle="yearly">Annuel</button>
      </div>
      <small>Paiement bientôt disponible via backend sécurisé.</small>
    </article>
  `).join("");
  elements.scanPacks.innerHTML = SCAN_PACKS.map((pack) => `
    <article class="scan-pack-card">
      <h3>${escapeHtml(pack.label)}</h3>
      <p>${escapeHtml(pack.price)}</p>
      <button class="card-action" type="button" data-scan-pack="${escapeAttribute(pack.id)}">Acheter bientôt</button>
    </article>
  `).join("");
}

function renderPlanBadge() {
  const plan = getCurrentPlan();
  const remaining = getRemainingScans();
  if (elements.sidebarPlanBadge) elements.sidebarPlanBadge.textContent = plan.name;
  if (elements.sidebarScanBadge) elements.sidebarScanBadge.textContent = `${remaining} scan${remaining > 1 ? "s" : ""}`;
}

async function handleChoosePlan(plan, billingCycle) {
  const session = await createCheckoutSession(plan, billingCycle);
  if (!session.checkoutUrl) {
    showStatus("Paiement bientôt disponible.");
  }
}

async function handleBuyScanPack(packId) {
  const session = await createScanPackCheckout(packId);
  if (!session.checkoutUrl) {
    showStatus("Achat de crédits bientôt disponible.");
  }
}

async function createCheckoutSession(plan, billingCycle) {
  return { checkoutUrl: "", plan, billingCycle, configured: false };
}

async function createScanPackCheckout(packId) {
  return { checkoutUrl: "", packId, configured: false };
}

async function refreshSubscriptionFromServer() {
  return subscriptionState;
}

function handleBillingPortal() {
  showStatus("Portail de facturation bientôt disponible.");
}

// Comptes client et cloud
async function initSupabase() {
  if (!isCloudConfigured()) {
    supabaseClient = null;
    return null;
  }
  if (supabaseClient) return supabaseClient;
  if (supabaseInitPromise) return supabaseInitPromise;

  supabaseInitPromise = (async () => {
    let createClient = window.supabase?.createClient;
    if (!createClient) {
      try {
        const module = await import(SUPABASE_CDN_URL);
        createClient = module.createClient;
      } catch (error) {
        logError(error, "loadSupabaseClient");
        return null;
      }
    }

    supabaseClient = createClient(cloudConfig.supabaseUrl, cloudConfig.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    onAuthStateChanged();
    const session = await getCurrentSession();
    if (session) {
      saveAuthFromSupabase({ session });
      await ensureUserProfile();
      await hydrateCloudStateAfterSignIn();
    }
    return supabaseClient;
  })();

  try {
    return await supabaseInitPromise;
  } finally {
    supabaseInitPromise = null;
  }
}

function getSupabaseClient() {
  return supabaseClient;
}

async function getCurrentSession() {
  const client = await initSupabase();
  if (client?.auth?.getSession) {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data?.session || null;
  }
  if (authSession.accessToken && authState.user?.id) {
    return {
      access_token: authSession.accessToken,
      refresh_token: authSession.refreshToken,
      expires_at: authState.expiresAt,
      user: authState.user
    };
  }
  return null;
}

async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || authState.user || null;
}

function onAuthStateChanged(callback) {
  const client = getSupabaseClient();
  if (!client?.auth?.onAuthStateChange || supabaseAuthSubscription) return supabaseAuthSubscription;
  const subscription = client.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      saveAuthFromSupabase({ session });
      await ensureUserProfile();
      await hydrateCloudStateAfterSignIn();
      syncPendingLibraryReferences({ silent: true });
    } else if (event === "SIGNED_OUT") {
      clearAuthState();
    }
    renderAuthState();
    if (typeof callback === "function") callback(event, session);
  });
  supabaseAuthSubscription = subscription?.data?.subscription || subscription;
  return supabaseAuthSubscription;
}

function renderAuthState() {
  renderAuthPanel();
  renderUserBadge();
  renderSyncStatus();
}

function renderAuthPanel() {
  renderAccountView();
}

function renderUserBadge() {
  const configured = isCloudConfigured();
  const signedIn = isSignedIn();
  const sidebarSubtitle = document.querySelector(".sidebar-title span");
  if (sidebarSubtitle) {
    sidebarSubtitle.textContent = signedIn
      ? "Cloud connecté"
      : configured
        ? "Cloud prêt"
        : "Version locale";
  }
  if (elements.openAccountButton) {
    elements.openAccountButton.innerHTML = `<svg class="ui-icon"><use href="#icon-account"></use></svg>${signedIn ? "Compte" : "Connexion"}`;
  }
}

function showAuthMessage(message, type = "success") {
  showStatus(message, type);
}

function requireAuthForCloudActions() {
  return ensureCloudReady();
}

function getCloudSyncStatusLabel() {
  if (!isCloudConfigured()) return "Cloud non configure";
  if (!isSignedIn()) return cloudSyncState.pendingChanges ? "Cave locale non migree" : "Connexion requise";
  if (cloudSyncState.syncStatus === "syncing") return "Synchronisation en cours";
  if (cloudSyncState.syncStatus === "pending") return "Synchronisation en attente";
  if (cloudSyncState.syncStatus === "error") return "Erreur de synchronisation";
  if (cloudSyncState.syncStatus === "needs-decision") return "Choix requis";
  if (cloudSyncState.syncStatus === "synced") return "Cloud synchronise";
  return cloudSyncState.pendingChanges ? "Cave locale a synchroniser" : "Cloud pret";
}

function getCloudSyncDetailText() {
  if (cloudSyncState.lastError) return `Derniere erreur : ${cloudSyncState.lastError}`;
  if (cloudSyncState.syncStatus === "needs-decision") {
    return "Une cave existe deja dans le cloud. Choisissez envoyer la cave locale ou restaurer le cloud.";
  }
  if (cloudSyncState.syncStatus === "pending") return "Modifications locales en attente d'envoi automatique.";
  if (cloudSyncState.syncStatus === "syncing") return "Envoi de la cave personnelle vers Supabase.";
  if (cloudSyncState.syncStatus === "local-only" && cloudSyncState.pendingChanges) {
    return "La cave reste disponible en local. Connectez-vous pour activer la sauvegarde cloud.";
  }
  if (cloudSyncState.lastRemoteAt) return `Derniere version cloud : ${formatDateTime(cloudSyncState.lastRemoteAt)}`;
  return "";
}

function renderAccountView() {
  if (!elements.accountStatusCard) return;
  const configured = isCloudConfigured();
  const signedIn = isSignedIn();
  const displayName = authState.user?.displayName;
  const syncStatusLabel = getCloudSyncStatusLabel();
  const cloudLabel = configured ? "Cloud configuré" : "Cloud non configuré";
  const accountLabel = signedIn ? displayName || authState.user?.email || "Compte connecté" : "Aucun compte connecté";
  elements.cloudConfigStatus.textContent = cloudLabel;
  elements.cloudConfigStatus.classList.toggle("ready", configured);
  elements.cloudConfigStatus.classList.toggle("warning", !configured);
  elements.accountEmail.textContent = accountLabel;
  elements.accountProvider.textContent = signedIn ? `Supabase · ${authState.user?.email || ""}` : configured ? "Supabase prêt" : "Mode local";
  elements.accountProvider.textContent = signedIn ? `Supabase · ${syncStatusLabel}` : configured ? syncStatusLabel : "Mode local";
  elements.cloudLastSync.textContent = cloudSyncState.lastSyncAt ? formatDateTime(cloudSyncState.lastSyncAt) : "Jamais";
  elements.cloudLastError.textContent = cloudSyncState.lastError ? `Dernière erreur : ${cloudSyncState.lastError}` : "";
  elements.cloudLastError.textContent = getCloudSyncDetailText();
  elements.authForms.hidden = signedIn;
  elements.accountPanel.hidden = !signedIn;
  elements.accountStatusCard.classList.toggle("is-connected", signedIn);
  elements.syncLocalToCloudButton.disabled = !configured || !signedIn;
  elements.restoreCloudButton.disabled = !configured || !signedIn;
  elements.refreshCloudButton.disabled = !configured;
  elements.signOutButton.disabled = !signedIn;
  elements.resetPasswordButton.disabled = !configured;
  elements.resendConfirmationButton.disabled = !configured;
  elements.signInForm.querySelectorAll("button, input").forEach((control) => control.disabled = !configured);
  elements.signUpForm.querySelectorAll("button, input").forEach((control) => control.disabled = !configured);
  renderUserBadge();
  renderSyncStatus();
}

function isSignedIn() {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return Boolean(authState.user?.id && (authSession.accessToken || authState.expiresAt > nowInSeconds));
}

function normalizeAuthEmail(value) {
  return cleanString(value).toLowerCase();
}

function getAuthEmailCandidate() {
  return normalizeAuthEmail(elements.signInEmail?.value || elements.signUpEmail?.value || authState.user?.email || "");
}

function getAuthRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function setAuthHelpMessage(message = "", type = "info") {
  if (!elements.authHelpMessage) return;
  elements.authHelpMessage.textContent = message;
  elements.authHelpMessage.classList.toggle("error", type === "error");
}

function getFriendlyAuthErrorMessage(error) {
  const raw = error?.message || String(error || "");
  const message = raw.toLowerCase();
  if (message.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect. Si le compte vient d'etre cree, verifiez le mail de confirmation. Sinon utilisez Mot de passe oublie.";
  }
  if (message.includes("email not confirmed") || message.includes("not confirmed")) {
    return "Compte cree mais email non confirme. Cliquez sur Renvoyer confirmation puis validez le mail Supabase.";
  }
  if (message.includes("user already registered") || message.includes("already registered")) {
    return "Ce compte existe deja. Connectez-vous ou utilisez Mot de passe oublie.";
  }
  return raw || "Connexion impossible.";
}

function handleAuthError(error, context = "auth") {
  const message = getFriendlyAuthErrorMessage(error);
  logError(error, context);
  setAuthHelpMessage(message, "error");
  render({ targets: ["account"] });
  showStatus(message, "error");
}

async function requestPasswordReset() {
  if (!isCloudConfigured()) {
    showStatus("Cloud non configure.", "error");
    return;
  }
  const email = getAuthEmailCandidate();
  if (!email) {
    setAuthHelpMessage("Indiquez votre email avant de demander la reinitialisation.", "error");
    return;
  }
  try {
    await initSupabase();
    const client = getSupabaseClient();
    const redirectTo = getAuthRedirectUrl();
    if (client?.auth?.resetPasswordForEmail) {
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
    } else {
      await supabaseAuthRequest(`/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
        method: "POST",
        body: { email },
        allowEmpty: true
      });
    }
    const message = "Si le compte existe, Supabase vient d'envoyer un email de reinitialisation.";
    setAuthHelpMessage(message);
    showStatus(message);
  } catch (error) {
    handleAuthError(error, "requestPasswordReset");
  }
}

async function resendSignupConfirmation() {
  if (!isCloudConfigured()) {
    showStatus("Cloud non configure.", "error");
    return;
  }
  const email = getAuthEmailCandidate();
  if (!email) {
    setAuthHelpMessage("Indiquez votre email avant de renvoyer la confirmation.", "error");
    return;
  }
  try {
    await initSupabase();
    const client = getSupabaseClient();
    const redirectTo = getAuthRedirectUrl();
    if (client?.auth?.resend) {
      const { error } = await client.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: redirectTo }
      });
      if (error) throw error;
    } else {
      await supabaseAuthRequest(`/resend?redirect_to=${encodeURIComponent(redirectTo)}`, {
        method: "POST",
        body: { type: "signup", email },
        allowEmpty: true
      });
    }
    const message = "Si un compte non confirme existe, Supabase vient de renvoyer le mail de confirmation.";
    setAuthHelpMessage(message);
    showStatus(message);
  } catch (error) {
    handleAuthError(error, "resendSignupConfirmation");
  }
}

async function handleAuthSubmit(event, mode) {
  event.preventDefault();
  if (!isCloudConfigured()) {
    showStatus("Configurez d'abord le backend cloud.", "error");
    return;
  }
  try {
    await initSupabase();
    if (mode === "signup") {
      const email = normalizeAuthEmail(elements.signUpEmail.value);
      const password = elements.signUpPassword.value;
      const displayName = cleanString(elements.signUpDisplayName?.value);
      if (!email || password.length < 8) throw new Error("Mot de passe de 8 caractères minimum.");
      const data = await signUpWithEmail(email, password, displayName);
      elements.signUpForm.reset();
      setAuthHelpMessage("");
      renderAuthState();
      showAuthMessage(data?.session || isSignedIn()
        ? "Compte créé et connecté."
        : "Compte créé. Vérifiez votre email si la confirmation est activée.");
      return;
    }

    const email = normalizeAuthEmail(elements.signInEmail.value);
    const password = elements.signInPassword.value;
    if (!email || !password) throw new Error("Email et mot de passe sont obligatoires.");
    await signInWithEmail(email, password);
    elements.signInForm.reset();
    setAuthHelpMessage("");
    renderAuthState();
    showAuthMessage("Connexion réussie.");
  } catch (error) {
    handleAuthError(error, `handleAuthSubmit:${mode}`);
  }
}

async function signInWithEmail(email, password) {
  const client = await initSupabase();
  if (client?.auth?.signInWithPassword) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.session) saveAuthFromSupabase(data);
    await ensureUserProfile();
    await hydrateCloudStateAfterSignIn();
    return data;
  }
  const data = await supabaseAuthRequest("/token?grant_type=password", {
    method: "POST",
    body: { email, password }
  });
  saveAuthFromSupabase(data);
  await ensureUserProfile();
  await hydrateCloudStateAfterSignIn();
  return data;
}

async function signUpWithEmail(email, password, displayName = "") {
  const client = await initSupabase();
  if (client?.auth?.signUp) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: getAuthRedirectUrl()
      }
    });
    if (error) throw error;
    if (data?.session) saveAuthFromSupabase(data);
    if (data?.user && !data?.session) {
      saveAuthState({
        ...authState,
        user: {
          id: data.user.id,
          email: data.user.email,
          displayName
        }
      });
    }
    await ensureUserProfile(displayName);
    await hydrateCloudStateAfterSignIn();
    return data;
  }
  const data = await supabaseAuthRequest(`/signup?redirect_to=${encodeURIComponent(getAuthRedirectUrl())}`, {
    method: "POST",
    body: { email, password, data: { display_name: displayName } }
  });
  if (data.access_token) saveAuthFromSupabase(data);
  await ensureUserProfile(displayName);
  await hydrateCloudStateAfterSignIn();
  return data;
}

async function signInWithPassword(event) {
  return handleAuthSubmit(event, "signin");
}

async function signUpWithPassword(event) {
  return handleAuthSubmit(event, "signup");
}

async function refreshCloudDataAfterSession() {
  if (!isSignedIn()) {
    renderAuthState();
    showStatus("Session rafraichie.");
    return;
  }
  if (cloudSyncState.pendingChanges || cloudSyncState.syncStatus === "pending" || cloudSyncState.syncStatus === "error") {
    await performCloudAutoSync({ reason: "manual-refresh", silent: false });
    return;
  }
  await hydrateCloudStateAfterSignIn({ force: true });
  renderAuthState();
  showStatus("Cloud verifie.");
}

async function refreshCloudSession() {
  if (!isCloudConfigured()) {
    render({ targets: ["account"] });
    showStatus("Cloud non configuré.", "error");
    return;
  }
  try {
    const client = await initSupabase();
    if (client?.auth?.getSession) {
      const session = await getCurrentSession();
      if (session) saveAuthFromSupabase({ session });
      await refreshCloudDataAfterSession();
      renderAuthState();
      showStatus("Session rafraîchie.");
      return;
    }
    if (!authSession.refreshToken) {
      render({ targets: ["account"] });
      return;
    }
    const data = await supabaseAuthRequest("/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: authSession.refreshToken }
    });
    saveAuthFromSupabase(data);
    await refreshCloudDataAfterSession();
    render({ targets: ["account"] });
    showStatus("Session rafraîchie.");
  } catch (error) {
    handleCloudError(error, "refreshCloudSession");
  }
}

async function signOut() {
  return signOutUser();
}

async function signOutUser() {
  try {
    const client = await initSupabase();
    if (client?.auth?.signOut) {
      await client.auth.signOut();
    } else if (isCloudConfigured() && authSession.accessToken) {
      await supabaseAuthRequest("/logout", {
        method: "POST",
        token: authSession.accessToken,
        allowEmpty: true
      });
    }
  } catch {
    // La déconnexion locale reste prioritaire.
  }
  clearAuthState();
  renderAuthState();
  showStatus("Déconnecté.");
}

function saveAuthFromSupabase(data = {}) {
  const session = data.session || data;
  const user = data.user || session?.user || {};
  const expiresIn = toNumber(data.expires_in || session?.expires_in, 3600);
  const expiresAt = toNumber(data.expires_at || session?.expires_at, 0) || Math.round(Date.now() / 1000) + expiresIn;
  authSession = {
    accessToken: cleanString(data.access_token || session?.access_token),
    refreshToken: cleanString(data.refresh_token || session?.refresh_token)
  };
  saveAuthState({
    provider: "supabase",
    expiresAt,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || authState.user?.displayName || ""
    }
  });
}

async function ensureUserProfile(displayName = "") {
  if (!isCloudConfigured() || !authState.user?.id) return null;
  const profile = {
    id: authState.user.id,
    email: authState.user.email,
    display_name: displayName || authState.user.displayName || authState.user.email?.split("@")[0] || "Utilisateur",
    updated_at: new Date().toISOString()
  };
  try {
    const client = getSupabaseClient();
    if (client?.from) {
      const { data, error } = await client
        .from("profiles")
        .upsert(profile, { onConflict: "id" })
        .select()
        .single();
      if (error) throw error;
      if (data?.display_name) {
        saveAuthState({ ...authState, user: { ...authState.user, displayName: data.display_name } });
      }
      return data;
    }
    const rows = await supabaseRestRequest("/profiles?on_conflict=id", {
      method: "POST",
      body: [profile],
      prefer: "resolution=merge-duplicates,return=representation"
    });
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (row?.display_name) saveAuthState({ ...authState, user: { ...authState.user, displayName: row.display_name } });
    return row;
  } catch (error) {
    logError(error, "ensureUserProfile");
    return null;
  }
}

async function loadUserProfile() {
  if (!requireAuthForCloudActions()) return null;
  const client = getSupabaseClient();
  if (client?.from) {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", authState.user.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
  const rows = await supabaseRestRequest(`/profiles?id=eq.${encodeURIComponent(authState.user.id)}&select=*`, { method: "GET" });
  return Array.isArray(rows) ? rows[0] || null : rows;
}

async function updateUserProfile(updates = {}) {
  if (!requireAuthForCloudActions()) return null;
  const payload = {
    display_name: cleanString(updates.displayName || updates.display_name || authState.user?.displayName),
    updated_at: new Date().toISOString()
  };
  const client = getSupabaseClient();
  if (client?.from) {
    const { data, error } = await client
      .from("profiles")
      .update(payload)
      .eq("id", authState.user.id)
      .select()
      .single();
    if (error) throw error;
    saveAuthState({ ...authState, user: { ...authState.user, displayName: data.display_name } });
    return data;
  }
  const rows = await supabaseRestRequest(`/profiles?id=eq.${encodeURIComponent(authState.user.id)}`, {
    method: "PATCH",
    body: payload,
    prefer: "return=representation"
  });
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (row?.display_name) saveAuthState({ ...authState, user: { ...authState.user, displayName: row.display_name } });
  return row;
}

async function syncLocalToCloud() {
  if (!ensureCloudReady()) return;
  const confirmed = await askConfirmation("Envoyer la cave locale", "Cette action sauvegarde votre cave locale dans votre compte cloud. Les données cloud existantes seront remplacées par cette sauvegarde.", "Envoyer");
  if (!confirmed) return;
  try {
    await performCloudAutoSync({ reason: "manual-push", silent: false });
    showStatus("Cave locale envoyée vers le cloud.");
  } catch (error) {
    handleCloudError(error, "syncLocalToCloud");
  }
}

async function restoreFromCloud() {
  if (!ensureCloudReady()) return;
  const confirmed = await askConfirmation("Restaurer depuis le cloud", "Cette action remplacera la cave locale par la dernière sauvegarde cloud. Une sauvegarde locale sera créée avant restauration.", "Restaurer");
  if (!confirmed) return;
  try {
    exportBackup("avant-restauration-cloud");
    const snapshot = await pullCloudSnapshot();
    if (!snapshot) throw new Error("Aucune sauvegarde cloud trouvée.");
    applyCloudSnapshot(snapshot);
    saveCloudSyncState({
      ...cloudSyncState,
      lastSyncAt: new Date().toISOString(),
      lastPullAt: new Date().toISOString(),
      lastError: "",
      syncStatus: "synced",
      pendingChanges: false,
      pendingLocalMigration: false,
      lastHydratedUserId: authState.user.id
    });
    render({ targets: ["view", "filters", "inventory", "stats", "alerts", "library", "account"] });
    showStatus("Cave restaurée depuis le cloud.");
  } catch (error) {
    handleCloudError(error, "restoreFromCloud");
  }
}

function ensureCloudReady() {
  if (!isCloudConfigured()) {
    showStatus("Cloud non configuré.", "error");
    render({ targets: ["account"] });
    return false;
  }
  if (!isSignedIn()) {
    showStatus("Connectez-vous d'abord.", "error");
    render({ targets: ["account"] });
    return false;
  }
  return true;
}

function canUseCloudSilently() {
  return Boolean(isCloudConfigured() && isSignedIn() && authState.user?.id);
}

function hasLocalCellarData() {
  const hasStoredCellar = Boolean(localStorage.getItem(STORAGE_KEY));
  const hasStoredLayouts = Boolean(localStorage.getItem(CELLAR_LAYOUTS_KEY));
  return Boolean(
    hasStoredCellar
    || movements.length
    || wishlist.length
    || tastingNotes.length
    || hasStoredLayouts
  );
}

function markPersonalDataChanged(reason = "local-change") {
  if (isApplyingCloudSnapshot) return;
  if (!isCloudConfigured() || !isSignedIn()) {
    saveCloudSyncState({
      ...cloudSyncState,
      syncStatus: "local-only",
      pendingChanges: true,
      pendingLocalMigration: true,
      lastReason: reason
    });
    return;
  }
  scheduleCloudAutoSync(reason);
}

function scheduleCloudAutoSync(reason = "local-change") {
  if (isApplyingCloudSnapshot || !canUseCloudSilently()) return;
  saveCloudSyncState({
    ...cloudSyncState,
    syncStatus: "pending",
    pendingChanges: true,
    pendingLocalMigration: false,
    lastError: "",
    lastReason: reason
  });
  render({ targets: ["account", "sidebar"] });
  window.clearTimeout(cloudSyncTimer);
  cloudSyncTimer = window.setTimeout(() => {
    performCloudAutoSync({ reason, silent: true });
  }, CLOUD_SYNC_DEBOUNCE);
}

async function performCloudAutoSync(options = {}) {
  if (!canUseCloudSilently()) return { ok: false, reason: "not-ready" };
  if (isApplyingCloudSnapshot) return { ok: false, reason: "snapshot-applying" };
  window.clearTimeout(cloudSyncTimer);
  saveCloudSyncState({
    ...cloudSyncState,
    syncStatus: "syncing",
    pendingChanges: true,
    lastReason: options.reason || cloudSyncState.lastReason || "manual"
  });
  render({ targets: ["account", "sidebar"] });
  try {
    const pushed = await pushCloudSnapshot(buildCellarSnapshot());
    const now = new Date().toISOString();
    saveCloudSyncState({
      ...cloudSyncState,
      lastSyncAt: now,
      lastPushAt: now,
      lastAutoSyncAt: options.silent ? now : cloudSyncState.lastAutoSyncAt,
      lastRemoteAt: pushed?.updated_at || now,
      lastError: "",
      lastReason: options.reason || cloudSyncState.lastReason,
      lastHydratedUserId: authState.user.id,
      syncStatus: "synced",
      pendingChanges: false,
      pendingLocalMigration: false
    });
    render({ targets: ["account", "sidebar"] });
    if (!options.silent) showStatus("Cave synchronisee avec le cloud.");
    return { ok: true, pushed };
  } catch (error) {
    saveCloudSyncState({
      ...cloudSyncState,
      syncStatus: "error",
      pendingChanges: true,
      lastError: error?.message || String(error),
      lastReason: options.reason || cloudSyncState.lastReason
    });
    logError(error, "performCloudAutoSync");
    render({ targets: ["account", "sidebar"] });
    if (!options.silent) showStatus(error?.message || "Synchronisation cloud impossible.", "error");
    return { ok: false, error };
  }
}

function buildCellarSnapshot() {
  return {
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    userId: authState.user?.id || "",
    wines,
    movements,
    wishlist,
    tastingNotes,
    wineLibrary,
    cellarLayouts,
    aiEnrichmentQueue,
    adviceFeedback,
    subscriptionState
  };
}

function applyCloudSnapshot(snapshot = {}) {
  isApplyingCloudSnapshot = true;
  try {
    applyCellarSnapshot(snapshot);
  } finally {
    isApplyingCloudSnapshot = false;
  }
}

function applyCellarSnapshot(snapshot = {}) {
  wines = Array.isArray(snapshot.wines) ? snapshot.wines.map(normalizeWine) : wines;
  movements = Array.isArray(snapshot.movements) ? snapshot.movements.map(normalizeMovement) : movements;
  wishlist = Array.isArray(snapshot.wishlist) ? snapshot.wishlist.map(normalizeWish) : wishlist;
  tastingNotes = Array.isArray(snapshot.tastingNotes) ? snapshot.tastingNotes.map(normalizeTastingNote) : tastingNotes;
  wineLibrary = Array.isArray(snapshot.wineLibrary) ? snapshot.wineLibrary.map(normalizeLibraryWine) : wineLibrary;
  cellarLayouts = Array.isArray(snapshot.cellarLayouts) ? snapshot.cellarLayouts.map(normalizeCellarLayout) : cellarLayouts;
  aiEnrichmentQueue = Array.isArray(snapshot.aiEnrichmentQueue) ? snapshot.aiEnrichmentQueue.map(normalizeAiEnrichmentRequest) : aiEnrichmentQueue;
  adviceFeedback = Array.isArray(snapshot.adviceFeedback) ? snapshot.adviceFeedback.map(normalizeAdviceFeedback) : adviceFeedback;
  subscriptionState = snapshot.subscriptionState ? normalizeSubscriptionState(snapshot.subscriptionState) : subscriptionState;
  syncCellarLayoutWithWines({ persist: false });
  invalidateWineCaches();
  rebuildLibraryDerivedCaches();
  rebuildCellarLayoutCache();
  saveCellar(wines);
  saveMovements(movements);
  saveWishlist(wishlist);
  saveTastingNotes(tastingNotes);
  saveWineLibrary(wineLibrary);
  saveCellarLayouts(cellarLayouts);
  saveAiEnrichmentQueue(aiEnrichmentQueue);
  saveAdviceFeedbackStore(adviceFeedback);
  saveSubscriptionState(subscriptionState);
}

async function pushCloudSnapshot(snapshot) {
  const body = [{
    user_id: authState.user.id,
    payload: snapshot,
    updated_at: new Date().toISOString()
  }];
  const data = await supabaseRestRequest("/cellar_snapshots?on_conflict=user_id", {
    method: "POST",
    body,
    prefer: "resolution=merge-duplicates,return=representation"
  });
  return Array.isArray(data) ? data[0] : data;
}

async function pullCloudSnapshot() {
  const row = await pullCloudSnapshotRecord();
  return row?.payload || null;
}

async function pullCloudSnapshotRecord() {
  const rows = await supabaseRestRequest(`/cellar_snapshots?user_id=eq.${encodeURIComponent(authState.user.id)}&select=payload,updated_at&limit=1`, {
    method: "GET"
  });
  return Array.isArray(rows) ? rows[0] || null : rows;
}

async function hydrateCloudStateAfterSignIn(options = {}) {
  if (!canUseCloudSilently()) return { ok: false, reason: "not-ready" };
  if (cloudHydrationPromise && !options.force) return cloudHydrationPromise;
  if (!options.force && cloudSyncState.lastHydratedUserId === authState.user.id && cloudSyncState.syncStatus === "synced") {
    return { ok: true, cached: true };
  }

  cloudHydrationPromise = (async () => {
    try {
      const record = await pullCloudSnapshotRecord();
      const localHasData = hasLocalCellarData();
      if (!record?.payload) {
        if (localHasData) {
          return performCloudAutoSync({ reason: "initial-local-migration", silent: true });
        }
        saveCloudSyncState({
          ...cloudSyncState,
          lastHydratedUserId: authState.user.id,
          syncStatus: "synced",
          pendingChanges: false,
          pendingLocalMigration: false,
          lastError: ""
        });
        render({ targets: ["account", "sidebar"] });
        return { ok: true, empty: true };
      }

      const remoteUpdatedAt = cleanString(record.updated_at);
      if (!localHasData) {
        applyCloudSnapshot(record.payload);
        saveCloudSyncState({
          ...cloudSyncState,
          lastSyncAt: new Date().toISOString(),
          lastPullAt: new Date().toISOString(),
          lastRemoteAt: remoteUpdatedAt,
          lastError: "",
          lastHydratedUserId: authState.user.id,
          syncStatus: "synced",
          pendingChanges: false,
          pendingLocalMigration: false
        });
        render();
        showStatus("Cave cloud chargee.");
        return { ok: true, pulled: true };
      }

      saveCloudSyncState({
        ...cloudSyncState,
        lastRemoteAt: remoteUpdatedAt,
        lastHydratedUserId: authState.user.id,
        syncStatus: "needs-decision",
        pendingChanges: true,
        pendingLocalMigration: true,
        lastError: ""
      });
      render({ targets: ["account", "sidebar"] });
      showStatus("Cave cloud trouvee. Depuis Compte, choisissez envoyer la cave locale ou restaurer le cloud.", "success", {
        label: "Compte",
        action: () => setActiveView("account", { navKey: "account" })
      });
      return { ok: true, needsDecision: true };
    } catch (error) {
      saveCloudSyncState({
        ...cloudSyncState,
        syncStatus: "error",
        pendingChanges: true,
        lastError: error?.message || String(error)
      });
      logError(error, "hydrateCloudStateAfterSignIn");
      render({ targets: ["account", "sidebar"] });
      return { ok: false, error };
    } finally {
      cloudHydrationPromise = null;
    }
  })();

  return cloudHydrationPromise;
}

async function supabaseAuthRequest(path, options = {}) {
  const url = `${cloudConfig.supabaseUrl}/auth/v1${path}`;
  return cloudFetch(url, {
    method: options.method || "GET",
    headers: {
      apikey: cloudConfig.supabaseAnonKey,
      Authorization: `Bearer ${options.token || cloudConfig.supabaseAnonKey}`,
      "Content-Type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    allowEmpty: options.allowEmpty
  });
}

async function supabaseRestRequest(path, options = {}) {
  const url = `${cloudConfig.supabaseUrl}/rest/v1${path}`;
  const bearer = options.token || await getCurrentAccessToken() || cloudConfig.supabaseAnonKey;
  const headers = {
    apikey: cloudConfig.supabaseAnonKey,
    Authorization: `Bearer ${bearer}`,
    "Content-Type": "application/json"
  };
  if (options.prefer) headers.Prefer = options.prefer;
  return cloudFetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    allowEmpty: options.allowEmpty
  });
}

async function getCurrentAccessToken() {
  const client = getSupabaseClient();
  if (client?.auth?.getSession) {
    const { data, error } = await client.auth.getSession();
    if (!error && data?.session?.access_token) {
      authSession = {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token || authSession.refreshToken
      };
      return data.session.access_token;
    }
  }
  return authSession.accessToken || "";
}

async function cloudFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), CLOUD_REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new Error(data?.msg || data?.message || `Erreur cloud ${response.status}`);
    }
    return data;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function handleCloudError(error, context = "cloud") {
  logError(error, context);
  saveCloudSyncState({
    ...cloudSyncState,
    lastError: error?.message || String(error)
  });
  render({ targets: ["account"] });
  showStatus(error?.message || "Action cloud impossible.", "error");
}

// Sommelier personnel
function getAiEligibleWines() {
  return wines.filter((wine) => wine.quantity > 0 && !["bu", "vendu", "offert"].includes(wine.status));
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
    renderWineAdviceError("Impossible de générér un conseil pour le moment.");
  }
}

function getLocalWineAdviceLegacy(userQuestion, eligibleWines) {
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
      servingAdvice: wine.color === "Rouge" ? "Servir légèrement rafraîchi si le vin est jeune." : "Servir frais, sans excès.",
      foodPairing: userQuestion,
      confidence: score > 80 ? "high" : score > 45 ? "medium" : "low"
    })),
    generalAdvice: "Conseil généré à partir des informations de votre cave. À ajuster selon vos préférences."
  };
}

function renderWineAdviceResultLegacy(result) {
  elements.adviceResult.innerHTML = `
    ${result.recommendations.map((item) => `
      <div class="advice-card">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.reason)}</p>
        <p>${escapeHtml(item.servingAdvice)}</p>
      </div>
    `).join("")}
    <p>${escapeHtml(result.generalAdvice || "Conseil généré à partir des informations de votre cave. À ajuster selon vos préférences.")}</p>
  `;
}

function renderWineAdviceError(error) {
  elements.adviceResult.innerHTML = `<div class="advice-card"><strong>Conseil indisponible</strong><p>${escapeHtml(error)}</p></div>`;
}

function getLibraryReferenceForWine(wine) {
  const key = getLibraryReferenceKey(createLibraryReferenceFromWine(wine, { source: "user" }));
  return wineLibrary.find((reference) => getLibraryReferenceKey(reference) === key)
    || findLibraryMatches(`${wine.domain} ${wine.cuvee} ${wine.appellation}`).find((reference) => normalizeSearchText(reference.domain) === normalizeSearchText(wine.domain))
    || null;
}

function buildWineAdvicePrompt(userQuestion, eligibleWines) {
  return {
    question: userQuestion,
    constraints: [
      "Ne recommander que des bouteilles presentes dans la cave.",
      "Retourner uniquement du JSON conforme au schema.",
      "Ne jamais demander de cle API cote navigateur."
    ],
    responseSchema: WINE_ADVICE_RESPONSE_SCHEMA,
    wines: eligibleWines.map((wine) => {
      const reference = getLibraryReferenceForWine(wine);
      return {
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
        location: getWineLocationLabel(wine),
        library: reference ? {
          foodPairings: reference.foodPairings,
          servingTemperature: reference.servingTemperature,
          openingAdvice: reference.openingAdvice,
          body: reference.body,
          tannins: reference.tannins,
          acidity: reference.acidity,
          sweetness: reference.sweetness
        } : null
      };
    })
  };
}

function getLocalWineAdvice(userQuestion, eligibleWines) {
  const query = normalizeSearch(userQuestion);
  const scored = eligibleWines.map((wine) => {
    let score = getDrinkPriorityScore(wine);
    const reference = getLibraryReferenceForWine(wine);
    const enrichedText = reference ? [
      reference.foodPairings.join(" "),
      reference.bestOccasions.join(" "),
      reference.openingAdvice,
      reference.body,
      reference.tannins,
      reference.acidity,
      reference.sweetness
    ].join(" ") : "";
    const notes = normalizeSearch([wine.notes, wine.region, wine.appellation, wine.tags.join(" "), enrichedText].join(" "));
    if (query.includes("viande") && wine.color === "Rouge") score += 40;
    if ((query.includes("poisson") || query.includes("fruit de mer")) && ["Blanc", "Effervescent"].includes(wine.color)) score += 40;
    if (query.includes("aperitif") && ["Blanc", "Effervescent", "Rose"].includes(wine.color)) score += 35;
    if (query.includes("fromage") && ["Blanc", "Rouge", "Liquoreux"].includes(wine.color)) score += 25;
    if (query.includes("dessert") && ["Liquoreux", "Effervescent"].includes(wine.color)) score += 45;
    if (query.includes("grande occasion") && bottleValue(wine) > 100) score += 35;
    if (query.includes("maintenant") && drinkStatus(wine).state === "ready") score += 35;
    if (reference?.foodPairings?.some((pairing) => query.includes(normalizeSearch(pairing)))) score += 30;
    if (reference?.bestOccasions?.some((occasion) => query.includes(normalizeSearch(occasion)))) score += 16;
    if (notes && query.split(" ").some((word) => word.length > 3 && notes.includes(word))) score += 18;
    return { wine, score, reference };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  return {
    adviceId: crypto.randomUUID(),
    recommendations: scored.map(({ wine, score, reference }) => ({
      wineId: wine.id,
      title: wineName(wine),
      reason: `${drinkStatus(wine).label}, ${wine.color.toLowerCase()}, ${wine.region}.`,
      servingAdvice: reference?.openingAdvice || reference?.servingTemperature
        ? [reference.openingAdvice, reference.servingTemperature && `Service: ${reference.servingTemperature}`].filter(Boolean).join(" ")
        : wine.color === "Rouge" ? "Servir legerement rafraichi si le vin est jeune." : "Servir frais, sans exces.",
      foodPairing: reference?.foodPairings?.length ? reference.foodPairings.slice(0, 3).join(", ") : userQuestion,
      confidence: score > 80 ? "high" : score > 45 ? "medium" : "low"
    })),
    generalAdvice: "Conseil genere a partir des informations de votre cave. A ajuster selon vos preferences."
  };
}

function renderWineAdviceResult(result) {
  const normalizedResult = {
    adviceId: result.adviceId || crypto.randomUUID(),
    recommendations: Array.isArray(result.recommendations) ? result.recommendations.slice(0, 3) : [],
    generalAdvice: cleanString(result.generalAdvice) || "Conseil genere a partir des informations de votre cave. A ajuster selon vos preferences."
  };
  lastAdviceResult = normalizedResult;
  elements.adviceResult.innerHTML = `
    ${normalizedResult.recommendations.map((item) => `
      <div class="advice-card">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.reason)}</p>
        <p>${escapeHtml(item.servingAdvice)}</p>
        <p>${escapeHtml(item.foodPairing || "")}</p>
        <div class="quick-advice-actions">
          <button class="card-action" type="button" data-advice-feedback="useful" data-advice-id="${escapeAttribute(normalizedResult.adviceId)}" data-wine-id="${escapeAttribute(item.wineId)}">Utile</button>
          <button class="card-action" type="button" data-advice-feedback="not_useful" data-advice-id="${escapeAttribute(normalizedResult.adviceId)}" data-wine-id="${escapeAttribute(item.wineId)}">Pas adapte</button>
          <button class="card-action" type="button" data-advice-feedback="followed" data-advice-id="${escapeAttribute(normalizedResult.adviceId)}" data-wine-id="${escapeAttribute(item.wineId)}">Je le suis</button>
        </div>
      </div>
    `).join("")}
    <p>${escapeHtml(normalizedResult.generalAdvice)}</p>
  `;
}

function handleAdviceFeedbackClick(event) {
  const button = event.target.closest("[data-advice-feedback]");
  if (!button) return;
  const feedback = normalizeAdviceFeedback({
    adviceId: button.dataset.adviceId || lastAdviceResult?.adviceId,
    wineId: button.dataset.wineId,
    type: button.dataset.adviceFeedback,
    context: elements.adviceQuestionInput?.value || ""
  });
  adviceFeedback = [feedback, ...adviceFeedback].slice(0, 300);
  saveAdviceFeedbackStore(adviceFeedback);
  showStatus("Merci, retour enregistre localement.");
}

// Centre de contrôle, sauvegarde et rapport technique
function exportBackup(reason = "manuel") {
  const backup = {
    app: "Cave à vin",
    version: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    reason,
    createdAt: new Date().toISOString(),
    wines,
    movements,
    wishlist,
    tastingNotes,
    wineLibrary,
    subscriptionState
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
  showStatus("Sauvegarde créée.");
}

function restoreBackupFromFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  readTextFile(file, async (text) => {
    try {
      const backup = JSON.parse(text);
      if (!Array.isArray(backup.wines)) throw new Error("Fichier de sauvegarde invalide.");
      const confirmed = await askConfirmation("Restaurer une sauvegarde", "Cette restauration remplacera les données locales actuelles.", "Restaurer");
      if (!confirmed) return;
      exportBackup("avant-restauration");
      wines = backup.wines.map(normalizeWine);
      movements = Array.isArray(backup.movements) ? backup.movements.map(normalizeMovement) : [];
      wishlist = Array.isArray(backup.wishlist) ? backup.wishlist.map(normalizeWish) : [];
      tastingNotes = Array.isArray(backup.tastingNotes) ? backup.tastingNotes.map(normalizeTastingNote) : [];
      wineLibrary = Array.isArray(backup.wineLibrary) ? backup.wineLibrary.map(normalizeLibraryWine) : wineLibrary;
      cellarLayouts = Array.isArray(backup.cellarLayouts) ? backup.cellarLayouts.map(normalizeCellarLayout) : cellarLayouts;
      aiEnrichmentQueue = Array.isArray(backup.aiEnrichmentQueue) ? backup.aiEnrichmentQueue.map(normalizeAiEnrichmentRequest) : aiEnrichmentQueue;
      adviceFeedback = Array.isArray(backup.adviceFeedback) ? backup.adviceFeedback.map(normalizeAdviceFeedback) : adviceFeedback;
      subscriptionState = backup.subscriptionState ? normalizeSubscriptionState(backup.subscriptionState) : subscriptionState;
      migrateWineLibrary();
      syncCellarLayoutWithWines({ persist: false });
      invalidateWineCaches();
      addMovement("restauration", {}, { label: "Restauration d'une sauvegarde", quantityChange: 0 });
      saveCellar(wines);
      saveMovements(movements);
      saveWishlist(wishlist);
      saveTastingNotes(tastingNotes);
      saveWineLibrary(wineLibrary);
      saveCellarLayouts(cellarLayouts);
      saveAiEnrichmentQueue(aiEnrichmentQueue);
      saveAdviceFeedbackStore(adviceFeedback);
      saveSubscriptionState(subscriptionState);
      render();
      showStatus("Sauvegarde restaurée.");
    } catch (error) {
      showStatus(`Restauration impossible: ${error.message}`, "error");
    } finally {
      elements.restoreBackupInput.value = "";
    }
  });
}

async function clearAllData() {
  const first = await askConfirmation("Supprimer toutes les données", "Cette action crée d'abord une sauvegarde locale, puis supprime la cave, la liste d’achat, les notes et le journal de cave.", "Continuer");
  if (!first) return;
  const second = await askConfirmation("Dernière confirmation", "Confirme la suppression définitive des données locales.", "Tout supprimer");
  if (!second) return;
  exportBackup("avant-suppression-totale");
  wines = [];
  movements = [];
  wishlist = [];
  tastingNotes = [];
  wineLibrary = [];
  cellarLayouts = ensureCellarLayouts([]);
  activeCellarLayoutId = cellarLayouts[0]?.id || "";
  aiEnrichmentQueue = [];
  adviceFeedback = [];
  subscriptionState = { ...DEFAULT_SUBSCRIPTION_STATE };
  invalidateWineCaches();
  rebuildCellarLayoutCache();
  saveCellar(wines);
  saveMovements(movements);
  saveWishlist(wishlist);
  saveTastingNotes(tastingNotes);
  saveWineLibrary(wineLibrary);
  saveCellarLayouts(cellarLayouts);
  saveAiEnrichmentQueue(aiEnrichmentQueue);
  saveAdviceFeedbackStore(adviceFeedback);
  saveSubscriptionState(subscriptionState);
  render();
  showStatus("Toutes les données locales ont été supprimées.");
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
    wineLibrary: wineLibrary.length,
    subscriptionPlan: subscriptionState.plan,
    scanCredits: getRemainingScans(),
    storageBytes: estimateStorageSize(),
    serviceWorker: Boolean(navigator.serviceWorker?.controller),
    errors: errorLogs.slice(0, 20)
  };
  downloadFile(JSON.stringify(diagnostic, null, 2), `cave-a-vin-rapport-technique-${today()}.json`, "application/json");
  showStatus("Rapport technique exporté.");
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
  const subject = encodeURIComponent(`Feedback Cave à vin ${APP_VERSION}`);
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
  try {
    saveErrorLogs(errorLogs);
  } catch {
    // Logging must never break the user-facing workflow.
  }
}

function exportErrorLogs() {
  downloadFile(JSON.stringify(errorLogs, null, 2), `cave-a-vin-erreurs-${today()}.json`, "application/json");
}

function trackModification() {
  modificationsSinceBackup += 1;
  localStorage.setItem(MODIFICATION_COUNT_KEY, String(modificationsSinceBackup));
  if (modificationsSinceBackup >= 8) {
    showStatus("Pense à créer une sauvegarde de ta cave.", "success", { label: "Sauvegarder", action: createManualBackup });
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
      alerts.push({ type: "ready", severity: "info", title: "Prêt à boire", message: `${wineName(wine)} est dans sa fenêtre idéale.`, wineId: wine.id });
    }
    if (status.state === "soon") {
      alerts.push({ type: "soon", severity: "warning", title: "À boire bientôt", message: `${wineName(wine)} arrive bientôt à maturité.`, wineId: wine.id });
    }
    if (status.state === "late") {
      alerts.push({ type: "expired", severity: "danger", title: "Fenêtre dépassée", message: `${wineName(wine)} dépasse sa fin conseillée (${wine.drinkTo}).`, wineId: wine.id });
    }
    if (wine.quantity <= 1) {
      alerts.push({ type: "low-stock", severity: "warning", title: "Stock faible", message: `${wineName(wine)}: ${wine.quantity} bouteille restante.`, wineId: wine.id });
    }
    if (bottleValue(wine) >= 250 || wine.estimatedValue >= 100) {
      alerts.push({ type: "high-value", severity: "info", title: "Valeur elevee", message: `${wineName(wine)} vaut environ ${formatMoney(bottleValue(wine))}.`, wineId: wine.id });
    }
    if (wine.drinkTo && wine.drinkTo - currentYear <= 1 && wine.drinkTo >= currentYear) {
      alerts.push({ type: "drink-window-end", severity: "warning", title: "Fenêtre proche de la fin", message: `${wineName(wine)} est à boire avant ${wine.drinkTo}.`, wineId: wine.id });
    }
    if (!getWineLocationLabel(wine)) {
      alerts.push({ type: "missing-location", severity: "warning", title: "Emplacement manquant", message: `${wineName(wine)} n'a pas encore d'emplacement précis.`, wineId: wine.id });
    }
    if (!wine.region || !wine.purchasePrice || !wine.estimatedValue) {
      alerts.push({ type: "incomplete-data", severity: "info", title: "Données incomplètes", message: `${wineName(wine)} mérite quelques informations en plus.`, wineId: wine.id });
    }
  });

  getLocationConflicts().forEach(([key, conflictWines]) => {
    alerts.push({
      type: "location-conflict",
      severity: "warning",
      title: "Emplacement partagé",
      message: `${conflictWines.length} références utilisent ${key}.`,
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
    return { state: "late", label: "Dépassé", sentence: `La fenêtre conseillée se terminait en ${to}.` };
  }
  if (to && currentYear >= to - 1) {
    return { state: "soon", label: "Bientôt", sentence: `À boire bientôt, jusqu'en ${to}.` };
  }
  if (from && currentYear < from) {
    return { state: "wait", label: "À garder", sentence: `Patience jusqu'en ${from}.` };
  }
  return { state: "ready", label: "Prêt", sentence: to ? `Idéal maintenant, jusqu'en ${to}.` : "Prêt à déguster." };
}

function wineName(wine) {
  return `${wine.domain} - ${wine.cuvee}`;
}

function bottleValue(wine) {
  return Number(wine.quantity || 0) * Number(wine.estimatedValue || wine.price || 0);
}

function formatLocation(wine) {
  if (wine.positionLabel) return wine.positionLabel;
  const structured = [wine.cellarName, wine.rack && `casier ${wine.rack}`, wine.row && `rangée ${wine.row}`, wine.column && `colonne ${wine.column}`].filter(Boolean).join(" · ");
  return structured || wine.location || "";
}

function locationKey(wine) {
  return [wine.cellarName, wine.rack, wine.row, wine.column].map((value) => cleanString(value).toLowerCase()).join("|");
}

function getLocationConflicts() {
  const byKey = new Map();
  locationConflictMap.forEach((conflict) => {
    byKey.set(conflict.key, conflict.ids.map((id) => wines.find((wine) => wine.id === id)).filter(Boolean));
  });
  return [...byKey.entries()];
}

function hasLocationConflict(wine) {
  return Boolean(locationConflictMap.get(wine.id)?.count > 1);
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
  const text = window.OenovaHelpers?.formatCsvValue
    ? window.OenovaHelpers.formatCsvValue(value)
    : sanitizeCsvFormula(value);
  if (window.OenovaHelpers?.formatCsvValue) return text;
  if (/[;,"\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function sanitizeCsvFormula(value) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
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
  if (score >= 90) return "Priorité très haute";
  if (score >= 70) return "Priorité haute";
  if (score >= 45) return "Bonne fenêtre";
  return "Peut attendre";
}

function priorityLabel(priority) {
  return { high: "Priorité haute", medium: "Priorité moyenne", low: "Priorité basse" }[priority] || "Priorité moyenne";
}

function sumValueBy(items, key) {
  return items.reduce((result, item) => {
    const label = item[key] || "Non renseigné";
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

function formatColorLabel(value) {
  return value === "Rose" ? "Rosé" : value;
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

function pushMapValue(map, key, value) {
  if (!key) return;
  map.set(key, [...(map.get(key) || []), value]);
}

function updateSelectOptions(select, values, allLabel, allValue) {
  const current = select.value;
  select.innerHTML = `<option value="${allValue}">${allLabel}</option>` + values.map((value) => `<option value="${escapeAttribute(value)}">${escapeHtml(value)}</option>`).join("");
  select.value = values.includes(current) ? current : allValue;
}

function countBy(items, key) {
  return items.reduce((result, item) => {
    const value = item[key] || "Non renseigné";
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
  if (!elements.statusMessage) return;
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

function generateTestWines(count = 50) {
  if (!DEBUG_PERF) return [];
  const domains = ["Domaine Test", "Château Demo", "Clos Performance", "Maison Cache"];
  const colors = COLORS;
  return Array.from({ length: count }, (_, index) => normalizeWine({
    domain: `${domains[index % domains.length]} ${index + 1}`,
    cuvee: `Cuvée ${index + 1}`,
    color: colors[index % colors.length],
    region: ["Bordeaux", "Bourgogne", "Loire", "Rhône"][index % 4],
    appellation: `Appellation ${index % 12}`,
    vintage: 2000 + (index % 25),
    quantity: 1 + (index % 6),
    price: 12 + (index % 90),
    estimatedValue: 14 + (index % 120),
    drinkFrom: currentYear - (index % 3),
    drinkTo: currentYear + (index % 8),
    cellarName: index % 2 ? "Cave principale" : "Armoire de service",
    rack: String.fromCharCode(65 + (index % 8)),
    row: String((index % 6) + 1),
    column: String((index % 10) + 1),
    tags: ["test", colors[index % colors.length].toLowerCase()]
  }));
}
