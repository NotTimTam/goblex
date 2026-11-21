export default class Creature {
  constructor(i, creatureType) {
    this.creatureType = creatureType;

    this.__rawI = null;
    this.i = i;
  }

  get i() {
    return this.__rawI;
  }

  set i(n) {
    this.__rawI = n;
    this.graphic();
  }

  get frame() {
    return this.__rawFrame ?? 0;
  }

  set frame(n) {
    this.__rawFrame = Math.max(Math.min(n, 3));
    this.element.style.setProperty("--frame", this.__rawFrame);
  }

  get element() {
    return document.querySelector(
      `main.board button.tile:nth-child(${this.i + 1})`,
    );
  }

  clear() {
    this.element.style = null;
  }

  graphic() {
    const url = new URL(
      `assets/images/${this.creatureType}s/${this.type}.png`,
      document.baseURI,
    );
    this.element.style.backgroundImage = `url("${url}")`;
  }
}
