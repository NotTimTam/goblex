/**
 * Shortest path on a grid with 8-directional movement (BFS).
 * Every step, including diagonals, costs 1 move.
 *
 * @param {[number,number]} from  Start (not included in result)
 * @param {[number,number]} to    Target (not included in result)
 * @param {Array<[number,number]>} obstacles          Blocked tiles, as [x,y]
 * @param {number} width Board width
 * @param {number} height Board height
 * @param {{allowCornerCutting?: boolean}} [options]
 * @returns {Array<[number,number]>|null}
 *   Ordered moves ending on a tile adjacent to `to`.
 *   [] if already adjacent, null if no path exists.
 */
export default function findPath(
  from,
  to,
  obstacles,
  width,
  height,
  options = {},
) {
  const { allowCornerCutting = false } = options;

  const toXY = (p) => ({ x: p[0], y: p[1] });
  const start = toXY(from);
  const target = toXY(to);

  const inBounds = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
  const key = (x, y) => y * width + x;

  if (!inBounds(start.x, start.y) || !inBounds(target.x, target.y)) return null;
  if (start.x === target.x && start.y === target.y) return null;

  // Obstacles and the target tile are all untraversable
  const blocked = new Set();
  for (const o of obstacles) {
    const { x, y } = toXY(o);
    if (inBounds(x, y)) blocked.add(key(x, y));
  }
  blocked.add(key(target.x, target.y));

  if (
    blocked.has(key(start.x, start.y)) &&
    !(start.x === target.x && start.y === target.y)
  )
    return null;

  const isGoal = (x, y) =>
    Math.max(Math.abs(x - target.x), Math.abs(y - target.y)) === 1;

  if (isGoal(start.x, start.y)) return [];

  const dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
  ];

  const startKey = key(start.x, start.y);
  const prev = new Map([[startKey, -1]]);
  const queue = [startKey];
  let head = 0; // index pointer avoids O(n) shift()

  while (head < queue.length) {
    const curKey = queue[head++];
    const cx = curKey % width;
    const cy = (curKey - cx) / width;

    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inBounds(nx, ny)) continue;

      const nKey = key(nx, ny);
      if (prev.has(nKey) || blocked.has(nKey)) continue;

      // Optionally forbid squeezing between two touching walls
      if (!allowCornerCutting && dx !== 0 && dy !== 0) {
        if (blocked.has(key(cx + dx, cy)) || blocked.has(key(cx, cy + dy)))
          continue;
      }

      prev.set(nKey, curKey);

      if (isGoal(nx, ny)) {
        // Reconstruct path, excluding start
        const path = [];
        let k = nKey;
        while (k !== startKey) {
          const x = k % width;
          path.push([x, (k - x) / width]);
          k = prev.get(k);
        }
        return path.reverse();
      }

      queue.push(nKey);
    }
  }

  return null; // unreachable
}
