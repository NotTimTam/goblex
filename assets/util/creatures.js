export const EMOTIONS = {
  normal: 0,
  scared: 1,
  dead: 2,
  happy: 3,
  scheming: 4,
};

export const animals = {
  mouse: { health: 5, attack: 2.5 },
  frog: { health: 8, attack: 2.5 },
  chicken: { health: 10, attack: 2.5 },
  duck: { health: 12, attack: 2.5 },
  rabbit: { health: 15, attack: 2.5 },
  owl: { health: 20, attack: 2.5 },
  turtle: { health: 30, attack: 2.5 },
  cat: { health: 25, attack: 2.5 },
  red_panda: { health: 25, attack: 2.5 },
  penguin: { health: 20, attack: 2.5 },
  raccoon: { health: 20, attack: 2.5 },
  fox: { health: 20, attack: 2.5 },
  monkey: { health: 30, attack: 2.5 },
  koala: { health: 35, attack: 2.5 },
  dog: { health: 40, attack: 2.5 },
  sheep: { health: 35, attack: 2.5 },
  pig: { health: 35, attack: 2.5 },
  deer: { health: 38, attack: 2.5 },
  panda: { health: 50, attack: 2.5 },
  zebra: { health: 50, attack: 2.5 },
  lion: { health: 60, attack: 2.5 },
  tiger: { health: 65, attack: 2.5 },
  cow: { health: 60, attack: 2.5 },
  bear: { health: 70, attack: 2.5 },
  giraffe: { health: 62, attack: 2.5 },
  hippo: { health: 75, attack: 2.5 },
  elephant: { health: 80, attack: 2.5 },
};

export const goblins = {
  grunt: { health: 5, attack: 2.5 },
  mohawk: { health: 15, attack: 4 },
  horned: { health: 15, attack: 5 },
  warrior: { health: 15, attack: 6 },
  archer: { health: 8, attack: 8 },
  shaman: { health: 20, attack: 5 },
  bandit: { health: 1, attack: 50 },
  assassin: { health: 1, attack: 999 },
  miner: { health: 15, attack: 6 },
  pirate: { health: 20, attack: 6 },
  cyclops: { health: 25, attack: 8 },
  berserker: { health: 25, attack: 10 },
  chieftain: { health: 35, attack: 10 },
  wizard: { health: 50, attack: 15 },
  king: { health: 65, attack: 20 },
  undead: { health: 75, attack: 25 },
  vampire: { health: 100, attack: 30 },
  demon: { health: 200, attack: 50 },
};

export const healthbar = () => {
  const healthbar = document.createElement("div");
  healthbar.className = "healthbar";

  const inner = document.createElement("span");
  inner.className = "inner";

  healthbar.appendChild(inner);

  return healthbar;
};
