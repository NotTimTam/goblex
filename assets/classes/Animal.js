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
    this.attack = config.attack;
  }

  exit() {
    if (!this.board.exits.includes(this.i)) return;

    this.board.creatures = this.board.creatures.filter((c) => c !== this);
    this.clear();

    this.board.escapes++;

    this.board.logs.push(`Your ${this.type} made it to an exit!`);
  }

  animate() {
    const FEAR_THRESHHOLD = 1;

    const goblinNeighbors = this.neighbors.filter(
      (c) => c.creatureType === "goblin" && !c.dead,
    );

    const scared = goblinNeighbors.some((goblin) => {
      const othersAroundGoblin = goblin.neighbors.filter(
        (c) => c !== this && !c.dead,
      );

      const animalCount =
        FEAR_THRESHHOLD +
        othersAroundGoblin.filter((c) => c.creatureType === "animal").length;
      const goblinCount =
        FEAR_THRESHHOLD +
        othersAroundGoblin.filter((c) => c.creatureType === "goblin").length;

      return goblinCount >= animalCount;
    });

    if (this.dead) this.frame = EMOTIONS.dead;
    else if (goblinNeighbors.length)
      this.frame = scared ? EMOTIONS.scared : EMOTIONS.happy;
    else this.frame = EMOTIONS.normal;
  }
}
