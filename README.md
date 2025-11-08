# GitHub Contribution Graph Recolorer

A lightweight Chrome extension that lets you fully customize the colors of the GitHub contribution graph.  
It uses an HSL–based palette generator, automatic dark→light blue shading, and strong CSS overrides that work across GitHub’s light, dark, and evolving themes.

GitHub changes its internal CSS structures frequently.  
This extension uses both variable injection and hard fallbacks to guarantee consistent coloring of all contribution tiles.

---

## Features

### **✓ Fully customizable colors**
- Choose any **base color**
- Extension generates a 5–step palette (L1 → L4)
- **L1 = darkest**, **L4 = lightest**
- **L0** (no activity) is customizable (default: `#151b23`)

### **✓ Automatic HSL palette generation**
The extension extracts **hue** and **saturation** from the selected base color, then applies tuned **lightness** values:

| Level | Meaning         |
|-------|-----------------|
| L0    | No activity     |
| L1    | Lowest activity |
| L2    | Low activity    |
| L3    | Medium          |
| L4    | High activity   |

### **✓ Works with all GitHub themes**

Supports GitHub’s:
- Light
- Dark
- System/Auto
- Older `--color-calendar-graph-day-*` variables
- Newer `--contribution-default-bgColor-*` variables

### **✓ DOM-aware and reliable**
GitHub uses PJAX and dynamically replaces parts of the page.  
The extension:
- watches for DOM mutations  
- re-injects the palette when needed  
- always wins over GitHub CSS with controlled `!important` overrides

### **✓ Syncs across devices**
Uses `chrome.storage.sync`, so your palette follows you between machines.

---

## How It Works

### **1. Options Page**
The user selects a **base hex color**.

The extension:
- converts hex → HSL (`hexToHsl`)
- generates five levels (`buildPalette`)
- shows a live preview
- stores palette + baseHex in `chrome.storage.sync`

---

## Installation (Developer Mode)

- Clone or download the repository
- Navigate to chrome://extensions/
- Enable Developer mode
- Click Load unpacked
- Select the project folder
- Open your GitHub profile page
- The contribution graph updates instantly

  ---

## Default Palette Example

### Given base color: #2d7ff9

| Level | Hex	    | Description     |
|-------|---------|-----------------|
| L0	  | #151b23 |	No activity     |
| L1	  | #0a3b78	| Lowest activity |
| L2	  | #1556c0	| Low activity    |
| L3	  | #4f8eff	| Medium activity |
| L4	  | #a4c6ff	| High activity   |
