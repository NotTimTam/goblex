import Board from "./assets/classes/Board.js";
import { levels } from "./assets/util/levels.js";

const board = new Board({
  // delayGoblinTurn: false,
  level: levels.base[0],
});

// const fight = new Fight(
//   board,
//   [
//     new Animal(board, 0, "duck"),
//     new Animal(board, 0, "penguin"),
//     new Animal(board, 0, "cow"),
//     new Animal(board, 0, "giraffe"),
//     new Animal(board, 0, "frog"),
//     new Animal(board, 0, "dog"),
//   ],
//   [
//     new Goblin(board, 0, "grunt"),
//     new Goblin(board, 0, "assassin"),
//     new Goblin(board, 0, "grunt"),
//     new Goblin(board, 0, "grunt"),
//     (() => {
//       const gob = new Goblin(board, 0, "grunt");

//       gob.health = gob.health / 2;

//       return gob;
//     })(),
//     new Goblin(board, 0, "grunt"),
//   ],
// );
// fight.start();
