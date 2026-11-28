import { animals, goblins } from "../util/creatures.js";
import Board from "./Board.js";

export default class LevelBuilder {
  constructor() {
    this.buildUI();

    this.btns = [];
    this.tiles = [];
    this.currentTool = null;
  }

  get size() {
    return this.__rawSize ?? [0, 0];
  }

  set size(n) {
    this.__rawSize = [
      Math.max(1, Math.min(n[0] ?? 1, 24)),
      Math.max(1, Math.min(n[1] ?? 1, 24)),
    ];
    this.canvas.style.gridTemplateColumns = `repeat(${this.__rawSize[0]}, 1fr)`;
    this.canvas.style.gridTemplateRows = `repeat(${this.__rawSize[1]}, 1fr)`;

    this.rebuildTiles();
  }

  toIndex = (x, y) => y * this.size[0] + x;
  toXY = (i) => [i % this.size[0], Math.floor(i / this.size[0])];

  getTile(i, y) {
    if (y) i = this.toIndex(i, y);

    return this.canvas.querySelector(`button.tile:nth-child(${i + 1})`);
  }

  clearTile(i) {
    this.tiles[i] = null;

    const element = this.getTile(i);

    element.className = "tile";
    element.style = null;
  }

  setTile(i) {
    this.clearTile(i);
    const element = this.getTile(i);

    if (!isNaN(this.currentTool)) {
      this.tiles[i] = this.currentTool;

      if (this.currentTool === 1) element.classList.toggle("exit", true);
      else if (this.currentTool === 2) {
        element.style.setProperty("--icon", Board.wallTexture);
        element.classList.toggle("wall", true);
      } else if (this.currentTool === 3) {
        element.classList.toggle("wall", true);
        element.classList.toggle("hidden", true);
      }
    } else {
      const type =
        (Object.keys(animals).includes(this.currentTool) && "animals") ||
        (Object.keys(goblins).includes(this.currentTool) && "goblins");

      if (type) {
        this.tiles[i] = this.currentTool;
        element.style.setProperty(
          "--icon",
          `url(${new URL(`assets/images/${type}/${this.currentTool}.png`, document.baseURI)}) `,
        );
        element.classList.toggle("creature", true);
        element.classList.toggle(type, true);
      }
    }
  }

