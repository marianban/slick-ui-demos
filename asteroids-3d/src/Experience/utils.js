export const random = (from, to) => {
  if (from === undefined) {
    return Math.random();
  }

  if (Array.isArray(from)) {
    const randIndex = Math.floor(Math.random() * from.length);
    return from[randIndex];
  }

  if (to === undefined) {
    return Math.floor(Math.random() * from);
  }

  return from + Math.floor((to - from) * Math.random());
};
