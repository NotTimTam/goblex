export const EMOTIONS = {
  normal: 0,
  scared: 1,
  dead: 2,
  happy: 3,
  scheming: 4,
};

export const animals = {
  mouse: { health: 5, attack: 2.5, color: "#b9b0a8" },
  frog: { health: 8, attack: 4, color: "#5cc13a" },
  chicken: { health: 10, attack: 5, color: "#f7f3e8" },
  duck: { health: 12, attack: 6, color: "#f6d12a" },
  rabbit: { health: 15, attack: 8, color: "#bfb5ab" },
  owl: { health: 20, attack: 10, color: "#8b5e3c" },
  turtle: { health: 30, attack: 15, color: "#7bb661" },
  cat: { health: 25, attack: 30, color: "#f0a04b" },
  red_panda: { health: 25, attack: 30, color: "#c8501e" },
  penguin: { health: 20, attack: 30, color: "#26303f" },
  raccoon: { health: 20, attack: 30, color: "#8c8c94" },
  fox: { health: 20, attack: 30, color: "#e8702a" },
  monkey: { health: 30, attack: 35, color: "#8a5a35" },
  koala: { health: 35, attack: 35, color: "#a6a6ad" },
  dog: { health: 40, attack: 40, color: "#b98a54" },
  sheep: { health: 35, attack: 40, color: "#f2efe8" },
  pig: { health: 35, attack: 45, color: "#f5a3b8" },
  deer: { health: 38, attack: 40, color: "#b5753c" },
  panda: { health: 50, attack: 50, color: "#f4f4f4" },
  zebra: { health: 50, attack: 50, color: "#f4f4f4" },
  lion: { health: 60, attack: 60, color: "#f0c070" },
  tiger: { health: 65, attack: 64, color: "#f0852a" },
  cow: { health: 60, attack: 50, color: "#f4f4f4" },
  bear: { health: 70, attack: 64, color: "#8a5a35" },
  giraffe: { health: 62, attack: 60, color: "#f2c14e" },
  hippo: { health: 75, attack: 80, color: "#b1a8bb" },
  elephant: { health: 80, attack: 100, color: "#9aa3ad" },
};

export const goblins = {
  grunt: { health: 5, attack: 2.5, color: "#6aa84f" },
  mohawk: { health: 15, attack: 4, abilities: ["chase"], color: "#7fbf4a" },
  horned: { health: 15, attack: 5, abilities: ["chase"], color: "#8aa84a" },
  warrior: { health: 15, attack: 6, abilities: ["chase"], color: "#5f9a4a" },
  archer: { health: 8, attack: 8, color: "#7fbf4a" },
  shaman: { health: 20, attack: 5, color: "#4e8f6b" },
  bandit: { health: 1, attack: 50, abilities: ["chase"], color: "#6aa84f" },
  assassin: { health: 1, attack: 999, abilities: ["chase"], color: "#1f1f2b" },
  miner: { health: 15, attack: 6, color: "#7a9a3a" },
  pirate: { health: 20, attack: 6, color: "#6aa84f" },
  cyclops: { health: 25, attack: 8, color: "#6aa84f" },
  berserker: { health: 25, attack: 10, abilities: ["chase"], color: "#5f8a3f" },
  chieftain: { health: 35, attack: 10, abilities: ["chase"], color: "#5f8a3f" },
  wizard: { health: 50, attack: 15, color: "#7fae52" },
  king: { health: 65, attack: 20, color: "#7a9a3a" },
  undead: { health: 75, attack: 25, abilities: ["chase"], color: "#a3b18a" },
  vampire: { health: 100, attack: 30, color: "#b8c9a8" },
  demon: { health: 200, attack: 50, abilities: ["chase"], color: "#b03a2e" },
};

export const healthbar = () => {
  const healthbar = document.createElement("div");
  healthbar.className = "healthbar";

  const inner = document.createElement("span");
  inner.className = "inner";

  healthbar.appendChild(inner);

  return healthbar;
};
