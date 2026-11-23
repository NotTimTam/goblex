export default class Creature {
  constructor(board, i, creatureType) {
    this.board = board;
    this.creatureType = creatureType;

    this.__rawI = null;
    this.i = i;
  }

  get health() {
    return this.__rawHealth;
  }

  set health(n) {
    this.__rawHealth = n;
  }

  get maxHealth() {
    return this.__rawMaxHealth || 0;
  }

  set maxHealth(n) {
    this.__rawMaxHealth = n;
  }

  get dead() {
    return this.health <= 0;
  }

  get i() {
    return this.__rawI;
  }

  set i(n) {
    if (this.element) {
      this.clear();
    }

    this.__rawI = n;

    this.graphic();
  }

  get frame() {
    return this.__rawFrame ?? 0;
  }

  set frame(n) {
    this.__rawFrame = n;
    this.element.style.setProperty("--frame", this.__rawFrame);
  }

  get element() {
    return this.board.board.querySelector(
      `button.tile:nth-child(${this.i + 1})`,
    );
  }

  get neighbors() {
    return this.board.creatures.filter(
      (f) => f !== this && this.board.distance(f.i, this.i, "chebyshev") < 2,
    );
  }

  clear() {
    this.element.style = null;
    this.element.removeAttribute("type");
    this.element.removeAttribute("dead");
    this.element.innerHTML = null;
  }

  setHealthbar() {
    const healthbar =
      this.element.querySelector("div.healthbar") ||
      (() => {
        const healthbar = document.createElement("div");
        healthbar.className = "healthbar";

        const inner = document.createElement("span");
        inner.className = "inner";

        healthbar.appendChild(inner);

        this.element.appendChild(healthbar);

        return healthbar;
      })();

    healthbar.children[0].style.width = `${(this.health / this.maxHealth) * 100}%`;
  }

  graphic() {
    const url = new URL(
      `assets/images/${this.creatureType}s/${this.type}.png`,
      document.baseURI,
    );
    this.element.setAttribute("type", this.creatureType);
    this.element.style.backgroundImage = `url("${url}")`;

    this.genericAnimate();
  }

  genericAnimate() {
    this.setHealthbar();
    if (this.dead) this.element.setAttribute("dead", true);
  }
}
