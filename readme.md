# Festival Planner

A lightweight, client-side festival schedule planner. Browse full lineups across multiple stages and days, star your must-see bands, and spot time clashes before they happen.

## Festivals

- **Graspop Metal Meeting 2026** — Dessel, Belgium · 18–21 June · 5 stages
- **2000trees Festival 2026** — Upcote Farm, Cheltenham · 8–11 July · 5 stages

## Features

- **Festival picker** — choose your festival from a landing page
- **Timeline view** — visual schedule per day with all stages side by side
- **Browse view** — searchable card grid with global search across all days
- **Picks view** — your starred bands grouped by day, with automatic clash detection
- **Clash alerts** — overlapping sets are flagged with ⚡ everywhere they appear
- **Multi-user** — multiple names can save independent picks on the same device
- **Toast feedback** — visual confirmation when adding or removing bands
- **Mobile timeline** — vertical card layout replaces horizontal scroll on phones
- **Accessible** — keyboard navigable, ARIA roles, focus trapping, screen-reader labels

## Usage

Open `index.html` in a browser, or visit the [live site](https://scollo-ricardo.github.io/festival-clash-finder/).

No build step, no dependencies, no server — just static HTML/CSS/JS served via GitHub Pages.

## Project structure

```
├── index.html        # Markup and page shell
├── css/
│   └── style.css     # All styles
├── js/
│   ├── data.js       # Festival configs and schedule data
│   └── app.js        # UI logic, state, rendering, events
├── LICENSE
└── README.md
```

## Adding a festival

Add a new entry to the `FESTIVALS` object in `js/data.js`. Each festival needs: `id`, `name`, `short`, `location`, `dates`, `stages` (with colors), `days`, `dayShort`, and a `schedule` object mapping stages → days → `[start, end, "Band Name"]` arrays. Times past midnight use 24h+ notation (e.g. `"25:30"` = 1:30 AM).

## Storage

Picks are saved in `localStorage` under `picks_{festivalId}`. Tabs in the same browser sync via `BroadcastChannel`. There is no backend — data lives entirely in your browser.

## License

See [LICENSE](LICENSE).
