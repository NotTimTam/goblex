import { animals } from "../util/creatures.js";
import Creature from "./Creature.js";

export default class Animal extends Creature {
  constructor(i, type) {
    if (!(type in animals))
      throw new Error("No animals exists with that type.");

    super(i, "animal");
    this.type = type;
  }
}
