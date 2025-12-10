import Tuile from './Tuile';
import { estAdjacent } from '../utils/GameLogic';

const Grille = ({ 
    level: niveauRecu, 
    revealedTiles: tuilesReveleesRecues, 
    playerPos: joueurPosRecu, 
    onTileClick: cliqueTuile 
}) => {
    const niveau = niveauRecu;
    const joueurPos = joueurPosRecu;
    const tuilesRevelees = tuilesReveleesRecues;
    if (!niveau || !tuilesRevelees || tuilesRevelees.length === 0) {
        return <div>Chargement du niveau...</div>;
    }

    const tuileEstAdjacente = (row, col) => {
        if (!joueurPos) return false;
        return estAdjacent({ row, col }, joueurPos); 
    };

    return (
        <div
            className="grid gap-1 mx-auto p-4 bg-gray-900 rounded-lg"
            style={{
                gridTemplateColumns: `repeat(${niveau.cols}, minmax(0, 1fr))`,
                maxWidth: '600px'
            }}
        >
            {niveau.grid.map((row, rowIdx) =>
                row.map((cell, colIdx) => {
                    const estJoueur = joueurPos?.row === rowIdx && joueurPos?.col === colIdx;
                    const estAdjacente = tuileEstAdjacente(rowIdx, colIdx);
                    const estRevele = tuilesRevelees[rowIdx][colIdx]; 

                    return (
                        <Tuile
                            key={`${rowIdx}-${colIdx}`}
                            cell={cell}
                            estJoueur={estJoueur}
                            estAdjacent={estAdjacente}
                            estRevele={estRevele}
                            onClick={() => cliqueTuile(rowIdx, colIdx)} 
                            rowIdx={rowIdx}
                            colIdx={colIdx}
                        />
                    );
                })
            )}
        </div>
    );
};

export default Grille;