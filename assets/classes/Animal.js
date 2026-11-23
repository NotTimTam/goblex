import { animals, EMOTIONS } from "../util/creatures.js";
import Creature from "./Creature.js";

export default class Animal extends Creature {
  constructor(board, i, type) {
    if (!(type in animals))
      throw new Error("No animals exists with that type.");

    const config = animals[type];

    super(board, i, "animal");
    this.type = type;
    this.i = i;

    this.health = config.health;
    this.maxHealth = config.health;
  }

  animate() {
    if (this.dead) this.frame = EMOTIONS.dead;
    else if (this.neighbors.find((c) => c.creatureType === "goblin"))
      this.frame = EMOTIONS.scared;
    else this.frame = EMOTIONS.normal;
  }
}
