# Carta Magica — clickable storefront prototype

A self-contained, offline-capable static storefront, not a slide deck or a deployed Shopify theme. No backend, credentials, checkout, orders, or payments. No external fonts, libraries, images, or analytics are needed by the site.

## Preview

Open `index.html` in a modern browser, or serve this folder:

```sh
cd /workspace/carta-magica-site
python3 -m http.server 8874 --bind 0.0.0.0
```

Then open `http://localhost:8874/`. A local server is recommended for consistent cart persistence. `localhost` refers to the computer running the server, not a remotely hosted public website.

Direct preview routes:
- `index.html?loc=montreal&lang=en` — homepage
- `index.html?loc=ottawa&lang=fr` — Ottawa homepage in French
- `collection.html?loc=ottawa&kind=sealed` — sealed products and filters
- `collection.html?loc=montreal&kind=singles` — six real Montreal single-card examples
- `product.html?loc=ottawa&id=ottawa-821835` — One Piece booster-box detail
- `about.html` — both stores, contact details, hours, directions and shipping notes

Use the persistent location and language controls. Search matches the selected store’s sample products. Filter by game, source category/set, price and export stock; sort by name or price. Condition and physical-card language honestly remain **Not supplied** until variant data arrives. Add items to the local demo cart, change quantities on the product page, remove cart items, and switch stores to see separate baskets. The account control explains the future integration; it is not a sign-in form. Directions and existing-policy links open external public sites.

## Catalog provenance

75 real products sampled from Crystal Commerce exports:

| Source CSV | Sample records |
|---|---:|
| `montreal_inventory_all_previous.csv` | 37 (31 sealed + 6 singles) |
| `ottawa_inventory_TCG_Sealed_Product.csv` | 24 sealed |
| `ottawa_inventory_Dragon_Ball_Z_CCG_Sealed.csv` | 6 sealed |
| `ottawa_inventory_other_categories.csv` | 8 (3 board games, 2 accessories, 1 RPG, 1 Gunpla, 1 collectible/miniature) |

The Montreal export is an approximately month-old snapshot. Ottawa samples come from the sealed/other exports downloaded during the inventory audit. **No live inventory is fetched.** Prices are CAD; stock is the original product-level total, not a condition/language offer or confirmed shelf/pickup availability. Product ID, raw source name, raw category, source filename, original public product URL, price and quantity are preserved in `catalog.json` / `catalog.js`. Only 75 products are loaded, not the full exports. No buy prices, private settings or descriptions are included. Category-bucket placeholders were excluded. The small Naruto export was not sampled. The missing Ottawa main singles/Pokémon singles/Flesh & Blood singles exports are not replaced with fictional products.

English/French names are split when the source supplies `//` translations; otherwise the real product name is kept. UI language is distinct from physical-card language. Category display similarly selects the available language instead of combining bilingual labels. Some original names remain French because the export has no English translation.

The official Carta Magica gold dragon logo is used in the header and footer, stored locally as `assets/logo-carta-magica.png`. Homepage game tiles, the hero showcase and product cards use official product packaging photographs saved locally (mostly from the public Carta Magica product pages). Game names are plain HTML typography, not imitation official wordmarks. Photos are packaging images of current or in-stock SKUs; they are not lifestyle illustrations. No existing card illustrations or named franchise character portraits were used. Events are prominently labeled sample ideas with no invented dates, registration, reviews, awards, ratings or customer testimonials.

## Store and policy details

- Montreal: **6360 St-Hubert, Montreal, QC H2S 2M2**, **514-286-9099**. Mon–Fri **10:00–18:00**; Sat–Sun **10:00–17:00**.
- Ottawa: **1179 St-Laurent, Ottawa, ON K1K 3B7**, **613-746-9099**. Mon–Fri **12:00–18:00**; Sat–Sun **12:00–17:00**.
- Ottawa only: free tracked shipping on online orders **over CAD $200 before tax**, **excluding preorders**. Canada Post dispatch **Tuesdays and Fridays**. The existing store policies are linked.
- Montreal shipping rules and pickup readiness have not been invented. Store-approved authenticity/condition guarantee wording is explicitly pending, not presented as an established promise.

Ottawa’s public postal code and About-page hours are intentionally used as instructed. Conflicting admin values and the stale COVID notice are not shown to shoppers. No owner decision is needed to preview those specified values; reconcile the underlying records before production launch.

## Design direction and decisions before production

Official-logo-led black, gold (`#C09030`) and white; generous mobile-first spacing, strong search, readable product cards, distinct Singles/Sealed pathways and location-specific context. The hero and community block use black/gold; game artwork retains its individual cinematic color world. The page set and navigation architecture are unchanged. The responsive layout targets 390px phones and desktop, with a mobile filter disclosure and scrollable category navigation.

Before launch, approve the refreshed styling; supply licensed product/store photography and live event data; approve the authenticity/condition guide and Montreal fulfillment terms; choose whether stores share a legal checkout and inventory authority. The prototype keeps carts separate rather than implying shared stock. Final Shopify integration needs live variant-level data, reservation, stock sync, pickup availability, translated policies and production accessibility testing.

## Files and validation

