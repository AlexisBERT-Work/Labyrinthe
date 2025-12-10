export const estAdjacent = (pos1, pos2) => {
  const dr = Math.abs(pos1.row - pos2.row); 
  const dc = Math.abs(pos1.col - pos2.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1); 
};

export const initTuilesRevelees = (rows, cols, PosDebut) => {
  const reveler = Array(rows).fill(null).map(() => Array(cols).fill(false));
  reveler[PosDebut.row][PosDebut.col] = true; 
  return reveler;
};

export const verifVictoire = (cell) => {
  return cell === 'E';
};

export const verifDefaite = (cell) => {
  return cell === 'W';
};

export const getNouvellePosition = (posActuelle, direction) => {
  let { row, col } = posActuelle;
  
  switch (direction) {
    case 'ArrowUp':
      row -= 1;
      break;
    case 'ArrowDown':
      row += 1;
      break;
    case 'ArrowLeft':
      col -= 1;
      break;
    case 'ArrowRight':
      col += 1;
      break;
    default:
      return posActuelle; 
  }
  return { row, col };
};