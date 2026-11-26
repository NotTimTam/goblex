import { EMOTIONS, goblins } from "../util/creatures.js";
import { capitalizeWords } from "../util/display.js";
import findPath from "../util/pathfinding.js";

import Creature from "./Creature.js";

export default class Goblin extends Creature {
  constructor(board, i, type) {
    if (!(type in goblins))
      throw new Error(`No goblins exists with type "${type}"`);

    const config = goblins[type];

    super(board, i, "goblin", type);

    this.health = config.health;
    this.maxHealth = config.health;
    this.attack = config.attack;
  }

  animate() {
    const FEAR_THRESHHOLD = 2;

    const neighbors = this.neighbors.filter((c) => !c.dead);
    const animals = neighbors.filter((c) => c.creatureType === "animal").length;
    const allies = neighbors.filter((c) => c.creatureType === "goblin").length;

    const scared = animals - allies >= FEAR_THRESHHOLD;

    if (this.dead) this.frame = EMOTIONS.dead;
    else if (this.lastKill) this.frame = EMOTIONS.happy;
    else if (animals) {
      this.frame = scared ? EMOTIONS.scared : EMOTIONS.scheming;
    } else this.frame = EMOTIONS.normal;
  }

  possibleMoves() {
    /*
    Goblin AI breakdown:
    - A goblin that has the ability to attack on the board always attacks first.
    - A goblin who does not have the ability to attack, but does have another
    behavior 'ability' will default to that.
    - Otherwise, a goblin will do nothing.
     */

    delete this.lastKill;

    const possibleMoves = [];

    const edibles = this.neighbors
      .filter((n) => n.creatureType === "animal" && !n.dead)
      .sort(
        (a, b) =>
          this.board.distance(this.i, a.i) - this.board.distance(this.i, b.i),
      );

    if (edibles.length)
      possibleMoves.push({
        goblin: this,
        move: "attack",
        target: edibles[0],
      });

    const abilities = goblins[this.type].abilities;

    if (abilities)
      abilities.forEach((ability) => {
        switch (ability) {
          case "chase":
            const targets = this.board.animals
              .filter((a) => !a.dead)
              .sort(
                (a, b) =>
                  this.board.distance(this.i, a.i) -
                  this.board.distance(this.i, b.i),
              );

            if (
              !targets.length ||
              this.board.distance(this.i, targets[0].i) <= 1
            )
              return;

            const path = findPath(
              this.board.toXY(this.i),
              this.board.toXY(targets[0].i),
              [
                ...this.board.creatures
                  .filter((c) => c !== this && c !== targets[0])
                  .map((c) => this.board.toXY(c.i)),
                ...this.board.exits.map((i) => this.board.toXY(i)),
                ...this.board.walls.map((i) => this.board.toXY(i)),
              ],
              this.board.boardWidth,
              Math.floor(this.board.level.length / this.board.boardWidth),
            );

            if (path)
              possibleMoves.push({
                goblin: this,
                move: "chase",
                target: this.board.toIndex(...path[0]),
              });

            break;
          default:
            break;
        }
      });

    return possibleMoves;
  }

  move({ move, target }) {
    if (move === "attack") {
      target.health -= this.attack;

      this.board.logs.push(
        `${capitalizeWords(this.type)} attacked ${target.type} for ${this.attack}HP`,
      );

      if (target.health <= 0) {
        this.lastKill = true;
      }
    } else if (move === "chase") {
      console.log(this.board.level);

      this.i = target;
      this.board.logs.push(
        `${capitalizeWords(this.type)} moves towards a ${target.type}`,
      );
    }
  }
}
