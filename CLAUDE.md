# ADEC Sensor Network Tracker

## What This Is
Internal tool for Alaska Department of Environmental Conservation (ADEC) to track air quality sensors (QuantAQ Modulairs), the communities they're deployed in, and contacts at each site. Replaces a clunky Salesforce workflow.

## How to Run
Open `index.html` in a browser. No build step, no server — it's a single-page app (HTML + CSS + JS).

## Architecture
- **index.html** — all views, modals, and layout (single file)
- **styles.css** — full styling, "Arctic Observatory" design theme
- **app.js** — all logic, data, and rendering (~1600 lines)
- **Data storage** — browser localStorage (keys prefixed `snt_`). No backend yet.

## Key Concepts
- **~40 communities** across Alaska, each typically has 1 sensor at a gathering place (school, tribal office, library)
- **3 regulatory sites** (Anchorage, Fairbanks, Juneau) with permanent pods
- **Audit pods** travel to communities for ~1 week collocations to validate sensor data
- **Sensor types**: Community Pod, Permanent Pod, Audit Pod
- **Cross-tagging**: notes can be tagged to multiple sensors, communities, and contacts — a single note appears in the history of everything it's tagged to
- **Auto-generated movement notes** when a sensor is moved between communities
- **Community tags** (e.g. "Regulatory Site", "Interior Network") are customizable per community

## Current Communities (hardcoded in app.js)
Anchorage, Fairbanks, Juneau, Bethel, Homer, Ketchikan, Kodiak, Ninilchik, Sitka, Tyonek, Wasilla, Wrangell

## Sensor Statuses
Online, Offline, In Transit, Service at Quant, Collocation, Auditing a Community, Lab Storage, Needs Repair, Ready for Deployment, PM Sensor Issue, Gaseous Sensor Issue, SD Card Issue

## Features Built
- Login screen (name-based, stored in localStorage)
- Dashboard with stat cards + embedded ArcGIS map iframe
- Sensor list with search/filter, add/edit sensors, move sensors between communities, inline status changes
- Community list and detail pages with tabs: Sensors, Contacts, Community History, Communications, Files
- Contact list (grouped by community) and detail pages
- Notes with @mention autocomplete for contacts and chip-based tagging for sensors/communities/contacts
- Communication logging (email, phone, site visit, etc.)
- Email composer with recipient filtering by community (opens mailto: link)
- File uploads per community (stored as base64 in localStorage)
- Edit annotations — when sensor fields change, a modal prompts for context which gets saved as a history note
- All changes are attributed to the logged-in user

## Design Rules
- **Colors**: Navy blue, gold, and white ONLY. No teal.
- **Fonts**: DM Sans (UI) + JetBrains Mono (sensor IDs, code)
- Keep the UI simple and beginner-friendly
- CSS uses custom properties (design tokens) in :root

## Things to Know
- Communities list is hardcoded in `COMMUNITIES` array at top of app.js — more will be added over time
- Sample data (sensors, contacts, one audit note) seeds on first load when localStorage is empty
- The `persist()` function saves all data arrays to localStorage
- Views are toggled by adding/removing the `.active` class
- Modals use `.open` class to show
