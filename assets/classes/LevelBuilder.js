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
      Math.max(0, Math.min(n[0], 24)),
      Math.max(0, Math.min(n[1], 24)),
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
      this.tiles[i] = this.currentTool;
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

  buildUI() {
    document.body.innerHTML = `<main class="level-builder"></main>`;

    // Create canvas
    const canvasContainer = document.createElement("div");
    canvasContainer.className = "canvas-container";
    document.body.children[0].appendChild(canvasContainer);

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
    };

    canvasContainer.onmouseup = (e) => {
      this.btns[e.button] = false;
    };

    this.canvas = document.createElement("div");
    this.canvas.className = "canvas";
    this.canvas.style.setProperty("--scale", 1.5);
    this.canvas.style.setProperty("--transform-x", 0.5);
    this.canvas.style.setProperty("--transform-y", 0.5);
    canvasContainer.appendChild(this.canvas);
    canvasContainer.onwheel = (e) => {
      const dir = e.wheelDelta > 0 ? 1 : -1;

      this.canvas.style.setProperty(
        "--scale",
        Math.max(
          0.5,
          Math.min(
            4,
            +(this.canvas.style.getPropertyValue("--scale") || 1) + dir * 0.1,
          ),
        ),
      );
    };

    // Create context menu
    this.contextMenu = document.createElement("header");
    this.contextMenu.className = "context-menu";
    document.body.children[0].appendChild(this.contextMenu);

    const fileButton = document.createElement("button");
    fileButton.className = "default";
    fileButton.innerHTML = "File";
    fileButton.disabled = true;

    this.contextMenu.appendChild(fileButton);

    // Create tooling
    this.toolbar = document.createElement("div");
    this.toolbar.className = "toolbar";
    document.body.children[0].appendChild(this.toolbar);

    const tools = [
      {
        icon: `url(${new URL(
          `assets/images/animals/mouse.png`,
          document.baseURI,
        )}) `,
        backgroundSize: "400%",
        activator: () => {
          this.currentTool = "mouse";
        },
      },
      {
        icon: `url(${new URL(
          `assets/images/goblins/grunt.png`,
          document.baseURI,
        )})`,
        backgroundSize: "500%",
        activator: () => {
          this.currentTool = "grunt";
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
        icon: `url(${new URL(`assets/images/hidden.png`, document.baseURI)}) `,
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
        tool.activator();

        this.toolbar
          .querySelector("button.active")
          ?.classList.toggle("active", false);
        toolButton.classList.toggle("active", true);
      };

      this.toolbar.appendChild(toolButton);
    }

    this.tooltip = document.createElement("p");
    this.tooltip.className = "tooltip";
    document.body.children[0].appendChild(this.tooltip);

    // Populate
    this.size = [7, 7];
  }

  rightClick(i) {
    this.clearTile(i);
  }

  leftClick(i) {
    this.setTile(i);
  }
}
