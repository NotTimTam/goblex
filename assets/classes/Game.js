import Board from "./Board.js";
import { base } from "../util/levels.js";

export default class Game {
  constructor(debug = false) {
    this.debug = debug;
    this.screen = "menu";

    // const save = this.__decodeSave(localStorage.getItem("goblex_save"));

    // this.loadLevel();
  }

  __encodeSave = (obj) =>
    new TextEncoder().encode(JSON.stringify(obj)).toBase64();

  __decodeSave = (b64) =>
    JSON.parse(new TextDecoder().decode(Uint8Array.fromBase64(b64)));

  get screen() {
    return this.__rawCurrentScreen;
  }

  set screen(obj) {
    const { name, ...rest } = typeof obj === "string" ? { name: obj } : obj;

    document.body.innerHTML = `<main class="loading"><p>LOADING</p></main>`;

    switch (name) {
      case "saves":
        this.loadSaves();
        return;
      case "menu":
        this.loadMenu();
        break;
      case "level":
        this.loadLevel(rest.level);
        break;
      default:
        this.loadError();
        break;
    }

    this.__rawCurrentScreen = name;
  }

  loadError() {
    if (this.debug) {
      onsole.error("A fatal error occured, game state below for preview:");
      console.log(this);
    }
    document.body.innerHTML =
      "<main class='error'><h2>Uh oh!</h2><p>A fatal error occured.</p></main>";
  }

  loadSaves() {
    const slots = [
      localStorage.getItem("goblex_slot_1"),
      localStorage.getItem("goblex_slot_2"),
      localStorage.getItem("goblex_slot_3"),
    ].map((slot) => (slot ? this.__decodeSave(slot) : null));

    document.body.innerHTML = `<main class="saves"></main>`;

    const slotsDisplay = document.createElement("div");
    slotsDisplay.className = "slots";

    for (const i in slots) {
      const slot = slots[i];

      const slotDisplay = document.createElement("button");
      slotDisplay.className = "slot";
      slotDisplay.innerHTML = `<h2>Slot ${+i + 1}</h2><p>${slot ? (slot.playTime < 1000 * 60 * 60 ? `<1H` : `${Math.floor(slot.playTime / 1000 / 60 / 60)}H`) + " of playtime" : "(empty)"}</p>`;
      slotDisplay.onclick = () => {
        this.currentSlot = +i;
        this.save = slot;
        if (!slot) {
          localStorage.setItem(
            `goblex_slot_${+i + 1}`,
            this.__encodeSave({
              playTime: 0,
              level: "base-0",
            }),
          );
          this.screen = { name: "level", level: base[0] };
        } else {
          this.screen = { name: "level", level: base[0] };
        }
      };

      slotsDisplay.appendChild(slotDisplay);
    }

    document.body.children[0].appendChild(slotsDisplay);

    const back = document.createElement("button");
    back.innerHTML = "back";
    back.onclick = () => (this.screen = "menu");
    back.className = "default back";
    document.body.children[0].appendChild(back);
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
        label: "play",
        action: () => {
          this.screen = "saves";
          // this.loadLevel(base[0]);
        },
      },
      {
        label: "settings",
        action: () => {
          this.screen = "settings";
        },
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

    this.board = new Board(this, {
      // delayGoblinTurn: false,
      level,
    });
  }
}
