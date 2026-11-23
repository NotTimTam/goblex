import { EMOTIONS } from "../util/creatures.js";
import Animal from "./Animal.js";
import Goblin from "./Goblin.js";
import {
  animals as animalTypes,
  goblins as goblinTypes,
} from "../util/creatures.js";
import Logs from "./Logs.js";

export default class Board {
  /**
   * @param {*} config
   * @param {number} config.nTiles
   * @param {NoiseFunction2D} config.noise
   */
  constructor(config) {
    const { level, noise } = config;

    this.size = level.length;
    this.noise = noise;
    this.level = level;

    this.board = document.querySelector("main.board");
    this.boardWidth = Math.ceil(Math.sqrt(this.size));

    this.creatures = [];

    this.logs = new Logs();

    this.buildBoard();

    this.logs.push("Move all animals to the exit.");
  }

  toIndex = (x, y) => y * this.boardWidth + x;
  toXY = (i) => [i % this.boardWidth, Math.floor(i / this.boardWidth)];

  getTile(i, y) {
    if (y) i = this.toIndex(i, y);

    return document.querySelector(`main.board button.tile:nth-child(${i + 1})`);
  }

  getCreature(i, y) {
    if (y) i = this.toIndex(i, y);

    return this.creatures.find((x) => x.i === i);
  }

  goblin(i, type) {
    const creature = new Goblin(i, type);

    this.creatures.push(creature);

    if (i === 0) console.log(creature.element);

    return creature;
  }

  animal(i, type) {
    const creature = new Animal(i, type);

    this.creatures.push(creature);

    return creature;
  }

  click(i) {
    const creature = this.getCreature(i);

    if (!creature) return;

    console.log(
      "Clicked",
      Object.keys(EMOTIONS)[creature.frame],
      creature.creatureType,
      creature.type,
      "at",
      i,
    );
  }

  buildBoard() {
    const { level, size, noise } = this;

    // Create elements.
    this.board.style.gridTemplateColumns = "1fr "
      .repeat(this.boardWidth)
      .trim();
    this.board.innerHTML = null;

    for (let i = 0; i < size; i++) {
      const button = document.createElement("button");
      button.className = "tile";
      button.onclick = () => this.click(i);

      this.board.appendChild(button);
    }

    // Build level items.
    level.forEach((n, i) => {
      if (n === 1) {
        const tile = this.getTile(i);

        tile.classList.toggle("exit", true);
      } else if (typeof n === "string") {
        (Object.keys(animalTypes).includes(n) ? this.animal : this.goblin).bind(
          this,
        )(i, n);
      }
    });

    // // Place exits
    // this.exits = this.place({
    //   count: Math.min(level.exits ?? 1, size),
    //   threshold: 0.8,
    //   spread: 1,
    // });

    // for (const exit of this.exits) {
    //   const tile = this.getTile(exit);

    //   tile.classList.toggle("exit", true);
    // }

    // // Place animals
    // const animals = this.place({
    //   count: level.animals ?? 0,
    //   exclude: this.exits,
    //   near: [{ tiles: this.exits, weight: -1 }],
    //   spread: 0.5,
    // });

    // const aTs = Object.keys(animalTypes);

    // // Place goblins
    // const goblins = this.place({
    //   count: level.goblins ?? 0,
    //   exclude: [...this.exits, ...animals],
    //   near: [
    //     { tiles: this.exits, weight: 0.75 },
    //     { tiles: animals, weight: 0.8 },
    //   ],
    //   spread: -0.2,
    //   adjacent: "allow",
    // });

    // const gTs = Object.keys(goblinTypes);
    // for (const goblin of goblins) {
    //   const n = noise(...this.toXY(goblin));

    //   const type = gTs[Math.abs(Math.floor(n * gTs.length))];

    //   this.goblin(goblin, type);
    // }
  }
}
