(() => {
  // Check if already running
  if (window.priceConverterActive) {
    // Remove UI
    const existingUI = document.getElementById("priceConverterUI");
    if (existingUI) existingUI.remove();

    // Remove event listeners
    document.removeEventListener("keydown", window.priceConverterKeyListener);
    window.priceConverterActive = false;
    return;
  }

  window.priceConverterActive = true;

  const API = "https://api.exchangerate-api.com/v4/latest/USD";
  let rates = null;
  const undoStack = [];

  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];
  const symbols = {
    "$": "USD", "USD": "USD",
    "€": "EUR", "EUR": "EUR",
    "£": "GBP", "GBP": "GBP",
    "¥": "JPY", "JPY": "JPY",
    "C$": "CAD", "CAD": "CAD",
    "A$": "AUD", "AUD": "AUD",
    "CHF": "CHF",
    "CN¥": "CNY", "CNY": "CNY"
  };

  // Create UI
  const ui = document.createElement("div");
  ui.id = "priceConverterUI";
  ui.style = "position:fixed;top:10px;right:10px;background:#fff;padding:10px;border:1px solid #ccc;z-index:9999;font-family:sans-serif;";
  ui.innerHTML = `
    <label>From:
      <select id="fromCurrency">${currencies.map(c => `<option value="${c}">${c}</option>`).join("")}</select>
    </label>
    <label>To:
      <select id="toCurrency">${currencies.map(c => `<option value="${c}">${c}</option>`).join("")}</select>
    </label>
    <button id="convertBtn">Convert Selection</button>
    <button id="undoBtn">Undo</button>
    <small>Alt+C = Convert | Alt+Z = Undo</small>
  `;
  document.body.appendChild(ui);

  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");
  const convertBtn = document.getElementById("convertBtn");
  const undoBtn = document.getElementById("undoBtn");

  const PRICE_REGEX = /\b(?:\$|USD|€|EUR|£|GBP|¥|JPY|C\$|A\$|CHF|CN¥|CAD|AUD|CNY)?\s*\d{1,3}(?:[.,\s]\d{2,3})*\b/g;

  async function loadRates() {
    if (rates) return rates;
    const res = await fetch(API);
    const data = await res.json();
    rates = data.rates;
    return rates;
  }

  function detectCurrency(symbol) {
    if (!symbol) return fromSelect.value;
    symbol = symbol.trim();
    return symbols[symbol] || fromSelect.value;
  }

  function parseNumber(str) {
    let num = str.replace(/[^\d.,]/g, "");
    if (num.includes(" ")) num = num.replace(" ", ".");
    if (num.includes(",")) num = num.replace(",", ".");
    return parseFloat(num);
  }

  function convertAmount(value, fromRate, toRate) {
    return ((toRate / fromRate) * value).toFixed(2);
  }

  async function convertSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const text = range.toString();
    if (!text) return;

    await loadRates();

    const convertedFragments = [];
    let lastIndex = 0;

    text.replace(PRICE_REGEX, (match, offset) => {
      convertedFragments.push({ text: text.slice(lastIndex, offset), original: null });

      const symbolMatch = match.match(/^\s*(\$|USD|€|EUR|£|GBP|¥|JPY|C\$|A\$|CHF|CN¥|CAD|AUD)/i);
      const fromCurrency = detectCurrency(symbolMatch ? symbolMatch[1] : null);

      const value = parseNumber(match);
      if (!Number.isFinite(value)) {
        convertedFragments.push({ text: match, original: null });
      } else {
        const converted = convertAmount(value, rates[fromCurrency], rates[toSelect.value]);
        convertedFragments.push({ text: `${converted} ${toSelect.value}`, original: match });
      }

      lastIndex = offset + match.length;
    });

    convertedFragments.push({ text: text.slice(lastIndex), original: null });

    // Save for undo
    undoStack.push({ range: range.cloneRange(), originalText: text });

    // Replace selection
    range.deleteContents();
    const frag = document.createDocumentFragment();
    convertedFragments.forEach(f => {
      if (f.original) {
        const span = document.createElement("span");
        span.textContent = f.text;
        span.title = f.original;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(f.text));
      }
    });
    range.insertNode(frag);
    window.getSelection().removeAllRanges();
  }

  function undoConversion() {
    if (undoStack.length === 0) return;
    const last = undoStack.pop();
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(last.range);
    last.range.deleteContents();
    last.range.insertNode(document.createTextNode(last.originalText));
    sel.removeAllRanges();
  }

  // Buttons
  convertBtn.addEventListener("click", convertSelection);
  undoBtn.addEventListener("click", undoConversion);

  // Hotkeys
  window.priceConverterKeyListener = e => {
    if (e.altKey && e.key.toLowerCase() === "c") convertSelection();
    if (e.altKey && e.key.toLowerCase() === "z") undoConversion();
  };
  document.addEventListener("keydown", window.priceConverterKeyListener);

})();