# ABG Calculator

Acid–base, oxygenation and VBG interpretation, worked the way the PGH IM
procedures manual's ABG chapter does (Sections 1–4, pp. 61–74), ending in a
chart-ready one-line entry.

Installable as an app on iPhone and Mac. Works with no signal after first load.

## Install

**iPhone** — open the Pages URL in Safari, then Share → Add to Home Screen.
**Mac** — open it in Safari, then File → Add to Dock.

Both give the ABG icon, a full-screen window with no browser chrome, and offline
use once the service worker has cached it.

## What it computes

1. Primary disorder, named against pH 7.40 rather than the 7.35–7.45 range
2. Expected compensation, with an acute/chronic switch for respiratory processes
3. Secondary and mixed disorders, from actual against predicted
4. Anion gap, albumin-corrected gap, Δ/Δ, and bicarbonate deficit
5. Oxygenation — A–a gradient, P/F ratio, desired pO₂ and FiO₂ titration

Plus VBG→arterial estimation and all nine of the chapter's worked cases, which
the tool reproduces exactly.

## Privacy

No analytics, no network calls, no backend. Saved ABGs live in the browser's own
`localStorage` on the device that entered them — they are never uploaded and
never shared between devices.

## Files

| File | |
|---|---|
| `index.html` | the whole app, self-contained |
| `manifest.webmanifest` | name, icons, standalone display |
| `sw.js` | offline cache |
| `icon-*.png` | app icons |

An offline single-file copy without the service worker also lives in the vault at
`IM RESIDENCY/ABG Calculator.html`. Changes made here should be copied there.

## Caveats

Decision support, not a decision. Every figure is an estimate from the chapter's
formulas, and none replaces the clinical read on the patient.
