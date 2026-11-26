export const base = {
  0: {
    width: 3,
    tiles: "0,1,0,0,0,0,0,grunt,0,0,0,0,0,0,0,0,mouse,0,0,0,0",
  },
  1: {
    width: 3,
    tiles: "0,1,0,0,0,0,grunt,0,grunt,0,0,0,0,0,0,mouse,0,mouse,0,0,0",
  },
  2: {
    width: 3,
    tiles: "0,1,0,0,0,0,0,mohawk,0,0,0,0,0,0,0,frog,0,mouse,0,0,0",
  },
};

export const dev = {
  100: {
    width: 27,
    tiles:
      "bear,cat,chicken,cow,deer,dog,duck,elephant,fox,frog,giraffe,hippo,koala,lion,monkey,mouse,owl,panda,penguin,pig,rabbit,raccoon,red_panda,sheep,tiger,turtle,zebra,\
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\
      archer,assassin,bandit,berserker,chieftain,cyclops,demon,grunt,horned,king,miner,mohawk,pirate,shaman,undead,vampire,warrior,wizard,0,0,0,0,0,0,0,0,0,\
      2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,\
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1",
  },
  101: {
    width: 8,
    tiles:
      "\
      1,1,1,1,1,1,1,1,\
      1,berserker,0,0,0,0,assassin,1,\
      1,0,0,0,0,0,0,1,\
      1,0,0,pig,pig,0,0,1,\
      1,0,0,pig,pig,0,0,1,\
      1,0,0,0,0,0,0,1,\
      1,cyclops,0,0,0,0,demon,1,\
      1,1,1,1,1,1,1,1",
  },
};

const packs = { dev, base };

export default packs;
