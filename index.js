import Board from "./assets/classes/Board.js";
import { createNoise2D } from "./assets/util/simplex-noise.js";
import alea from "./assets/util/alea.js";

const noise = createNoise2D(alea(Date.now()));

const board = new Board({
  noise,
  level: {
    exits: 1,
    animals: 3,
    goblins: 4,
  },
});
