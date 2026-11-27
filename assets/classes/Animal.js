import { animals, EMOTIONS } from "../util/creatures.js";
import Creature from "./Creature.js";

export default class Animal extends Creature {
  constructor(board, i, type) {
    if (!(type in animals))
      throw new Error(`No animals exists with type "${type}"`);

    super(board, i, "animal", type);

    this.health = this.config.health;
    this.maxHealth = this.config.health;
    this.attack = this.config.attack;
  }

  get config() {
    return animals[this.type];
  }

  getPossibleMoves() {
    const { movement } = this.config;

    const moves = [
      { dir: [0, -1], config: movement["u"] },
      { dir: [0, 1], config: movement["d"] },
      { dir: [-1, 0], config: movement["l"] },
      { dir: [1, 0], config: movement["r"] },
      { dir: [-1, -1], config: movement["ul"] },
      { dir: [1, -1], config: movement["ur"] },
      { dir: [-1, 1], config: movement["dl"] },
      { dir: [1, 1], config: movement["dr"] },
    ];

    const possibleMoves = [];
    const [curX, curY] = this.board.toXY(this.i);

    // const dt = this.distance(lastClick.i, i, "chebyshev");
    // if (this.walls.includes(i)) {
    //   this.logs.push("This is a wall...");
    //   return lastClick.element.focus();
    // }

    for (const {
      dir: [xDir, yDir],
      config,
    } of moves) {
      const maxX = xDir < 0 ? curX : xDir > 0 ? this.board.width - 1 - curX : 0;
      const maxY =
        yDir < 0 ? curY : yDir > 0 ? this.board.height - 1 - curY : 0;

      const maxDistance = Math.max(maxX, maxY);

      for (let distance = 1; distance <= maxDistance; distance++) {
        const x = curX + xDir * distance;
        const y = curY + yDir * distance;

        // Stop when this direction reaches the edge of the board
        if (
          x < 0 ||
          x > this.board.width - 1 ||
          y < 0 ||
          y > this.board.height - 1
        )
          break;

        const i = this.board.toIndex(x, y);

        possibleMoves.push(i);
      }
    }

    return possibleMoves;
  }

  exit() {
    if (!this.board.exits.includes(this.i)) return;

    this.board.creatures = this.board.creatures.filter((c) => c !== this);
    this.clear();

    this.board.escapes++;
    this.board.points += this.health;

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