  rebuildTiles() {
    const [width, height] = this.size;

    this.canvas.innerHTML = null;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = document.createElement("button");
        tile.className = "tile";

        tile.onmouseenter = (e) => {
          e.stopPropagation();

          if (this.btns[0]) this.leftClick(this.toIndex(x, y));
          else if (this.btns[2]) this.rightClick(this.toIndex(x, y));
        };
        tile.onmousedown = (e) => {
          if (e.button === 0) this.leftClick(this.toIndex(x, y));
          else if (e.button === 2) this.rightClick(this.toIndex(x, y));
        };

        tile.onmouseover = () => {
          if (this.currentTool)
            this.tooltip.innerHTML = "Click to set. Right click to clear.";
        };
        tile.onmouseleave = () => {
          this.tooltip.innerHTML = null;
        };

        this.canvas.appendChild(tile);
      }
    }
  }

  openCreatures(creatureType, creatures, toolButton) {
    const creaturePopup = document.createElement("div");
    creaturePopup.className = "creatures";

    this.toolbar.prepend(creaturePopup);

    creaturePopup.innerHTML = null;

    for (const [type, creature] of Object.entries(creatures)) {
      const button = document.createElement("button");
      button.className = `creature ${creatureType}`;
      button.style.backgroundImage = `url(${new URL(
        `assets/images/${creatureType}/${type}.png`,
        document.baseURI,
      )})`;
      button.style.backgroundSize =
        creatureType === "animals" ? "400%" : "500%";
      button.onclick = () => {
        this.currentTool = type;
        toolButton.style.setProperty("--icon", button.style.backgroundImage);

        creaturePopup.remove();
      };

      creaturePopup.appendChild(button);
    }
  }

  buildUI() {
    document.body.innerHTML = `<main class="level-builder"></main>`;

    // Create context menu
    this.contextMenu = document.createElement("header");
    this.contextMenu.className = "context-menu";
    document.body.prepend(this.contextMenu);

    const fileButton = document.createElement("button");
    fileButton.className = "default";
    fileButton.innerHTML = "File";
    fileButton.disabled = true;

    this.contextMenu.appendChild(fileButton);

    // Create canvas
    const canvasContainer = document.createElement("div");
    canvasContainer.className = "canvas-container";
    document.body.children[1].appendChild(canvasContainer);

    const canvasWrapper = document.createElement("div");
    canvasWrapper.className = "canvas-wrapper";
    canvasWrapper.style.setProperty("--scale", 1.5);
    canvasContainer.appendChild(canvasWrapper);

    canvasContainer.onwheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const oldScale =
        Number(canvasWrapper.style.getPropertyValue("--scale")) || 1;
      const rect = canvasContainer.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const anchorX =
        (canvasContainer.scrollLeft +
          pointerX -
          canvasWrapper.offsetWidth / 2) /
        oldScale;
      const anchorY =
        (canvasContainer.scrollTop +
          pointerY -
          canvasWrapper.offsetHeight / 2) /
        oldScale;

      const dir = e.wheelDelta > 0 ? 1 : -1;
      const newScale = Math.max(0.5, Math.min(4, oldScale + dir * 0.1));
      canvasWrapper.style.setProperty("--scale", newScale);

      updateStage(() => {
        const maxX = canvasContainer.scrollWidth - canvasContainer.clientWidth;
        const maxY =
          canvasContainer.scrollHeight - canvasContainer.clientHeight;

        canvasContainer.scrollLeft = Math.max(
          0,
          Math.min(
            maxX,
            canvasWrapper.offsetWidth / 2 + anchorX * newScale - pointerX,
          ),
        );
        canvasContainer.scrollTop = Math.max(
          0,
          Math.min(
            maxY,
            canvasWrapper.offsetHeight / 2 + anchorY * newScale - pointerY,
          ),
        );
      });
    };

    canvasContainer.oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    canvasContainer.onscroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    canvasContainer.onmousedown = (e) => {
      this.btns[e.button] = true;

      if (e.button === 1) {
        e.preventDefault();
        this.dragging = [
          e.clientX,
          e.clientY,
          canvasContainer.scrollLeft,
          canvasContainer.scrollTop,
        ];
      }
    };

    canvasContainer.onmouseup = (e) => {
      this.btns[e.button] = false;

      if (e.button === 1) this.dragging = null;
    };

    canvasContainer.onmousemove = (e) => {
      if (!this.btns[1] || !this.dragging) return;

      const [startX, startY, scrollLeft, scrollTop] = this.dragging;
      canvasContainer.scrollLeft = scrollLeft - (e.clientX - startX);
      canvasContainer.scrollTop = scrollTop - (e.clientY - startY);
    };

    this.canvas = document.createElement("div");
    this.canvas.className = "canvas";

    // Populate
    this.size = [7, 7];

    canvasWrapper.appendChild(this.canvas);

    const gutter = 512;

    const updateStage = (afterLayout) => {
      const scale =
        Number(canvasWrapper.style.getPropertyValue("--scale")) || 1;

      canvasWrapper.style.width = `${Math.max(canvasContainer.clientWidth, this.canvas.offsetWidth * scale + gutter * 2)}px`;
      canvasWrapper.style.height = `${Math.max(canvasContainer.clientHeight, this.canvas.offsetHeight * scale + gutter * 2)}px`;

      requestAnimationFrame(() => {
        if (afterLayout) afterLayout();
      });
    };

    const centerScroll = () => {
      canvasContainer.scrollLeft =
        (canvasContainer.scrollWidth - canvasContainer.clientWidth) / 2;
      canvasContainer.scrollTop =
        (canvasContainer.scrollHeight - canvasContainer.clientHeight) / 2;
    };

    updateStage(centerScroll);
    window.addEventListener("resize", () => updateStage(centerScroll));

    // Create tooling
    this.toolbar = document.createElement("div");
    this.toolbar.className = "toolbar";
    canvasContainer.appendChild(this.toolbar);

    const tools = [
      {
        icon: `url(${new URL(
          `assets/images/animals/mouse.png`,
          document.baseURI,
        )}) `,
        backgroundSize: "400%",
        activator: (toolButton) => {
          this.currentTool = "mouse";

          this.openCreatures("animals", animals, toolButton);
        },
      },
      {
        icon: `url(${new URL(
          `assets/images/goblins/grunt.png`,
          document.baseURI,
        )})`,
        backgroundSize: "500%",
        activator: (toolButton) => {
          this.currentTool = "grunt";

          this.openCreatures("goblins", goblins, toolButton);
        },
      },
      {
        icon: Board.wallTexture,
        backgroundSize: "50%",
        activator: () => {
          this.currentTool = 2;
        },
      },
      {
        icon: `url(${new URL(`assets/images/hidden.png`, document.baseURI)})`,
        backgroundSize: "100%",
        activator: () => {
          this.currentTool = 3;
        },
      },
      {
        icon: "#5599553c",
        border: "#559955",
        activator: () => {
          this.currentTool = 1;
        },
      },
    ];

    for (const tool of tools) {
      const toolButton = document.createElement("button");
      toolButton.className = "tool";

      if (tool.icon) toolButton.style.setProperty("--icon", tool.icon);
      if (tool.backgroundSize)
        toolButton.style.backgroundSize = tool.backgroundSize;
      if (tool.border) toolButton.style.borderColor = tool.border;
      toolButton.onclick = () => {
        if (tool.icon) toolButton.style.setProperty("--icon", tool.icon);
        this.toolbar.querySelector("div.creatures")?.remove();

        tool.activator(toolButton);

        this.toolbar
          .querySelector("button.tool.active")
          ?.classList.toggle("active", false);
        toolButton.classList.toggle("active", true);
      };

      this.toolbar.appendChild(toolButton);
    }

    this.tooltip = document.createElement("p");
    this.tooltip.className = "tooltip";
    document.body.children[1].appendChild(this.tooltip);
  }

  rightClick(i) {
    this.clearTile(i);
  }

  leftClick(i) {
    this.setTile(i);
  }
}
