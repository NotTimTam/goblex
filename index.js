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
game.save = JSON.parse(localStorage.getItem("goblex_slot_1"));
game.screen = { name: "level", level: ["dev", 102] };
