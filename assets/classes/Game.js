import Board from "./Board.js";
import packs from "../util/levels.js";
import { animals, goblins } from "../util/creatures.js";

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

    if (this.board) this.board.logs.push("Progress saved!");
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
      case "levels":
        this.loadLevels(rest || {});
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
          const save = this.__decodeSave(slot);

          if (!save.level || typeof save.level !== "object")
            throw new Error("Invalid save structure");

          return save;
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
              level: ["base", 0],
              levels: {},
              points: 0,
            };

            localStorage.setItem(
              `goblex_slot_${this.currentSlot + 1}`,
              this.__encodeSave(this.save),
            );
            this.screen = { name: "level", level: ["base", 0] };
          } else {
            this.save = slot;

            const [currentPack, currentLevel] = this.save.level;

            // If the player's current level was won on their last save, we go to the level selector.
            if (
              this.save.levels[currentPack] &&
              this.save.levels[currentPack][currentLevel]?.w
            )
              this.screen = { name: "levels", from: "saves" };
            // Otherwise, we go to that level.
            else this.screen = { name: "level", level: this.save.level };
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
    if (this.board) this.board.cleanup();

    document.body.innerHTML = `<main class="game">
      <p class="turn-display">YOUR TURN</p>
      <div class="board"></div>
    </main>
    <footer class="logs"></footer>`;

    this.save.level = [pack, level];

    this.board = new Board(this, {
      // delayGoblinTurn: false,
      level: packs[pack].data[level],
    });
  }

  buildLevelPreview(levelData) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const tiles = levelData.tiles.split(",");

    const SCALE = 32;

    ctx.canvas.width = levelData.width * SCALE - 1;
    ctx.canvas.height = Math.floor(tiles.length / levelData.width) * SCALE - 1;

    ctx.lineWidth = 1;

    tiles.forEach((tile, i) => {
      tile = isNaN(tile) ? tile.trim() : +tile;

      const [x, y] = [i % levelData.width, Math.floor(i / levelData.width)];

      ctx.fillStyle = "#cecece";
      ctx.fillRect(x * SCALE, y * SCALE, SCALE - 1, SCALE - 1);

      switch (tile) {
        case 0:
          ctx.fillStyle = "black";
          break;
        case 1:
          ctx.fillStyle = "green";
          break;
        case 2:
          ctx.fillStyle = "grey";
          break;
        default:
          const creature = animals[tile] || goblins[tile];
          ctx.fillStyle = creature ? creature.color : "red";
          break;
      }

      ctx.fillRect(x * SCALE + 1, y * SCALE + 1, SCALE - 3, SCALE - 3);
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Failed to create blob"));

        const url = URL.createObjectURL(blob);
        const img = document.createElement("img");
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = reject;
        img.src = url;
      }, "image/png");
    });
  }

  loadLevels({ from }) {
    if (!this.save) return;

    if (this.board) this.board.cleanup();

    document.body.innerHTML = `<main class="packs"><h1>Select level pack</h1></main>`;

    // Build packs view
    const packsList = document.createElement("div");
    packsList.className = "packs-list";

    const loadPackView = (pack, packData) => {
      const packSave = this.save.levels[pack];

      document.body.innerHTML = `<main class="levels"><h1>Select level</h1></main>`;

      const levelList = document.createElement("div");
      levelList.className = "levels-list";
      levelList.addEventListener(
        "wheel",
        (e) => {
          // Ignore if the user is already scrolling horizontally
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

          // Let the page scroll normally once we hit either edge
          const atStart = levelList.scrollLeft <= 0 && e.deltaY < 0;
          const atEnd =
            Math.ceil(levelList.scrollLeft + levelList.clientWidth) >=
              levelList.scrollWidth && e.deltaY > 0;
          if (atStart || atEnd) return;

          e.preventDefault();
          levelList.scrollLeft += e.deltaY;
        },
        { passive: false },
      );

      for (const [i, level] of Object.entries(packData.data)) {
        const levelButton = document.createElement("button");

        const levelUnlocked =
          +i === 0 || (packSave[+i - 1] && packSave[+i - 1].w);
        const levelCompleted = packSave && packSave[+i]?.w;

        levelButton.className = "level default";
        levelButton.innerHTML = `<p>${pack}-${i}</p>`;

        if (levelCompleted) levelButton.classList.toggle("completed", true);

        if (levelUnlocked)
          levelButton.onclick = () =>
            (this.screen = { name: "level", level: [pack, +i] });
        else levelButton.disabled = true;

        levelList.appendChild(levelButton);

        setTimeout(async () => {
          levelButton.appendChild(await this.buildLevelPreview(level));
        }, 0);
      }

      document.body.children[0].appendChild(levelList);

      // Build back button
      const back = document.createElement("button");
      back.innerHTML = "back";
      back.onclick = () => (this.screen = { name: "levels", from });
      back.className = "default back";
      document.body.children[0].appendChild(back);
    };

    Object.entries({
      ...packs,
      extreme: { data: {} },
      dungeon: { data: {} },
      eggplant: { data: {} },
      bodycam: { data: {} },
      greg: { data: {} },
      egg: { data: {} },
      leg: { data: {} },
      fuckyou: { data: {} },
      eatmy: { data: {} },
      peenar: { data: {} },
      please: { data: {} },
      bro: { data: {} },
    })
      .filter(([_, d]) => !d.hidden)
      .forEach(([pack, packData]) => {
        const packButton = document.createElement("button");

        const numLevels = Object.keys(packData.data).length;
        const packSave = this.save.levels[pack];
        const progressInPack = packSave ? Object.keys(packSave).length : 0;

        packButton.className = "pack default";

        packButton.innerHTML = `
          <h2>${pack}</h2>
        `;

        if (progressInPack === numLevels && numLevels > 0) {
          packButton.classList.toggle("completed", true);
          packButton.innerHTML += `<p>Completed ${numLevels} level${numLevels === 1 ? "" : "s"}!</p>`;
        } else {
          packButton.innerHTML += `<p>${progressInPack} / ${numLevels} level${numLevels === 1 ? "" : "s"}</p>`;
        }

        if (numLevels > 0) {
          packButton.onclick = () => loadPackView(pack, packData);
        } else {
          packButton.disabled = true;
        }

        packsList.appendChild(packButton);
      });

    document.body.children[0].appendChild(packsList);

    // Build back button
    const back = document.createElement("button");
    back.innerHTML = "back";
    back.onclick = () => (this.screen = from ?? "menu");
    back.className = "default back";
    document.body.children[0].appendChild(back);
  }

  nextLevel() {
    if (!this.save) return;

    const [currentPack, currentLevel] = this.save.level;

    const nextLevel = packs[currentPack].data[currentLevel + 1];

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

  completeLevel(points) {
    if (!this.save) return;

    const [currentPack, currentLevel] = this.save.level;

    const levelAlreadyWon =
      this.save.levels[currentPack] &&
      this.save.levels[currentPack][currentLevel] &&
      this.save.levels[currentPack][currentLevel].w;

    if (!this.save.levels[currentPack]) this.save.levels[currentPack] = {};

    this.save.levels[currentPack][currentLevel] = { w: true, pts: points };
    if (!levelAlreadyWon) this.save.points += points;

    this.saveGame();
  }
}
