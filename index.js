import Board from "./assets/classes/Board.js";
import { createNoise2D } from "./assets/util/simplex-noise.js";
import alea from "./assets/util/alea.js";

const noise = createNoise2D(alea(Date.now()));

const board = new Board({
  noise,
  delayGoblinTurn: false,
  level: {
    width: 3,
    tiles: [
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      "grunt",
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      "frog",
      0,
      0,
      0,
      0,
    ],
  },
});
