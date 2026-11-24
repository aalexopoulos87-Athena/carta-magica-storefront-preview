# Carta Magica storefront preview — changelog

## 24 Nov 2026, Europe/Athens (UTC+2) — French / bilingual titles (cache 20261124a)

Backup first: `/workspace/carta-magica-site-backups/cm-art-2026-11-24-pre-ygo-fr-title.tgz` (app.js, singles.js, styles.css, HTML). Official logo md5 `35a8175fd256e92c814222bf937fb623` is unchanged.

**Bug:** In French mode, Yu-Gi-Oh! singles whose Crystal Commerce title is `card name // set or tin` showed only the right-hand side (e.g. “2005 Collectors Tins”) as the product title. That came from `nameFr` (`nf`) being filled with the set/tin, and `const name=p=>lang==='fr'?p.nameFr:p.name` in `app.js`.

**Fix:**
- `app.js` now parses ` // ` titles: if the right side is a set/tin (equals the category, or a collectors/anniversary tin), the title is the card name (left side, or an official French name when we have one) and the set/tin is a secondary line (`.product-set`). Pokémon `FR // EN` still shows French in FR mode and English in EN mode. Magic: The Gathering double-faced `Front // Back` names are kept together (they are not bilingual splits).
- Official French card titles from `/workspace/carta-magica-site-reports/fr-product-names-2026-11-24/` (YGOPRODeck, TCGdex, Scryfall; high/medium confidence) were written into `nf` on Montreal and Ottawa Yu-Gi-Oh!, Pokémon and Magic singles where they differ from the English title. Where `nf` had been the set/tin, it is now the card name.
- `styles.css`: `.product-set` secondary line. Cache query string bumped to `20261124a`.

Nothing on cartamagica.com was changed.
