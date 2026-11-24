export default class Fight {
  constructor(board, animals, goblins) {
    this.board = board;

    this.animals = animals;
    this.goblins = goblins;
  }

  __createFormation(creatures, container, side) {
    const generateFormation = (count, side, width) => {
      const spacingX = 76; // 76
      const spacingY = 76; // 64

      // Available width determines how many creatures
      // can fit in each row.
      const columns = Math.max(1, Math.floor(width / spacingX));

      const rows = Math.ceil(count / columns);

      const positions = [];

      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / columns);
        const col = i % columns;

        const rowCount = Math.min(columns, count - row * columns);

        // Center each row independently.
        const x =
          (col - (rowCount - 1) / 2) * spacingX + (row % 2) * spacingX * 0.25;

        const y = row * spacingY - ((rows - 1) * spacingY) / 2;

        // Curve the formation.
        const normalizedX = rowCount > 1 ? (col / (rowCount - 1)) * 2 - 1 : 0;

        const curve = normalizedX ** 2 * 20;

        positions.push({
          x,
          y: y + curve,
          direction: side === "animals" ? 1 : -1,
        });
      }

      return positions;
    };

    const positions = generateFormation(
      creatures.length,
      side,
      container.clientWidth,
      container.clientHeight,
    );

    creatures.forEach((creature, i) => {
      const button = document.createElement("button");
      button.className = `creature ${creature.creatureType}`;

      const sprite = document.createElement("div");
      sprite.className = "sprite init";

      const url = new URL(
        `assets/images/${creature.creatureType}s/${creature.type}.png`,
        document.baseURI,
      );

      sprite.style.backgroundImage = `url("${url}")`;
      sprite.style.setProperty(
        "--delay",
        (creature.creatureType === "goblin" ? 750 : 0) + 500 + i * 100 + "ms",
      );

      sprite.addEventListener("animationend", (e) => {
        if (e.animationName === "init") {
          sprite.classList.toggle("init", false);
          sprite.style.setProperty("--delay", i * 50 + "ms");
        }
      });

      const { x, y, direction } = positions[i];

      button.style.setProperty("--x", `${x}px`);
      button.style.setProperty("--y", `${y}px`);
      button.style.setProperty("--direction", direction);

      const depth = (y + container.clientHeight / 2) / container.clientHeight;

      button.style.setProperty("--scale", 0.85 + depth * 0.2);
      button.style.zIndex = Math.round(y + 1000);

      button.appendChild(sprite);

      container.appendChild(button);
    });
  }

  start() {
    this.interface = document.createElement("div");
    this.interface.className = "fight";

    this.board.game.appendChild(this.interface);

    // Create gui display
    this.graphics = document.createElement("div");
    this.graphics.className = "graphics";
    this.interface.appendChild(this.graphics);

    // Create battlefield containers
    const animalsDisp = document.createElement("div");
    animalsDisp.className = "creatures animals";
    this.graphics.appendChild(animalsDisp);

    const goblinsDisp = document.createElement("div");
    goblinsDisp.className = "creatures goblins";
    this.graphics.appendChild(goblinsDisp);

    // Add creatures to their formations
    this.__createFormation(this.animals, animalsDisp, "animals");
    this.__createFormation(this.goblins, goblinsDisp, "goblins");

    // Create stats display

    // Create controls interface
    // this.controls = document.createElement("div");
    // this.controls.className = "controls";

    // const buttons = [
    //   //   {
    //   //     label: "item",
    //   //     action: () => {},
    //   //   },

    //   {
    //     label: "special",
    //     action: () => {},
    //   },

    //   {
    //     label: "attack",
    //     action: () => {},
    //   },
    // ];

    // buttons.forEach((b) => {
    //   const button = document.createElement("button");
    //   button.onclick = b.action;
    //   button.innerHTML = b.label;

    //   button.className = "control";

    //   this.controls.appendChild(button);
    // });

    // this.interface.appendChild(this.controls);
  }
}
