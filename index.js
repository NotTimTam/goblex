import Board from "./assets/classes/Board.js";
import { createNoise2D } from "./assets/util/simplex-noise.js";
import alea from "./assets/util/alea.js";
import { levels } from "./assets/util/levels.js";
import Fight from "./assets/classes/Fight.js";
import Animal from "./assets/classes/Animal.js";
import Goblin from "./assets/classes/Goblin.js";

const noise = createNoise2D(alea(Date.now()));

const board = new Board({
  noise,
  // delayGoblinTurn: false,
  level: levels.base[1],
});

const fight = new Fight(
  board,
  [
    new Animal(board, 0, "duck"),
    new Animal(board, 0, "penguin"),
    new Animal(board, 0, "giraffe"),
    new Animal(board, 0, "giraffe"),
    new Animal(board, 0, "giraffe"),
    new Animal(board, 0, "giraffe"),
    (() => {
      const gob = new Animal(board, 0, "giraffe");

      gob.health = gob.health / 2;

      return gob;
    })(),
    new Animal(board, 0, "giraffe"),
  ],
  [
    new Goblin(board, 0, "grunt"),
    new Goblin(board, 0, "grunt"),
    new Goblin(board, 0, "grunt"),
    new Goblin(board, 0, "grunt"),
    (() => {
      const gob = new Goblin(board, 0, "grunt");

      gob.health = gob.health / 2;

      return gob;
    })(),
    new Goblin(board, 0, "grunt"),
  ],
);
fight.start();
