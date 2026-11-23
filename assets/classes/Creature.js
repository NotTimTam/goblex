export default class Creature {
  constructor(board, i, creatureType) {
    this.board = board;
    this.creatureType = creatureType;

    this.__rawI = null;
    this.i = i;
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
    return document.querySelector(
      `main.board button.tile:nth-child(${this.i + 1})`,
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
  }

  graphic() {
    const url = new URL(
      `assets/images/${this.creatureType}s/${this.type}.png`,
      document.baseURI,
    );
    this.element.setAttribute("type", this.creatureType);
    this.element.style.backgroundImage = `url("${url}")`;
  }
}
