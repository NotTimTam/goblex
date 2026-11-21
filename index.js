import Board from "./assets/classes/Board.js";
import { goblins } from "./assets/util/creatures.js";
import { createNoise2D } from "./assets/util/simplex-noise.js";

const noise = createNoise2D();
const SCALE = 2;
const BOARD_SIZE = 49;

const board = new Board(BOARD_SIZE);

for (let i = 0; i < BOARD_SIZE; i++) {
  const [x, y] = board.toXY(i);
  const n = noise(x * SCALE, y * SCALE);

  if (n > 0.25) {
    const goblin = board.goblin(
      i,
      Object.keys(goblins)[
        Math.floor(Math.random() * Object.keys(goblins).length)
      ],
    );
    goblin.frame = Math.floor(Math.random() * 3);
  }
}
