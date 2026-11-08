/* Montreal TCG singles loaded on demand from the 8 November 2026 export.
   Same-origin JSON only — no live Crystal Commerce or admin requests. */
(function (root) {
  'use strict';
  var cache = { manifest: null, games: {}, byId: new Map() };

  function inflate(raw, meta) {
    var name = raw.n || '';
    var nameFr = raw.nf || name;
    var id = 'montreal-' + raw.i;
    var p = {
      id: id,
      sourceId: String(raw.i),
      source: 'crystal-commerce-montreal-export-2026-11-08',
      sourceName: 'Carta Magica Montreal inventory export, 8 November 2026',
      name: name,
      nameFr: nameFr,
      category: raw.c || '',
      price: Number(raw.p) || 0,
      stock: Number(raw.s) || 0,
      location: 'montreal',
      kind: 'singles',
      game: meta.game,
      condition: '',
      language: '',
      originalUrl: '',
      store: 'montreal',
      sg: meta.slug
    };
    if (raw.u) p.image = raw.u;
    cache.byId.set(id, p);
    return p;
  }

  function loadManifest() {
    if (cache.manifest) return Promise.resolve(cache.manifest);
    return fetch('data/singles-manifest.json').then(function (res) {
      if (!res.ok) throw new Error('singles manifest ' + res.status);
      return res.json();
    }).then(function (data) {
      cache.manifest = data;
      return data;
    });
  }

  function loadGame(slug) {
    if (cache.games[slug]) return Promise.resolve(cache.games[slug]);
    return loadManifest().then(function (manifest) {
      var meta = (manifest.games || []).find(function (g) { return g.slug === slug; });
      if (!meta) return [];
      return fetch(meta.file).then(function (res) {
        if (!res.ok) throw new Error('singles ' + slug + ' ' + res.status);
        return res.json();
      }).then(function (raw) {
        var items = raw.map(function (r) { return inflate(r, meta); });
        cache.games[slug] = items;
        return items;
      });
    });
  }

  function loadAllGames() {
    return loadManifest().then(function (manifest) {
      return Promise.all((manifest.games || []).map(function (g) { return loadGame(g.slug); }));
    }).then(function (lists) {
      return lists.reduce(function (acc, list) { return acc.concat(list); }, []);
    });
  }

  function peek(id) {
    return cache.byId.get(id) || null;
  }

  function findById(id, slugHint) {
    var hit = peek(id);
    if (hit) return Promise.resolve(hit);
    var next = slugHint ? loadGame(slugHint) : loadAllGames();
    return next.then(function () { return peek(id); });
  }

  function related(p, n) {
    var list = (p && p.sg && cache.games[p.sg]) || [];
    var same = list.filter(function (x) { return x.id !== p.id && x.category === p.category; });
    var rest = list.filter(function (x) { return x.id !== p.id && x.category !== p.category; });
    return same.concat(rest).slice(0, n || 4);
  }

  root.CartaSingles = {
    loadManifest: loadManifest,
    loadGame: loadGame,
    loadAllGames: loadAllGames,
    peek: peek,
    findById: findById,
    related: related
  };
})(window);
