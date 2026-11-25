import { EMOTIONS, healthbar } from "../util/creatures.js";
import { capitalizeWords } from "../util/display.js";

export default class Fight {
  constructor(board, animals, goblins) {
    this.board = board;

    this.animals = animals;
    this.goblins = goblins;
  }

  animateCreatures() {
    this.animals.forEach((animal, i) => {
      let frame = EMOTIONS.normal;
      const sprite = this.graphics.querySelector(
        `button.animal[index="${i}"] div.sprite`,
      );

      if (animal.dead) {
        frame = EMOTIONS.dead;
        sprite.classList.toggle("dead", true);
      } else if (this.animals.length > this.goblins.length) {
        frame = EMOTIONS.happy;
      } else if (
        this.animals.length < this.goblins.length ||
        (this.animals.length === 1 && this.goblins.length === 1)
      ) {
        frame = EMOTIONS.scared;
      }

      this.graphics
        .querySelector(`button.animal[index="${i}"] div.sprite`)
        .style.setProperty("--frame", frame);

      this.interface.querySelector(
        `div.stats div.healthbars div.hp[index="${i}"] div.healthbar span.inner`,
      ).style.width = `${100 * (animal.health / animal.maxHealth)}%`;

      this.interface.querySelector(
        `div.stats div.healthbars div.hp[index="${i}"] p`,
      ).innerHTML =
        `${Math.round(Math.max(0, animal.health))}/${animal.maxHealth}HP`;
    });

    this.goblins.forEach((goblin, i) => {
      let frame = EMOTIONS.scheming;
      const sprite = this.graphics.querySelector(
        `button.goblin[index="${i}"] div.sprite`,
      );

      if (goblin.dead) {
        frame = EMOTIONS.dead;
        sprite.classList.toggle("dead", true);
      } else if (this.goblins.length > this.animals.length) {
        frame = EMOTIONS.scheming;
      } else if (this.goblins.length < this.animals.length) {
        frame = EMOTIONS.scared;
      }

      sprite.style.setProperty("--frame", frame);

      this.graphics.querySelector(
        `button.goblin[index="${i}"] div.sprite div.healthbar span.inner`,
      ).style.width = `${100 * (goblin.health / goblin.maxHealth)}%`;
    });
  }

  goblinTurn() {
    let timeout = 0;

    this.goblins
      .filter((g) => !g.dead)
      .forEach((goblin, index, arr) => {
        const hit = () => {
          const targets = this.animals.filter((a) => !a.dead);
          const i = Math.floor(Math.random() * targets.length);
          const target = targets[i];

          target.health -= goblin.attack;
          this.graphics
            .querySelector(
              `button.animal[index="${this.animals.indexOf(target)}"] div.sprite`,
            )
            .classList.toggle("hit", true);

          this.board.logs.push(
            `${capitalizeWords(goblin.type)} attacked ${target.type} for ${goblin.attack}HP`,
          );

          if (target.health <= 0) {
            goblin.lastKill = true;
          }

          this.animateCreatures();

          if (index === arr.length - 1) this.turn = "player";
        };

        if (this.board.delayGoblinTurn) {
          timeout += Math.random() * 100 + 500;
          setTimeout(hit, timeout);
        } else hit();
      });
  }

  set turn(t) {
    this.__lastClick = null;
    this.__rawTurn = t;
    document.activeElement.blur();

    this.board.animateCreatures();
    this.animateCreatures();

    // Before triggering turn, test if game is in a win or loss state.
    const end = this.endCondition;
    if (end) {
      this.interface.addEventListener("animationend", (e) => {
        if (e.animationName === "fight-end") this.resolveFight(end);
      });
      this.interface.classList.toggle("end", true);

      return;
    }

    // For styling purposes, indicate the turn to the board.
    this.interface.setAttribute("turn", this.__rawTurn);
    this.board.logs.push(`${t === "player" ? "Your" : "Gobby"} move...`);

    if (t === "goblin") {
      if (this.board.delayGoblinTurn)
        this.board.logs.push(`The goblin(s) are considering their options...`);
      setTimeout(
        () => this.goblinTurn(),
        this.board.delayGoblinTurn ? Math.random() * 1000 + 200 : 0,
      );
    } else if (t === "player") {
      this.turnData = {};

      this.currentAnimal = this.animals.indexOf(
        this.animals.find((a) => !a.dead),
      );
    }
  }

  get turn() {
    return this.__rawTurn || "player";
  }

  set currentAnimal(n) {
    if (this.turn !== "player") return;

    if (n >= this.animals.length || n === -1) this.turn = "goblin";
    else {
      this.turnData.currentAnimal = n;
      this.graphics.querySelector(`button.animal[index="${n}"]`)?.focus();
    }
  }

