import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useJeu } from '../context/ContexteJeu'; 
import { Home, Clock, Target } from 'lucide-react';
import Grille from './Grille';
import { estAdjacent, initTuilesRevelees, verifVictoire, verifDefaite, getNouvellePosition } from '../utils/GameLogic';
import { calculScore } from '../utils/CalculScore';

const Jeu = () => {
  const { levelId: idNiveau } = useParams();
  
  const { 
    niveau,
    chargerNiveau,
    nomJoueur,
    finirPartie,
    retournerAccueil,
    chargement
  } = useJeu();

  const [tuilesRevelees, setTuilesRevelees] = useState([]);
  const [positionJoueur, setPositionJoueur] = useState(niveau?.start || { row: 0, col: 0 }); 
  const [nombreTuilesRevelees, setNombreTuilesRevelees] = useState(1);
  const [heureDebut] = useState(Date.now());
  const [statutJeu, setStatutJeu] = useState('playing');
  const [tempsActuel, setTempsActuel] = useState(0);

  useEffect(() => {
    if (!niveau || (niveau.id && niveau.id.toString() !== idNiveau)) {
      chargerNiveau(idNiveau);
    }
  }, [idNiveau, niveau, chargerNiveau]);

  useEffect(() => {
    if (niveau) {
      setPositionJoueur(niveau.start);
      const tuilesInitiales = initTuilesRevelees(niveau.rows, niveau.cols, niveau.start);
      setTuilesRevelees(tuilesInitiales);
      setNombreTuilesRevelees(1);
      setStatutJeu('playing');
    }
  }, [niveau]);

  useEffect(() => {
    if (statutJeu !== 'playing') return;
    const timer = setInterval(() => {
      setTempsActuel(Math.floor((Date.now() - heureDebut) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [statutJeu, heureDebut]);

  const handleDeplacement = useCallback((nouvellePos) => {
    if (!niveau || statutJeu !== 'playing') return;
    const { row: ligne, col: colonne } = nouvellePos;
    if (ligne < 0 || ligne >= niveau.rows || colonne < 0 || colonne >= niveau.cols) return;
    if (!estAdjacent(positionJoueur, nouvellePos)) return;

    const cell = niveau.grid[ligne][colonne];

    if (verifDefaite(cell)) {
      const temps = Math.floor((Date.now() - heureDebut) / 1000);
      const score = calculScore(nombreTuilesRevelees, temps, 'defeat');
      setStatutJeu('ended');
      finirPartie({ 
        status: 'defeat',
        reason: 'Tu as heurté un mur !',
        tilesRevealed: nombreTuilesRevelees,
        time: temps,
        score: score,
        levelId: niveau.id
      });
      return;
    }

    if (!tuilesRevelees[ligne][colonne]) {
      const nouvellesTuiles = tuilesRevelees.map(l => [...l]);
      nouvellesTuiles[ligne][colonne] = true;
      setTuilesRevelees(nouvellesTuiles);
      setNombreTuilesRevelees(prev => prev + 1);
    }

    setPositionJoueur(nouvellePos);

    if (verifVictoire(cell)) {
      const temps = Math.floor((Date.now() - heureDebut) / 1000);
      const nombreFinal = tuilesRevelees[ligne][colonne] 
        ? nombreTuilesRevelees 
        : nombreTuilesRevelees + 1;
      const score = calculScore(nombreFinal, temps, 'victory');

      setStatutJeu('ended');
      
      finirPartie({
        status: 'victory',
        reason: '🎉 Tu as trouvé la sortie !',
        tilesRevealed: nombreFinal,
        time: temps,
        score: score,
        levelId: niveau.id
      });
    }
  }, [niveau, statutJeu, positionJoueur, tuilesRevelees, nombreTuilesRevelees, heureDebut, finirPartie]);

  const handleClicTuile = (ligne, colonne) => {
    handleDeplacement({ row: ligne, col: colonne });
  };

  useEffect(() => {
    const handleTouche = (event) => {
      if (statutJeu !== 'playing') return;
      const touchesAutorisees = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      
      if (touchesAutorisees.includes(event.key)) {
        event.preventDefault();
        const nouvellePos = getNouvellePosition(positionJoueur, event.key);
        handleDeplacement(nouvellePos);
      }
    };

    window.addEventListener('keydown', handleTouche);
    return () => window.removeEventListener('keydown', handleTouche);
  }, [statutJeu, positionJoueur, handleDeplacement]);

  if (chargement || !niveau || tuilesRevelees.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse">Chargement du niveau...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-gray-800/70 backdrop-blur-md p-5 rounded-xl flex items-center justify-between shadow-lg border border-gray-700">
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 drop-shadow-lg">
              {niveau.name}
            </h2>
            <p className="text-gray-300 mt-1 text-sm">
              {niveau.description}
            </p>
          </div>
          <button onClick={retournerAccueil} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition shadow-md">
            <Home size={18} />
            Accueil
          </button>
        </header>
        <div className="bg-gray-800/70 backdrop-blur-md p-5 rounded-xl grid grid-cols-3 gap-6 text-center shadow-lg border border-gray-700">
          <div>
            <p className="text-gray-400 text-sm">Joueur</p>
            <p className="text-white font-bold text-lg">{nomJoueur}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
              <Target size={14} />
              Tuiles révélées
            </p>
            <p className="text-white font-bold text-lg">{nombreTuilesRevelees}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
              <Clock size={14} />
              Temps
            </p>
            <p className="text-white font-bold text-lg">{tempsActuel}s</p>
          </div>
        </div>
        <Grille
          level={niveau}
          revealedTiles={tuilesRevelees}
          playerPos={positionJoueur}
          onTileClick={handleClicTuile}
        />
        <div className="mt-4 bg-blue-800/40 border border-blue-700 p-4 rounded-xl text-center text-blue-200 shadow-md">
          <span className="font-semibold">Astuce :</span> Clique sur les
          tuiles à côté de toi ou utilise les flèches pour explorer !
        </div>
      </div>
    </div>
  );
};

export default Jeu;