/* TCG singles loaded on demand from Crystal Commerce export snapshots.
   Same-origin JSON only — no live Crystal Commerce or admin requests.
   Montreal: every singles category with stock (8 Nov 2026). Ottawa: every game with stock (8–10 Nov 2026). */
(function (root) {
  'use strict';
  var caches = {
    montreal: { manifest: null, games: {}, byId: new Map() },
    ottawa: { manifest: null, games: {}, byId: new Map() }
  };

  function storeKey(store) {
    return store === 'ottawa' ? 'ottawa' : 'montreal';
  }

  function manifestUrl(store) {
    return storeKey(store) === 'ottawa'
      ? 'data/ottawa-singles-manifest.json'
      : 'data/singles-manifest.json';
  }

  var V = '20261110e';
  function sourceMeta(store, meta) {
    if (storeKey(store) === 'ottawa') {
      var rep = meta && meta.sourceReport ? String(meta.sourceReport) : '';
      return {
        source: 'crystal-commerce-ottawa-stock' + (rep ? ' (' + rep + ')' : ''),
        sourceName: 'Carta Magica Ottawa store stock' + (meta && meta.stockDate ? ', ' + meta.stockDate : ''),
        prefix: 'ottawa-'
      };
    }
    return {
      source: 'crystal-commerce-montreal-export-2026-11-08',
      sourceName: 'Carta Magica Montreal inventory export, 8 November 2026',
      prefix: 'montreal-'
    };
  }

  function inflate(raw, meta, store) {
    var name = raw.n || '';
    var nameFr = raw.nf || name;
    var sk = storeKey(store);
    var src = sourceMeta(sk, meta);
    var id = src.prefix + raw.i;
    var p = {
      id: id,
      sourceId: String(raw.i),
      source: src.source,
      sourceName: src.sourceName,
      name: name,
      nameFr: nameFr,
      category: raw.c || '',
      price: Number(raw.p) || 0,
      stock: Number(raw.s) || 0,
      location: sk,
      kind: 'singles',
      game: meta.game,
      condition: '',
      language: '',
      originalUrl: '',
      store: sk,
      sg: meta.slug
    };
    if (raw.u) p.image = raw.u;
    caches[sk].byId.set(id, p);
    return p;
  }

  function loadManifest(store) {
    var sk = storeKey(store);
    var cache = caches[sk];
    if (cache.manifest) return Promise.resolve(cache.manifest);
    return fetch(manifestUrl(sk) + '?v=' + V).then(function (res) {
      if (!res.ok) throw new Error('singles manifest ' + sk + ' ' + res.status);
      return res.json();
    }).then(function (data) {
      cache.manifest = data;
      return data;
    });
  }

  function loadGame(slug, store) {
    var sk = storeKey(store);
    var cache = caches[sk];
    var key = slug;
    if (cache.games[key]) return Promise.resolve(cache.games[key]);
    return loadManifest(sk).then(function (manifest) {
      var meta = (manifest.games || []).find(function (g) { return g.slug === slug; });
      if (!meta) return [];
      return fetch(meta.file + '?v=' + V).then(function (res) {
        if (!res.ok) throw new Error('singles ' + sk + ' ' + slug + ' ' + res.status);
        return res.json();
      }).then(function (raw) {
        var items = raw.map(function (r) { return inflate(r, meta, sk); });
        cache.games[key] = items;
        return items;
      });
    });
  }

  function loadAllGames(store) {
    var sk = storeKey(store);
    return loadManifest(sk).then(function (manifest) {
      return Promise.all((manifest.games || []).map(function (g) { return loadGame(g.slug, sk); }));
    }).then(function (lists) {
      return lists.reduce(function (acc, list) { return acc.concat(list); }, []);
    });
  }

  function peek(id) {
    return caches.montreal.byId.get(id) || caches.ottawa.byId.get(id) || null;
  }

  function storeFromId(id) {
    if (id && String(id).indexOf('ottawa-') === 0) return 'ottawa';
    return 'montreal';
  }

  function findById(id, slugHint) {
    var hit = peek(id);
    if (hit) return Promise.resolve(hit);
    var sk = storeFromId(id);
    var next = slugHint ? loadGame(slugHint, sk) : loadAllGames(sk);
    return next.then(function () { return peek(id); });
  }

  function related(p, n) {
    var sk = storeKey(p && p.store);
    var list = (p && p.sg && caches[sk].games[p.sg]) || [];
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
    related: related,
    storeKey: storeKey
  };
})(window);
