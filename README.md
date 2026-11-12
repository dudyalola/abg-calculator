# IM Tools: Preop · ABG · Calendar

One installable app with a bottom tab bar:

| Tab | Page | Lives in |
|---|---|---|
| Preop | `preop/` | this repo |
| ABG | `abg/` | this repo |
| Calendar | `../opd-calendar/` | `dudyalola/opd-calendar` (code only; data in a private repo) |

`index.html` is a thin shell that holds each tool in a same-origin iframe.
Switching tabs keeps each tool's scroll position and inputs. Tapping the active
tab again scrolls it to the top. `#preop`, `#abg` and `#cal` open a specific tab.
The shell loads the tab you open first and warms the other two in the
background, so all three work offline after one launch with signal.

No analytics, no backend, no patient data in this repo.

## Install

**iPhone**: open the Pages URL in Safari → Share → Add to Home Screen.
**Mac**: open it in Safari → File → Add to Dock.

A home-screen app gets its own storage on iOS. The Calendar tab asks for its
GitHub token once inside this app, and ABGs saved in a different install don't
carry over.

## ABG calculator (`abg/`)

Acid–base, oxygenation and VBG interpretation, worked the way the PGH IM
procedures manual's ABG chapter does (Sections 1–4, pp. 61–74), ending in a
chart-ready one-line entry.

1. Primary disorder, named against pH 7.40 rather than the 7.35–7.45 range
2. Expected compensation, with an acute/chronic switch for respiratory processes
3. Secondary and mixed disorders, from actual against predicted
4. Anion gap, albumin-corrected gap, Δ/Δ, and bicarbonate deficit
5. Oxygenation: A–a gradient, P/F ratio, desired pO₂ and FiO₂ titration

Plus VBG→arterial estimation and all nine of the chapter's worked cases, which
the tool reproduces exactly. Saved ABGs stay in this device's `localStorage`.

An offline single-file copy also lives in the vault at
`IM RESIDENCY/ABG Calculator.html`. Edit `abg/index.html`, then run
`python3 make-offline.py`.

## Preop clearance (`preop/`)

Procedure risk (ESC), RCRI and ARISCAT, feeding the clearance sentence.
This is the hosted copy of `~/Documents/RESIDENCY WIKI/Preop_Risk_Calculators.html`.

## One origin, shared storage

Everything on `dudyalola.github.io` shares one localStorage and one cache
store. Keys are namespaced (`imtools.*`, `abgcalc.*`, `opd.*`). Each service
worker deletes only caches with its own prefix (`abg-` here, `opdcal-` for the
calendar). Keep it that way: a worker that clears every cache but its own wipes
the other app's offline copy.

## Files

| File | |
|---|---|
| `index.html` | the shell (tab bar + iframes) |
| `sw.js` | offline cache for the shell, `abg/` and `preop/`; bump `CACHE` when assets change |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | install metadata for the combined app |
| `abg/` | the ABG calculator, with its own manifest and icons for the offline build |
| `preop/` | the preop worksheet |
| `make-offline.py` | builds the vault's offline ABG file |

## Caveats

Decision support, not a decision. Every figure is an estimate, and none
replaces the clinical read on the patient.
