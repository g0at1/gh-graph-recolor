const DEFAULT_PALETTE = {
  L0: "#151b23",
  L1: "#0a3b78",
  L2: "#1556c0",
  L3: "#4f8eff",
  L4: "#a4c6ff",
};

const STYLE_ID = "gh-graph-recolor-style";

function cssForVariables(p) {
  return `
:root,
html[data-color-mode="light"],
html[data-color-mode="dark"] {
  --contribution-default-bgColor-0: ${p.L0};
  --contribution-default-bgColor-1: ${p.L1};
  --contribution-default-bgColor-2: ${p.L2};
  --contribution-default-bgColor-3: ${p.L3};
  --contribution-default-bgColor-4: ${p.L4};

  --contribution-default-borderColor-0: ${p.L0};
  --contribution-default-borderColor-1: ${p.L1};
  --contribution-default-borderColor-2: ${p.L2};
  --contribution-default-borderColor-3: ${p.L3};
  --contribution-default-borderColor-4: ${p.L4};
}

.ContributionCalendar-day[data-level="0"] { 
  fill: ${p.L0} !important; 
  background-color: ${p.L0} !important; 
  border-color: ${p.L0} !important;
}
.ContributionCalendar-day[data-level="1"] { 
  fill: ${p.L1} !important; 
  background-color: ${p.L1} !important; 
  border-color: ${p.L1} !important;
}
.ContributionCalendar-day[data-level="2"] { 
  fill: ${p.L2} !important; 
  background-color: ${p.L2} !important; 
  border-color: ${p.L2} !important;
}
.ContributionCalendar-day[data-level="3"] { 
  fill: ${p.L3} !important; 
  background-color: ${p.L3} !important; 
  border-color: ${p.L3} !important;
}
.ContributionCalendar-day[data-level="4"] { 
  fill: ${p.L4} !important; 
  background-color: ${p.L4} !important; 
  border-color: ${p.L4} !important;
}

svg .day-level-0 { fill: ${p.L0} !important; }
svg .day-level-1 { fill: ${p.L1} !important; }
svg .day-level-2 { fill: ${p.L2} !important; }
svg .day-level-3 { fill: ${p.L3} !important; }
svg .day-level-4 { fill: ${p.L4} !important; }
`;
}

function injectStyle(palette) {
  const css = cssForVariables(palette);
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

function loadAndApply() {
  chrome.storage.sync.get(["palette"], (res) => {
    const palette = validatePalette(res.palette) || DEFAULT_PALETTE;
    injectStyle(palette);
  });
}

function validatePalette(p) {
  if (!p) return null;
  const keys = ["L0", "L1", "L2", "L3", "L4"];
  return keys.every((k) => typeof p[k] === "string" && p[k].startsWith("#")) ? p : null;
}

const observeDOM = () => {
  const obs = new MutationObserver(() => {
    loadAndApply();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
};

loadAndApply();
observeDOM();

chrome.storage.onChanged.addListener((changes) => {
  if (changes.palette) {
    const val = validatePalette(changes.palette.newValue) || DEFAULT_PALETTE;
    injectStyle(val);
  }
});
