import Board from "./Board.js";
import { base } from "../util/levels.js";

export default class Game {
  constructor() {
    this.loadMenu();

    // this.loadLevel();
  }

  loadMenu() {
    if (this.board && !this.board.endCondition) return;

    document.body.innerHTML = `<main class="screen">
        <header>
            <h1>GOBEX</h1>
            <p>( goblin + codex )</p>
        </header>
    </main>`;

    const main = document.body.querySelector("main.screen");

    const buttons = [
      {
        label: "new game",
        action: () => {
          this.loadLevel(base[0]);
        },
      },
      {
        label: "continue",
        action: () => {},
        disabled: true,
      },
      {
        label: "levels",
        action: () => {},
        disabled: true,
      },
    ];

    buttons.forEach((b) => {
      const button = document.createElement("button");
      button.innerHTML = b.label;
      button.onclick = b.action;
      button.disabled = b.disabled;

      main.appendChild(button);
    });
  }

  loadLevel(level) {
    document.body.innerHTML = `<main class="game">
      <p class="turn-display">YOUR TURN</p>
      <div class="board"></div>
    </main>
    <footer class="logs"></footer>`;

    this.board = new Board({
      // delayGoblinTurn: false,
      level,
    });
  }
}
