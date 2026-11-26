import { healthbar } from "../util/creatures.js";

export default class Creature {
  constructor(board, i, creatureType, type) {
    this.board = board;
    this.creatureType = creatureType;
    this.type = type;

    this.__rawI = null;
    this.i = i;
  }

  get health() {
    return this.__rawHealth;
  }

  set health(n) {
    if (n < this.__rawHealth) {
      this.element.addEventListener("animationend", (e) => {
        if (e.animationName === "shake")
          e.target.classList.toggle("hit", false);
      });
      this.element.classList.toggle("hit", true);
    }

    this.__rawHealth = Math.min(Math.max(n, 0), this.maxHealth || Infinity);
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
    if (this.__rawI !== null && this.element) {
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
    console.log("CLEAR", this.type);
    this.element.style = null;
    this.element.removeAttribute("type");
    this.element.classList.toggle("dead", false);
    this.element.innerHTML = null;
  }

  get healthbar() {
    return (
      this.element.querySelector("div.healthbar") ||
      (() => {
        const hb = healthbar();

        this.element.appendChild(hb);

        return hb;
      })()
    );
  }

  graphic() {
    console.log(this.type);
    const url = new URL(
      `assets/images/${this.creatureType}s/${this.type}.png`,
      document.baseURI,
    );

    this.element.setAttribute("type", this.creatureType);
    this.element.setAttribute("url", url);
    this.element.style.backgroundImage = `url("${url}")`;

    this.genericAnimate();
  }

  genericAnimate() {
    this.healthbar.children[0].style.width = `${Math.max((this.health / this.maxHealth) * 100, 0)}%`;

    if (this.dead) this.element.classList.toggle("dead", true);
  }
}
