export const logs = {
  goblin: {
    noMove: [
      "Gobbies thought really hard but couldn't do sh*t...",
      "The gobbies were gonna move but then one of them tripped over his shoe laces :(",
      "No possible moves presented themselves to the goblins",
    ],
  },
  animal: {},
};

export const getRandom = (logs) =>
  logs[Math.floor(Math.random() * logs.length)];
