(function initOenarisSharedHelpers(root) {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function sanitizeCsvFormula(value) {
    const text = String(value ?? "");
    return /^[=+\-@]/.test(text) ? `'${text}` : text;
  }

  function formatCsvValue(value) {
    const text = sanitizeCsvFormula(value);
    if (/[;,"\n\r]/.test(text)) {
      return `"${text.replaceAll('"', '""')}"`;
    }
    return text;
  }

  function estimateDataUrlBytes(dataUrl) {
    const text = String(dataUrl || "");
    const commaIndex = text.indexOf(",");
    if (commaIndex < 0) return new Blob([text]).size;
    const base64 = text.slice(commaIndex + 1);
    return Math.ceil((base64.length * 3) / 4);
  }

  const helpers = {
    escapeHtml,
    escapeAttribute,
    sanitizeCsvFormula,
    formatCsvValue,
    estimateDataUrlBytes
  };

  root.OenarisHelpers = {
    ...(root.OenarisHelpers || {}),
    ...helpers
  };
  root.OenovaHelpers = root.OenarisHelpers;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = helpers;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
