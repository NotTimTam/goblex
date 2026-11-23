import Board from "./assets/classes/Board.js";
import { createNoise2D } from "./assets/util/simplex-noise.js";
import alea from "./assets/util/alea.js";
import { levels } from "./assets/util/levels.js";

const noise = createNoise2D(alea(Date.now()));

const board = new Board({
  noise,
  // delayGoblinTurn: false,
  level: levels.base[1],
});