- `index.html`, `collection.html`, `product.html`, `about.html`: semantic page entry points
- `styles.css`: local responsive visual system
- `app.js`: shared UI, filtering, localization and demo cart
- `catalog.js`: browser-ready curated data
- `catalog.json`, `sample_manifest.json`: readable sample provenance

JavaScript syntax validation passed. DOM-only automated tests passed **2,051 assertions** covering all four pages in both languages and locations, local navigation, filters, search, prices, quantity add/remove, store-separated carts, translation and required contact facts. These tests do **not** constitute a rendered-browser mobile/desktop visual or accessibility audit; that final visual check is still needed. The installed Chrome screenshot CLI hung even on a blank page, so no new screenshots are claimed. No production sites or admin settings were changed.

## Visual refresh additions

Game tile set: Pokémon, Magic: The Gathering, Yu-Gi-Oh!, Lorcana, One Piece, Digimon, Flesh & Blood, Dragon Ball and Union Arena. Bandai-published lines are visibly labeled as such on their game tiles. The exact `game=Lorcana` filter retains a real sealed product at both stores:

- Ottawa `820972`: **Disney Lorcana: Hyperia City Booster Box**, CAD **$199.99**, export quantity **11**; `ottawa_inventory_TCG_Sealed_Product.csv`.
- Montreal `1063859`: **Disney Lorcana: Attack of the Vine! Booster Box**, CAD **$279.99**, export quantity **5**; `montreal_inventory_all_previous.csv`.

Their names, IDs, source URLs, categories, CAD sell prices and quantities were copied from the CSV records, not invented. Both use the existing catalog schema; no variant details were fabricated.

`preview-shots/README.md` documents a screenshot-renderer failure; fresh desktop and 390px screenshots remain outstanding. Old pre-refresh screenshots are deliberately not included. All ten artwork assets and the official logo are included in the ZIP so unzip-and-open remains offline-capable. No page JavaScript makes network calls; existing directions and policy links only leave the site when clicked.

No public tunnel was started for this update. Public hosting is separate from the offline ZIP and local preview.

## Palette comparison and expanded stock

A visible Palette selector sits with the store and EN/FR controls. It changes `data-theme` on the same HTML site and saves the choice in localStorage. Links carry the theme so comparison works across all four pages and when local storage is restricted. The official logo asset is identical in every theme, with no recoloring, filter or replacement.

- **Classic** (`theme=classic`): white surfaces, black ink, logo gold accents and a black/gold hero.
- **Midnight** (`theme=midnight`): near-black page, charcoal product/filter surfaces, white text and stronger gold highlights.
- **Warm Gold** (`theme=warm-gold`): honey/amber gold, warm off-white surfaces, heavier borders and section dividers, warm black hero/footer.
- **Champagne** (`theme=champagne`): pale platinum-gold, cool light greys, restrained thin accents, extra section spacing and a light footer.

Example comparison: `index.html?loc=montreal&theme=midnight&lang=en`. Body, navigation, form fields, cards, dialogs, hero, pathways, community and footer all use per-area theme tokens. Key body/button/hero/footer/link token pairs passed a calculated 4.5:1 minimum text contrast check. Rendered-browser visual QA is still separate.

Catalog increased from **39 to 75**, retaining all 39 existing records and adding 36 in-stock records: four Yu-Gi-Oh!, four Magic sealed, six Dragon Ball and four Union Arena per store. Union Arena had in-stock inventory at both stores. Bandai is a publisher grouping, not a fabricated game or combined stock pool; represented lines include Union Arena, Dragon Ball, One Piece and Digimon.

| Game / category | Montreal | Ottawa |
|---|---:|---:|
| Pokémon | 2 | 2 |
| Magic: The Gathering | 12 | 6 |
| Yu-Gi-Oh! | 6 | 7 |
| Dragon Ball | 6 | 6 |
| Union Arena | 4 | 4 |
| One Piece | 2 | 2 |
| Digimon | 2 | 2 |
| Flesh & Blood | 2 | 1 |
| Lorcana | 1 | 1 |
| Gundam | 0 | 1 |
| Other | 0 | 6 |
| **Total** | **37** | **38** |

The Montreal Magic count includes six pre-existing singles; Ottawa's Yu-Gi-Oh! game count includes a pre-existing accessory. Each store has six sealed Magic and six sealed Yu-Gi-Oh! samples. All added products have positive numeric sell prices and positive export quantities.

Every record has an explicit `store` and compatibility `location` field that agree with its cited CSV source. The same name at two stores remains two IDs with independent prices and quantities. All **75 records** were checked with Python's CSV parser against source IDs, raw names, categories, public URLs, sell prices and quantities; every field of the pre-existing 39 records was preserved. `sample_manifest.json` includes record-level provenance and store/game counts. `catalog_additions.csv` lists all 36 new samples.

Expanded DOM tests cover store switching (37 Montreal vs 38 Ottawa), selected-store prices/quantities, separate carts, EN/FR, all four distinct computed token palettes and persistence, exact Dragon Ball/Union Arena game filters, and hiding other-store price/stock on a mismatched direct product URL. The ZIP intentionally excludes `preview-shots/`.

Each store homepage now features a real sealed sample from Pokémon, Magic, Yu-Gi-Oh!, Dragon Ball, Union Arena, One Piece, Digimon and Lorcana, using only that selected store’s records.
