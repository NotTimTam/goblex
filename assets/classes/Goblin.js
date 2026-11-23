import { EMOTIONS, goblins } from "../util/creatures.js";
import { capitalizeWords } from "../util/display.js";

import Creature from "./Creature.js";

export default class Goblin extends Creature {
  constructor(board, i, type) {
    if (!(type in goblins)) throw new Error("No goblin exists with that type.");

    super(board, i, "goblin");
    this.type = type;
    this.i = i;
  }

  animate() {
    if (this.neighbors.find((c) => c.creatureType === "animal"))
      this.frame = EMOTIONS.scheming;
    else this.frame = EMOTIONS.normal;
  }

  possibleMoves() {
    const possibleMoves = [];

    const edibles = this.neighbors
      .filter((n) => n.creatureType === "animal")
      .sort(
        (a, b) =>
          this.board.distance(this.i, a.i) - this.board.distance(this.i, b.i),
      );

    if (edibles.length)
      possibleMoves.push({
        goblin: this,
        move: "attack",
        target: edibles[0],
        value: 100,
      });

    return possibleMoves;
  }

  move({ move, target }) {
    if (move === "attack") {
      target.health -= 5;
      this.board.logs.push(
        `${capitalizeWords(this.type)} attacked ${target.type} for ${5}pts`,
      );
    }
  }
}
