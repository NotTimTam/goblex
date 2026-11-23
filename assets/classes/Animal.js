import { animals, EMOTIONS } from "../util/creatures.js";
import Creature from "./Creature.js";

export default class Animal extends Creature {
  constructor(board, i, type) {
    if (!(type in animals))
      throw new Error("No animals exists with that type.");

    super(board, i, "animal");
    this.type = type;
    this.i = i;
  }

  animate() {
    if (this.neighbors.find((c) => c.creatureType === "goblin"))
      this.frame = EMOTIONS.scared;
    else this.frame = EMOTIONS.normal;
  }
}
