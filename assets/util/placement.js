/**
 * Pick `count` distinct tiles on a square grid.
 *
 * Each tile gets a score and the best one is picked greedily. The score is
 * the sum of:
 *  - noise value * noiseWeight
 *  - for each `near` group: -weight * (distance to the nearest tile in it)
 *      weight > 0 pulls toward those tiles, weight < 0 pushes away
 *  - spread * (distance to the nearest tile already picked in this call)
 *      spread > 0 pushes picks apart, spread < 0 clumps them
 *  - random jitter
 *
 * @param {object} o
 * @param {number} o.width            Board width in tiles
 * @param {number} [o.size]           Total tiles (default width * width)
 * @param {number} o.count            How many tiles to pick
 * @param {Iterable<number>} [o.exclude]  Tile indices that can never be picked
 * @param {Function} [o.noise]        2D noise function
 * @param {number} [o.scale=2]        Noise sampling scale
 * @param {number} [o.noiseWeight=1]
 * @param {number|null} [o.threshold] If set, tiles with noise > threshold are
 *                                    exhausted before any other tile is used
 * @param {{tiles:number[], weight?:number}[]} [o.near]
 * @param {number} [o.spread=0]
 * @param {"avoid"|"allow"|"never"} [o.adjacent="avoid"]
 *     avoid: no touching picks (incl. diagonals) unless it's the only option
 *     never: touching picks are never allowed
 *     allow: touching is fine
 * @param {number} [o.jitter=0]       Random score added per tile (0 = deterministic)
 * @param {() => number} [o.random=Math.random]
 * @returns {number[]} picked tile indices (may be fewer than `count`)
 */
export function placeTiles({
  width,
  size = width * width,
  count,
  exclude = [],
  noise = null,
  scale = 2,
  noiseWeight = 1,
  threshold = null,
  near = [],
  spread = 0,
  adjacent = "avoid",
  jitter = 0,
  random = Math.random,
}) {
  const toXY = (i) => [i % width, Math.floor(i / width)];
  const blocked = new Set(exclude);

  // Pre-compute everything that doesn't depend on what's been picked.
  const cells = [];
  for (let i = 0; i < size; i++) {
    if (blocked.has(i)) continue;

    const [x, y] = toXY(i);
    const n = noise ? noise(x * scale, y * scale) : 0;

    let base = n * noiseWeight;
    for (const { tiles, weight = 1 } of near) {
      if (!tiles.length) continue;
      const d = Math.min(
        ...tiles.map((t) => {
          const [tx, ty] = toXY(t);
          return Math.hypot(tx - x, ty - y);
        }),
      );
      base -= weight * d;
    }
    if (jitter) base += jitter * random();

    cells.push({ i, x, y, n, base });
  }

  const picked = [];

  const touchesPicked = (c) =>
    picked.some((p) => Math.max(Math.abs(p.x - c.x), Math.abs(p.y - c.y)) <= 1);

  const score = (c) =>
    spread && picked.length
      ? c.base +
        spread *
          Math.min(...picked.map((p) => Math.hypot(p.x - c.x, p.y - c.y)))
      : c.base;

  const pickFrom = (pool, allowAdjacent) => {
    while (picked.length < count) {
      let best = -1;
      let bestScore = -Infinity;

      pool.forEach((c, idx) => {
        if (!allowAdjacent && touchesPicked(c)) return;
        const s = score(c);
        if (s > bestScore) {
          bestScore = s;
          best = idx;
        }
      });

      if (best === -1) return; // nothing eligible left in this pool
      picked.push(pool.splice(best, 1)[0]);
    }
  };

  const tiers =
    threshold == null
      ? [cells]
      : [
          cells.filter((c) => c.n > threshold),
          cells.filter((c) => c.n <= threshold),
        ];

  const passes =
    adjacent === "allow"
      ? [true]
      : adjacent === "never"
        ? [false]
        : [false, true];

  for (const allowAdjacent of passes) {
    for (const tier of tiers) pickFrom(tier, allowAdjacent);
  }

  return picked.map((c) => c.i);
}
