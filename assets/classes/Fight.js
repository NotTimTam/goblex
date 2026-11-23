export default class Fight {
  constructor(board) {
    this.board = board;
  }

  start() {
    this.interface = document.createElement("div");
    this.interface.className = "fight";

    this.board.game.appendChild(this.interface);
  }
}
