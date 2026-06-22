const storageKey = "mini-cave-a-vin";
const currentYear = new Date().getFullYear();

const sampleWines = [
  {
    id: crypto.randomUUID(),
    domain: "Domaine Leflaive",
    cuvee: "Bourgogne Blanc",
    color: "Blanc",
    region: "Bourgogne",
    appellation: "Bourgogne",
    vintage: 2020,
    quantity: 4,
    price: 44,
    drinkFrom: 2024,
    drinkTo: 2028,
    location: "Casier A1",
    notes: "A garder pour poissons nobles, volailles crémées ou fromages affinés."
  },
  {
    id: crypto.randomUUID(),
    domain: "Château Poujeaux",
    cuvee: "Grand vin",
    color: "Rouge",
    region: "Bordeaux",
    appellation: "Moulis-en-Médoc",
    vintage: 2016,
    quantity: 6,
    price: 32,
    drinkFrom: 2022,
    drinkTo: 2032,
    location: "Casier C2",
    notes: "Structure encore présente, parfait avec une côte de boeuf."
  },
  {
    id: crypto.randomUUID(),
    domain: "Champagne Billecart-Salmon",
    cuvee: "Brut Réserve",
    color: "Effervescent",
    region: "Champagne",
    appellation: "Champagne",
    vintage: 0,
    quantity: 3,
    price: 49,
    drinkFrom: currentYear,
    drinkTo: currentYear + 2,
    location: "Haut de cave",
    notes: "Bouteilles prêtes pour apéritif ou grande occasion improvisée."
  }
];

let wines = loadWines();

const elements = {
  dialog: document.querySelector("#wineDialog"),
  form: document.querySelector("#wineForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  wineId: document.querySelector("#wineId"),
  openFormButton: document.querySelector("#openFormButton"),
  closeDialogButton: document.querySelector("#closeDialogButton"),
  deleteButton: document.querySelector("#deleteButton"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFileInput: document.querySelector("#importFileInput"),
  installButton: document.querySelector("#installButton"),
  searchInput: document.querySelector("#searchInput"),
  colorFilter: document.querySelector("#colorFilter"),
  sortSelect: document.querySelector("#sortSelect"),
  wineList: document.querySelector("#wineList"),
  watchList: document.querySelector("#watchList"),
  emptyState: document.querySelector("#emptyState"),
  resultCount: document.querySelector("#resultCount"),
  statBottles: document.querySelector("#statBottles"),
  statRefs: document.querySelector("#statRefs"),
  statValue: document.querySelector("#statValue"),
  statReady: document.querySelector("#statReady"),
  statusMessage: document.querySelector("#statusMessage")
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
  notes: document.querySelector("#notesInput")
};

elements.openFormButton.addEventListener("click", () => openForm());
elements.closeDialogButton.addEventListener("click", () => elements.dialog.close());
elements.form.addEventListener("submit", saveWine);
elements.deleteButton.addEventListener("click", deleteCurrentWine);
elements.exportButton.addEventListener("click", exportCellar);
elements.importButton.addEventListener("click", () => elements.importFileInput.click());
elements.importFileInput.addEventListener("change", importCellar);
elements.searchInput.addEventListener("input", render);
elements.colorFilter.addEventListener("change", render);
elements.sortSelect.addEventListener("change", render);

let deferredInstallPrompt = null;

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

render();

function loadWines() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    localStorage.setItem(storageKey, JSON.stringify(sampleWines));
    return sampleWines;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return sampleWines;
  }
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(wines));
}

function render() {
  const filtered = getFilteredWines();
  renderStats();
  renderWineList(filtered);
  renderWatchList();
}

function getFilteredWines() {
  const term = elements.searchInput.value.trim().toLowerCase();
  const color = elements.colorFilter.value;

  return wines
    .filter((wine) => color === "all" || wine.color === color)
    .filter((wine) => {
      if (!term) return true;
      return [
        wine.domain,
        wine.cuvee,
        wine.region,
        wine.appellation,
        wine.location,
        String(wine.vintage || "Non millésimé")
      ].join(" ").toLowerCase().includes(term);
    })
    .sort(sortWines);
}

