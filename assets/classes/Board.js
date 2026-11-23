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
   * @param {*} config.level
   * @param {Array<number>} config.level.tiles
   * @param {number} config.level.width
   * @param {NoiseFunction2D} config.noise
   * @param {boolean} config.delayGoblinTurn
   */
  constructor(config) {
    const {
      level: { width, tiles },
      noise,
      delayGoblinTurn = true,
    } = config;

    this.delayGoblinTurn = delayGoblinTurn;

    this.noise = noise;
    this.level =
      typeof tiles === "string"
        ? tiles.split(",").map((c) => (!isNaN(+c) ? +c : c))
        : tiles;
    this.size = this.level.length;

    this.game = document.querySelector("main.game");
    this.turnDisplay = this.game.querySelector("p.turn-display");
    this.board = this.game.querySelector("div.board");
    this.boardWidth = width;

    this.turns = 0;

    this.creatures = [];

    this.logs = new Logs();

    this.buildBoard();

    addEventListener("keydown", (e) => {
      if (this.turn !== "player") return;

      if (e.key === "Escape") this.selectionFocus = null;
    });
  }

  get skipTurnButton() {
    return this.game.querySelector("button#skip-turn");
  }

  set turn(t) {
    this.turns++;

    this.__lastClick = null;
    this.__rawTurn = t;
    if (this.skipTurnButton) this.skipTurnButton.remove();
    document.activeElement.blur();

    this.board.setAttribute("turn", t);

    this.logs.push(`${t === "player" ? "Your" : "Gobby"} turn...`);

    this.creatures.forEach((creature) => {
      creature.genericAnimate();
      creature.animate();
    });

    if (t === "goblin") {
      if (this.delayGoblinTurn)
        this.logs.push(`The goblin(s) are considering their options...`);
      setTimeout(
        () => this.goblinTurn(),
        this.delayGoblinTurn ? Math.random() * 1000 + 200 : 0,
      );
    } else {
      // Setup player turn.
      this.turnData = {};

      const button = document.createElement("button");
      button.id = "skip-turn";
      button.innerHTML = "SKIP TURN";
      button.onclick = () => {
        if (this.turn === "player") this.turn = "goblin";
      };

      this.game.appendChild(button);
    }

    this.turnDisplay.innerHTML = t === "goblin" ? "GOBLIN'S TURN" : "YOUR TURN";
  }

  get turn() {
    return this.__rawTurn || "player";
  }

  get animals() {
    return this.creatures.filter((c) => c.creatureType === "animal");
  }

  get goblins() {
    return this.creatures.filter((c) => c.creatureType === "goblin");
  }

  toIndex = (x, y) => y * this.boardWidth + x;
  toXY = (i) => [i % this.boardWidth, Math.floor(i / this.boardWidth)];
  /**
   * Distance between two board indices.
   *
   * Modes:
   * - "manhattan": dx + dy. Counts orthogonal steps only (up, down, left, right),
   *   so a diagonal neighbor is 2 away. Use for 4-directional movement.
   * - "chebyshev": max(dx, dy). Counts steps where diagonals cost the same as
   *   orthogonal moves, so a diagonal neighbor is 1 away. Use for 8-directional
   *   movement (like a chess king).
   * - "euclidean": sqrt(dx² + dy²). Straight-line distance, so a diagonal neighbor
   *   is ~1.41 away. Use for ranges, radii, or line-of-sight, not step counts.
   *
   * @param {number} a - Index of the first tile.
   * @param {number} b - Index of the second tile.
   * @param {"manhattan" | "chebyshev" | "euclidean"} [mode="manhattan"] - How
   *   distance is measured (see above). Defaults to "manhattan".
   * @returns {number} The distance between the two tiles.
   */
  distance = (a, b, mode = "manhattan") => {
    const [x1, y1] = this.toXY(a);
    const [x2, y2] = this.toXY(b);

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    switch (mode) {
      case "chebyshev":
        return Math.max(dx, dy);
      case "euclidean":
        return Math.hypot(dx, dy);
      default:
        return dx + dy;
    }
  };

  getTile(i, y) {
    if (y) i = this.toIndex(i, y);

    return this.board.querySelector(`button.tile:nth-child(${i + 1})`);
  }

  getCreature(i, y) {
    if (y) i = this.toIndex(i, y);

    return this.creatures.find((x) => x.i === i);
  }

  goblin(i, type) {
    const creature = new Goblin(this, i, type);

    this.creatures.push(creature);

    return creature;
  }

  animal(i, type) {
    const creature = new Animal(this, i, type);

    this.creatures.push(creature);

    return creature;
  }

  goblinTurn() {
    const possibleMoves = [];

    for (const goblin of this.goblins) {
      possibleMoves.push(...goblin.possibleMoves());
    }

    if (!possibleMoves.length) {
      this.logs.push("Gobbies thought really hard but couldn't do sh*t...");
      this.turn = "player";
    } else {
      const move = possibleMoves.sort((a, b) => b.value - a.value)[0];

      move.goblin.move(move);

      this.turn = "player";
    }
  }

  click(i) {
    if (this.turn !== "player") return;

    const lastClick =
      !isNaN(this.__lastClick) && this.getCreature(this.__lastClick);

    const creature = this.getCreature(i);

    const setupAttack = (creature) => {
      const possibleEnemies = creature.neighbors.filter(
        (c) => c.creatureType === "goblin",
      );

      console.log(possibleEnemies);
    };

    // Tile is empty.
    if (!creature) {
      // If an animal is selected, lets try to move it.
      if (
        lastClick &&
        lastClick.creatureType === "animal" &&
        !lastClick.dead &&
        !this.turnData.moved
      ) {
        const dt = this.distance(lastClick.i, i, "chebyshev");

        if (dt < 2) {
          // Move the animal.
          this.logs.push(
            `Moved ${lastClick.type} to (${this.toXY(lastClick.i).join(", ")})`,
          );
          lastClick.i = i;
          this.turnData.moved = true;

          // If the possibility for attack after move didn't open up, we end turn.
          if (!lastClick.neighbors.find((n) => n.creatureType === "goblin")) {
            this.turn = "goblin";
            return;
          } else setupAttack(lastClick);
        } else {
          this.logs.push("Tile too far...");
          return lastClick.element.focus();
        }
      }
    } else {
      // Tile is not empty.

      if (creature.creatureType === "animal") {
        // Handle animal click.
        setupAttack(creature);
      }
      // else if (creature.neighbors.find((n) => n.creatureType === "animal")) {
      //   console.log("TRIGGERATTACK");
      // }
    }

    this.__lastClick = i;
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

    this.logs.push("Kill all goblins or move all animals to the exit.");
    this.turn = "player";
  }
}
