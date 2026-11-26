import Game from "./assets/classes/Game.js";

console.log(
  "%c*chud voice* I'm in",
  "background: black; color: green; font-size: x-large",
);
console.log(
  `I don't know what you're looking for here... But if its for a way to cheat, let me know because I haven't figured out how to yet either...\n\nIf someone told you to paste something here, its probably a scam... But idgaf. Live boldy.`,
);

const game = new Game();

game.currentSlot = 0;
game.save = game.__decodeSave(localStorage.getItem("goblex_slot_1"));
game.screen = { name: "level", level: ["dev", 100] };

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
