export default class Logs {
  constructor() {
    this.element = document.querySelector("footer.logs");
  }

  clear() {
    this.element.innerHTML = null;
  }

  push(...t) {
    const p = document.createElement("p");
    p.className = "log";

    p.innerHTML = t.join(" ");

    this.element.appendChild(p);

    p.addEventListener("animationend", (e) => {
      if (e.animationName === "fade-out") p.remove();
    });
  }
}
