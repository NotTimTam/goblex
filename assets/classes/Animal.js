import { animals, EMOTIONS } from "../util/creatures.js";
import Creature from "./Creature.js";

export default class Animal extends Creature {
  constructor(i, type) {
    if (!(type in animals))
      throw new Error("No animals exists with that type.");

    super(i, "animal");
    this.type = type;
    this.i = i;
  }

  animate(neighbors) {
    if (neighbors.find((c) => c.creatureType === "goblin"))
      this.frame = EMOTIONS.scared;
  }
}
