import { EMOTIONS, goblins } from "../util/creatures.js";
import Creature from "./Creature.js";

export default class Goblin extends Creature {
  constructor(i, type) {
    if (!(type in goblins)) throw new Error("No goblin exists with that type.");

    super(i, "goblin");
    this.type = type;
    this.i = i;
  }

  animate(neighbors) {
    if (neighbors.find((c) => c.creatureType === "animal"))
      this.frame = EMOTIONS.scheming;
  }
}
