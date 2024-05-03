export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 

export const powerShuffle = (array: any[]) => {
  const groups = 10;

  const stacks = new Map<number, any[]>();

  for (let e of array) {
    const group = Math.floor(Math.random() * groups) % groups;
    if (stacks.has(group)) {
      stacks.get(group).push(e);
    } else {
      stacks.set(group, [e]);
    }
  }

  const ret = [];
  stacks.forEach((g) => {
    ret.push(...g);
  });
  return ret;
}
