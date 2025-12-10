export const calculScore = (tuilesRevelees, time, status) => {
  if (status === 'victory') {
    return tuilesRevelees * 20 + Math.max(0, 300 - time);
  }
  return tuilesRevelees * 10;
};