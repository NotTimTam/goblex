import { EMOTIONS, goblins } from "../util/creatures.js";
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

    console.log(this.neighbors);

    return possibleMoves;
  }
}