  get currentAnimal() {
    return this.turnData?.currentAnimal;
  }

  get endCondition() {
    /*
    WIN CONDITIONS:
    - All goblins are dead.
    */
    if (!this.goblins.find((a) => !a.dead)) return "win";

    /*
    LOSS CONDITIONS:
    - All animals are dead.
    */
    if (!this.animals.find((a) => !a.dead)) return "loss";

    return false;
  }

  onclick(creature) {
    if (this.turn !== "player") return;

    if (creature.creatureType === "animal") {
      const index = this.animals.indexOf(creature);

      if (index !== this.currentAnimal) {
        this.graphics
          .querySelector(`button.animal[index="${this.currentAnimal}"]`)
          .focus();
      }
    } else {
      creature.health -= this.animals[this.currentAnimal].attack;
      this.graphics
        .querySelector(
          `button.goblin[index="${this.goblins.indexOf(creature)}"] div.sprite`,
        )
        .classList.toggle("hit", true);

      const animal = this.animals[this.currentAnimal];

      this.board.logs.push(
        `${capitalizeWords(animal.type)} attacked ${creature.type} for ${1}HP`,
      );

      const notDeads = this.animals
        .slice(this.currentAnimal + 1)
        .filter((a) => !a.dead);

      this.currentAnimal = this.animals.indexOf(notDeads[0]);

      this.animateCreatures();
    }
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
      button.setAttribute("index", i);

      button.onclick = () => this.onclick(creature);
      button.onblur = () => {
        if (this.turn === "player" && i === this.currentAnimal) {
          button.focus();
        }
      };

      const sprite = document.createElement("div");
      sprite.className = "sprite init";
      sprite.addEventListener("animationend", (e) => {
        if (e.animationName === "shake") sprite.classList.toggle("hit", false);
      });

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

      if (creature.creatureType === "animal") {
        const qs = `div.stats div.healthbars div.hp[index="${i}"]`;

        button.addEventListener("focus", () => {
          this.interface.querySelector(qs).classList.add("highlight");
        });

        button.addEventListener("blur", () => {
          this.interface.querySelector(qs).classList.remove("highlight");
        });
      } else {
        const hb = healthbar();
        hb.children[0].style.width = `${100 * (creature.health / creature.maxHealth)}%`;
        sprite.appendChild(hb);
      }

      container.appendChild(button);
    });
  }

  start() {
    return new Promise((resolve) => {
      this.resolveFight = resolve;
      this.interface = document.createElement("div");
      this.interface.className = "fight";

      this.board.game.appendChild(this.interface);

      // Create gui display.
      this.graphics = document.createElement("div");
      this.graphics.className = "graphics";
      this.interface.appendChild(this.graphics);

      // Create stats display
      this.stats = document.createElement("div");
      this.stats.className = "stats";
      this.interface.appendChild(this.stats);

      // Create battlefield containers.
      const animalsDisp = document.createElement("div");
      animalsDisp.className = "creatures animals";
      this.graphics.appendChild(animalsDisp);

      const goblinsDisp = document.createElement("div");
      goblinsDisp.className = "creatures goblins";
      this.graphics.appendChild(goblinsDisp);

      // Add creatures to their formations.
      this.__createFormation(this.animals, animalsDisp, "animals");
      this.__createFormation(this.goblins, goblinsDisp, "goblins");

      // Add to stats display.
      const healthBars = document.createElement("div");
      healthBars.className = "healthbars";
      this.stats.appendChild(healthBars);

      const counts = new Map();
      const totals = new Map();

      this.animals.forEach(({ type }) => {
        totals.set(type, (totals.get(type) || 0) + 1);
      });

      this.animals.forEach((animal, i) => {
        const index = (counts.get(animal.type) || 0) + 1;
        counts.set(animal.type, index);

        const hp = document.createElement("div");
        hp.className = "hp";
        hp.setAttribute("index", i);

        const name = document.createElement("h3");
        name.innerHTML = `${animal.type}${totals.get(animal.type) > 1 ? ` (${index})` : ""}`;
        hp.appendChild(name);

        const txt = document.createElement("p");
        txt.innerHTML = `${Math.round(animal.health)}HP`;
        hp.appendChild(txt);

        const hb = healthbar();
        hb.children[0].style.width = `${100 * (animal.health / animal.maxHealth)}%`;

        hp.appendChild(hb);

        healthBars.appendChild(hp);
      });

      this.turn = "player";
    });
  }

  cleanup() {
    this.interface.remove();

    this.board.turnData.fight = null;
  }
}
