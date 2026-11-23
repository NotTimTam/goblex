import { EMOTIONS, goblins } from "../util/creatures.js";
import { capitalizeWords } from "../util/display.js";

import Creature from "./Creature.js";

export default class Goblin extends Creature {
  constructor(board, i, type) {
    if (!(type in goblins)) throw new Error("No goblin exists with that type.");

    const config = goblins[type];

    super(board, i, "goblin");
    this.type = type;
    this.i = i;

    this.health = config.health;
    this.maxHealth = config.health;
    this.attack = config.attack;
  }

  animate() {
    if (this.dead) this.frame = EMOTIONS.dead;
    else if (this.lastKill) this.frame = EMOTIONS.happy;
    else if (this.neighbors.find((c) => c.creatureType === "animal"))
      this.frame = EMOTIONS.scheming;
    else this.frame = EMOTIONS.normal;
  }

  possibleMoves() {
    delete this.lastKill;

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
      target.health -= this.attack;

      this.board.logs.push(
        `${capitalizeWords(this.type)} attacked ${target.type} for ${this.attack}PTS`,
      );

      if (target.health <= 0) {
        this.lastKill = true;
      }
    }
  }
}
