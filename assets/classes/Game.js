import Board from "./Board.js";
import packs from "../util/levels.js";

export default class Game {
  constructor(debug = false) {
    this.debug = debug;
    this.screen = "menu";
  }

  __encodeSave = (obj) =>
    new TextEncoder().encode(JSON.stringify(obj)).toBase64();

  __decodeSave = (b64) =>
    JSON.parse(new TextDecoder().decode(Uint8Array.fromBase64(b64)));

  saveGame() {
    if (!this.save) return;

    localStorage.setItem(
      `goblex_slot_${this.currentSlot + 1}`,
      this.__encodeSave({
        ...this.save,
        playTime: this.save.playTime + performance.now(),
      }),
    );
  }

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
        this.loadLevel(...rest.level);
        break;
      default:
        this.loadError();
        break;
    }

    this.__rawCurrentScreen = name;
  }

  loadError() {
    if (this.debug) {
      console.error("A fatal error occured, game state below for preview:");
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
    ].map((slot) => {
      if (slot) {
        try {
          return this.__decodeSave(slot);
        } catch (err) {
          return "error";
        }
      } else {
        return null;
      }
    });

    document.body.innerHTML = `<main class="saves"></main>`;

    const slotsDisplay = document.createElement("div");
    slotsDisplay.className = "slots";

    for (const i in slots) {
      const slot = slots[i];

      const slotDisplay = document.createElement("div");
      slotDisplay.className = "slot";

      const slotButton = document.createElement("button");
      slotButton.className = "select";
      slotButton.innerHTML = `<h2>Slot ${+i + 1}</h2>`;

      if (slot === "error") {
        slotDisplay.classList.toggle("corrupted", true);
        slotButton.innerHTML += `<p>!SAVE CORRUPTED!</p>`;
      } else if (slot) {
        slotButton.innerHTML += `<p>${(slot.playTime < 1000 * 60 * 60 ? `<1H` : `${Math.floor(slot.playTime / 1000 / 60 / 60)}H`) + " of playtime"}</p><p>LEVEL - ${slot.level.join("-").toUpperCase()}</p>`;
      } else {
        slotButton.innerHTML += `<p>(empty)</p>`;
      }

      if (slot !== "error")
        slotButton.onclick = () => {
          this.currentSlot = +i;
          if (!slot) {
            this.save = {
              playTime: 0,
              level: "base-0",
            };

            localStorage.setItem(
              `goblex_slot_${this.currentSlot + 1}`,
              this.__encodeSave(this.save),
            );
            this.screen = { name: "level", level: ["base", 0] };
          } else {
            this.save = slot;

            this.screen = { name: "level", level: this.save.level };
          }
        };

      slotDisplay.appendChild(slotButton);

      if (slot) {
        const slotClear = document.createElement("button");
        slotClear.className = "clear default";
        slotClear.innerHTML = "erase";
        slotClear.onclick = (e) => {
          e.stopPropagation();
          const conf = confirm(
            "Are you sure you want to erase this slot? This action is irreversable!",
          );

          if (conf) {
            localStorage.removeItem(`goblex_slot_${+i + 1}`);
            this.screen = "saves";
          }
        };
        slotDisplay.appendChild(slotClear);
      }

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
            <h1>GOBLEX</h1>
            <p>( goblin + codex )</p>
        </header>
    </main>`;

    const main = document.body.querySelector("main.screen");

    const buttons = [
      {
        label: "play",
        action: () => {
          this.screen = "saves";
        },
      },
      {
        label: "settings",
        action: () => {
          this.screen = "settings";
        },
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

  loadLevel(pack, level) {
    document.body.innerHTML = `<main class="game">
      <p class="turn-display">YOUR TURN</p>
      <div class="board"></div>
    </main>
    <footer class="logs"></footer>`;

    this.save.level = [pack, level];

    this.board = new Board(this, {
      // delayGoblinTurn: false,
      level: packs[pack][level],
    });
  }

  nextLevel() {
    if (!this.save) return;

    const [currentPack, currentLevel] = this.save.level;

    const nextLevel = packs[currentPack][currentLevel + 1];

    if (nextLevel) this.loadLevel(currentPack, currentLevel + 1);
    else {
      console.warn("No handling for pack completion");
      this.screen = "menu";
    }

    this.saveGame();
  }

  resetLevel() {
    if (!this.save) return;

    const [currentPack, currentLevel] = this.save.level;

    this.loadLevel(currentPack, currentLevel);
  }
}