function sortWines(a, b) {
  const sort = elements.sortSelect.value;
  if (sort === "name") return wineName(a).localeCompare(wineName(b));
  if (sort === "quantity") return b.quantity - a.quantity;
  if (sort === "value") return bottleValue(b) - bottleValue(a);
  if (sort === "vintage") return Number(b.vintage || 0) - Number(a.vintage || 0);
  return Number(a.drinkTo || 9999) - Number(b.drinkTo || 9999);
}

function renderStats() {
  const totalBottles = wines.reduce((sum, wine) => sum + Number(wine.quantity || 0), 0);
  const value = wines.reduce((sum, wine) => sum + bottleValue(wine), 0);
  const ready = wines.filter((wine) => drinkStatus(wine).state !== "wait").length;

  elements.statBottles.textContent = totalBottles;
  elements.statRefs.textContent = wines.length;
  elements.statValue.textContent = formatMoney(value);
  elements.statReady.textContent = ready;
}

function renderWineList(filtered) {
  elements.wineList.innerHTML = "";
  elements.emptyState.hidden = filtered.length > 0;
  elements.resultCount.textContent = `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}`;

  filtered.forEach((wine) => {
    const status = drinkStatus(wine);
    const card = document.createElement("article");
    card.className = "wine-card";
    card.dataset.color = wine.color;
    card.innerHTML = `
      <div>
        <div class="wine-title">${escapeHtml(wineName(wine))}</div>
        <div class="wine-meta">
          <span>${escapeHtml(wine.color)}</span>
          <span>${escapeHtml(wine.region)}</span>
          <span>${escapeHtml(wine.appellation || "Sans appellation")}</span>
          <span>${wine.vintage ? escapeHtml(String(wine.vintage)) : "Non millésimé"}</span>
          <span>${escapeHtml(wine.location || "Emplacement non renseigné")}</span>
        </div>
        <p class="wine-notes">${escapeHtml(wine.notes || "Aucune note pour le moment.")}</p>
      </div>
      <div class="wine-facts">
        <span class="pill ${status.state}">${status.label}</span>
        <strong>${wine.quantity} bouteille${wine.quantity > 1 ? "s" : ""}</strong>
        <span>${formatMoney(bottleValue(wine))}</span>
        <button class="edit-button" type="button" data-id="${wine.id}">Modifier</button>
      </div>
    `;
    elements.wineList.append(card);
  });

  elements.wineList.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", () => {
      const wine = wines.find((item) => item.id === button.dataset.id);
      if (wine) openForm(wine);
    });
  });
}

function renderWatchList() {
  const watched = [...wines]
    .sort((a, b) => Number(a.drinkTo || 9999) - Number(b.drinkTo || 9999))
    .slice(0, 4);

  elements.watchList.innerHTML = "";

  if (!watched.length) {
    elements.watchList.innerHTML = `<p>Aucune bouteille en cave.</p>`;
    return;
  }

  watched.forEach((wine) => {
    const status = drinkStatus(wine);
    const item = document.createElement("div");
    item.className = "watch-card";
    item.innerHTML = `
      <strong>${escapeHtml(wineName(wine))}</strong>
      <p>${status.sentence}</p>
    `;
    elements.watchList.append(item);
  });
}

function openForm(wine = null) {
  elements.form.reset();
  elements.wineId.value = wine?.id || "";
  elements.dialogTitle.textContent = wine ? "Modifier une bouteille" : "Ajouter une bouteille";
  elements.deleteButton.hidden = !wine;

  if (wine) {
    Object.entries(fields).forEach(([key, input]) => {
      input.value = wine[key] ?? "";
    });
  } else {
    fields.vintage.value = currentYear;
    fields.quantity.value = 1;
    fields.drinkFrom.value = currentYear;
    fields.drinkTo.value = currentYear + 5;
  }

  elements.dialog.showModal();
  fields.domain.focus();
}

