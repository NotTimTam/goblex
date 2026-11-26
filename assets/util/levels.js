export const base = {
  0: {
    width: 3,
    tiles: "0,1,0,0,0,0,0,grunt,0,0,0,0,0,0,0,0,mouse,0,0,0,0",
  },
  1: {
    width: 3,
    tiles: "0,1,0,0,0,0,grunt,2,grunt,0,0,0,0,0,0,mouse,0,mouse,0,0,0",
  },
};

export const dev = {
  100: {
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
