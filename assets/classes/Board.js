import { EMOTIONS } from "../util/creatures.js";
import Animal from "./Animal.js";
import Goblin from "./Goblin.js";

export default class Board {
  constructor(nTiles = 36) {
    this.board = document.querySelector("main.board");
    this.boardWidth = Math.ceil(Math.sqrt(nTiles));

    this.creatures = [];

    this.board.style.gridTemplateColumns = "1fr "
      .repeat(this.boardWidth)
      .trim();
    this.board.innerHTML = null;

    for (let i = 0; i < nTiles; i++) {
      const button = document.createElement("button");
      button.className = "tile";
      button.onclick = () => this.click(i);

      this.board.appendChild(button);
    }
  }

  toIndex = (x, y) => y * this.boardWidth + x;
  toXY = (i) => [i % this.boardWidth, Math.floor(i / this.boardWidth)];

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
}