function saveWine(event) {
  event.preventDefault();

  const wine = {
    id: elements.wineId.value || crypto.randomUUID(),
    domain: fields.domain.value.trim(),
    cuvee: fields.cuvee.value.trim(),
    color: fields.color.value,
    region: fields.region.value.trim(),
    appellation: fields.appellation.value.trim(),
    vintage: Number(fields.vintage.value || 0),
    quantity: Number(fields.quantity.value || 1),
    price: Number(fields.price.value || 0),
    drinkFrom: Number(fields.drinkFrom.value || 0),
    drinkTo: Number(fields.drinkTo.value || 0),
    location: fields.location.value.trim(),
    notes: fields.notes.value.trim()
  };

  const existingIndex = wines.findIndex((item) => item.id === wine.id);
  if (existingIndex >= 0) {
    wines[existingIndex] = wine;
  } else {
    wines = [wine, ...wines];
  }

  persist();
  elements.dialog.close();
  render();
}

function deleteCurrentWine() {
  const id = elements.wineId.value;
  wines = wines.filter((wine) => wine.id !== id);
  persist();
  elements.dialog.close();
  render();
}

function exportCellar() {
  const backup = {
    app: "Cave a vin",
    version: 1,
    exportedAt: new Date().toISOString(),
    wines
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cave-a-vin-${date}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showStatus("Sauvegarde exportée.");
}

function importCellar(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const data = JSON.parse(String(reader.result));
      const importedWines = Array.isArray(data) ? data : data.wines;
      if (!Array.isArray(importedWines)) {
        throw new Error("Format de sauvegarde invalide.");
      }

      wines = importedWines.map(normalizeImportedWine);
      persist();
      elements.importFileInput.value = "";
      render();
      showStatus("Sauvegarde importée.");
    } catch (error) {
      alert("Impossible d'importer cette sauvegarde. Vérifie que le fichier JSON vient bien de l'application.");
      elements.importFileInput.value = "";
    }
  });
  reader.readAsText(file);
}

function showStatus(message) {
  elements.statusMessage.textContent = message;
  window.clearTimeout(showStatus.timeoutId);
  showStatus.timeoutId = window.setTimeout(() => {
    elements.statusMessage.textContent = "";
  }, 3500);
}

function normalizeImportedWine(wine) {
  return {
    id: wine.id || crypto.randomUUID(),
    domain: String(wine.domain || "").trim() || "Domaine sans nom",
    cuvee: String(wine.cuvee || "").trim() || "Cuvée sans nom",
    color: ["Rouge", "Blanc", "Rosé", "Effervescent", "Liquoreux"].includes(wine.color) ? wine.color : "Rouge",
    region: String(wine.region || "").trim() || "Région non renseignée",
    appellation: String(wine.appellation || "").trim(),
    vintage: Number(wine.vintage || 0),
    quantity: Math.max(1, Number(wine.quantity || 1)),
    price: Math.max(0, Number(wine.price || 0)),
    drinkFrom: Number(wine.drinkFrom || 0),
    drinkTo: Number(wine.drinkTo || 0),
    location: String(wine.location || "").trim(),
    notes: String(wine.notes || "").trim()
  };
}

function wineName(wine) {
  return `${wine.domain} - ${wine.cuvee}`;
}

function bottleValue(wine) {
  return Number(wine.quantity || 0) * Number(wine.price || 0);
}

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

function drinkStatus(wine) {
  const from = Number(wine.drinkFrom || 0);
  const to = Number(wine.drinkTo || 0);

  if (to && currentYear > to) {
    return {
      state: "late",
      label: "A boire",
      sentence: `La fenêtre conseillée se terminait en ${to}.`
    };
  }

  if (from && currentYear < from) {
    return {
      state: "wait",
      label: "À garder",
      sentence: `Patience jusqu'en ${from}.`
    };
  }

  return {
    state: "ready",
    label: "Prêt",
    sentence: to ? `Idéal maintenant, jusqu'en ${to}.` : "Prêt à déguster."
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
