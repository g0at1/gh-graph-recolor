function hexToHsl(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  r = +r; g = +g; b = +b;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;

  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToHex(h, s, l) {
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }
  let r, g, b;

  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x) => {
    const v = Math.round(x * 255).toString(16).padStart(2, "0");
    return v;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function buildPalette(baseHex) {
  const { h, s } = hexToHsl(baseHex);
  const L0 = "#151b23";

  const levels = [0.28, 0.40, 0.58, 0.76];
  const sat = Math.max(0.70, Math.min(0.95, s || 0.85));

  return {
    L0,
    L1: hslToHex(h, sat, levels[0]),
    L2: hslToHex(h, sat, levels[1]),
    L3: hslToHex(h, sat, levels[2]),
    L4: hslToHex(h, sat, levels[3]),
  };
}

const baseInput = document.getElementById("base");
const baseSwatch = document.getElementById("baseSwatch");
const preview = document.getElementById("preview");
const saveBtn = document.getElementById("save");
const resetBtn = document.getElementById("reset");

function renderPreview(p) {
  preview.innerHTML = "";
  [p.L0, p.L1, p.L2, p.L3, p.L4].forEach(c => {
    const d = document.createElement("div");
    d.className = "cell";
    d.style.background = c;
    preview.appendChild(d);
  });
  baseSwatch.style.background = baseInput.value;
}

function load() {
  chrome.storage.sync.get(["palette", "baseHex"], (res) => {
    const baseHex = res.baseHex || "#2d7ff9";
    baseInput.value = baseHex;
    const palette = res.palette || buildPalette(baseHex);
    renderPreview(palette);
  });
}

baseInput.addEventListener("input", () => {
  const p = buildPalette(baseInput.value);
  renderPreview(p);
});

saveBtn.addEventListener("click", () => {
  const palette = buildPalette(baseInput.value);
  chrome.storage.sync.set({ palette, baseHex: baseInput.value }, () => {
    saveBtn.textContent = "Saved!";
    setTimeout(() => (saveBtn.textContent = "Save"), 1000);
  });
});

resetBtn.addEventListener("click", () => {
  const DEFAULT = {
    L0: "#151b23",
    L1: "#0a3b78",
    L2: "#1556c0",
    L3: "#4f8eff",
    L4: "#a4c6ff"
  };
  chrome.storage.sync.set({ palette: DEFAULT, baseHex: "#2d7ff9" }, load);
});

load();
