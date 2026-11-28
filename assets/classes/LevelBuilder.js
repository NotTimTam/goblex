import Board from "./Board.js";

export default class LevelBuilder {
  constructor() {
    this.buildUI();

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

  rebuildTiles() {
    const [width, height] = this.size;

    this.canvas.innerHTML = null;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = document.createElement("button");
        tile.className = "tile";
        tile.oncontextmenu = (e) => {
          this.rightClick(this.toIndex(x, y));
        };
        tile.onclick = (e) => {
          e.stopPropagation();

          this.leftClick(this.toIndex(x, y));
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

    this.canvas = document.createElement("div");
    this.canvas.className = "canvas";
    this.canvas.style.setProperty("--scale", 1);
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

    // Create tooling
    this.toolbar = document.createElement("div");
    this.toolbar.className = "toolbar";
    document.body.children[0].appendChild(this.toolbar);

    const tools = [
      {
        icon: Board.wallTexture,
        activator: () => {
          this.currentTool = 2;
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
      if (tool.border) toolButton.style.borderColor = tool.border;
      toolButton.onclick = tool.activator;

      this.toolbar.appendChild(toolButton);
    }

    this.tooltip = document.createElement("p");
    this.tooltip.className = "tooltip";
    document.body.children[0].appendChild(this.tooltip);

    // Populate
    this.size = [7, 7];
  }

  rightClick(i) {
    console.log("r", i);
  }

  leftClick(i) {
    console.log("l", i);
  }
}
