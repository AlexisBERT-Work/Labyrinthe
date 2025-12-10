import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Play, Home } from 'lucide-react';
import { useJeu } from '../context/ContexteJeu';

const Score = () => {
  const { 
    resultatPartie: resultat,
    nomJoueur, 
    rejouer, 
    retournerAccueil 
  } = useJeu();

  const [bestScores, setBestScores] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [enregistre, setEnregistre] = useState(false);
  const [idScoreActuel, setIdScoreActuel] = useState(null);
  const [globalScores, setGlobalScores] = useState([]); 

  const aFetch = useRef(false);
  const idNiveau = resultat ? resultat.levelId : null; 

  const fetchGlobalScores = async (limit = 10) => {
    try {
      const getResponse = await fetch(`http://localhost:4000/api/highscores?limit=${limit}`);
      if (getResponse.ok) {
        const data = await getResponse.json();
        setGlobalScores(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des scores globaux :', err);
    }
  };

  useEffect(() => {
    if (!resultat || aFetch.current) return;

    const saveAndFetchScores = async () => {
      aFetch.current = true;

      try {
        const postResponse = await fetch('http://localhost:4000/api/highscores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerName: nomJoueur,
            score: resultat.score,
            levelId: Number(resultat.levelId)
          })
        });

        if (postResponse.ok) {
          const newEntry = await postResponse.json();
          setEnregistre(true);
          setIdScoreActuel(newEntry.id);
        }

        const getResponse = await fetch(
          `http://localhost:4000/api/highscores?levelId=${Number(resultat.levelId)}&limit=10`
        );

        if (getResponse.ok) {
          const data = await getResponse.json();
          setBestScores(data);
        }
        
        fetchGlobalScores(10);

      } catch (err) {
        console.error('Erreur réseau :', err);
      } finally {
        setChargement(false);
      }
    };

    saveAndFetchScores();
  }, [resultat, nomJoueur]);

  if (!resultat) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        <div className="flex flex-col items-center gap-4 bg-gray-800/40 p-8 rounded-xl border border-gray-700">
          <div className="text-red-400 text-3xl mb-4">Erreur : Résultat manquant</div>
          <p>Le score n'a pas pu être chargé. Veuillez commencer une nouvelle partie.</p>
          <button 
            onClick={retournerAccueil} 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
          >
            <Home size={18} className="inline mr-2" /> Retour Accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/40 rounded-2xl shadow-2xl p-10 space-y-8 animate-fade-in">
        <div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
            <Trophy size={26} />
            Classement du niveau {idNiveau}
          </h3>
          {chargement ? (
            <p className="text-indigo-200 text-center animate-pulse">Chargement...</p>
          ) : bestScores.length === 0 ? (
            <p className="text-indigo-300 text-center">Aucun score enregistré pour ce niveau.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {bestScores.map((hs, index) => {
                const estActuellement = hs.id === idScoreActuel;
                const couleursRang = [
                  'bg-yellow-500 text-gray-900',
                  'bg-gray-300 text-gray-900',
                  'bg-orange-600 text-white'
                ];
                const couleurRang = couleursRang[index] || 'bg-gray-700 text-white';

                return (
                  <div key={hs.id} className={`rounded-lg p-4 flex items-center justify-between shadow transition-all 
                      ${estActuellement ? 'bg-yellow-900/40 border border-yellow-500/60 ring-2 ring-yellow-400' : 'bg-gray-800/50 border border-gray-700/40'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${couleurRang}`}>
                        {index + 1}
                      </div>
                      <span className={`font-semibold ${estActuellement ? 'text-yellow-200' : 'text-white'}`}>
                        {hs.playerName}
                      </span>
                    </div>
                    <span className="text-yellow-400 text-lg font-bold">{hs.score} pts</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {globalScores.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-700/50">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center gap-3">
              <Trophy size={26} /> Top 10 Global (Tous Niveaux)
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {globalScores.map((hs, index) => (
                <div 
                  key={`global-${hs.id}`} 
                  className="rounded-lg p-3 flex items-center justify-between bg-gray-900/40 border border-gray-700/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-lg text-indigo-200">{index + 1}</div>
                    <span className="font-semibold text-white">{hs.playerName}</span>
                    <span className="text-indigo-400 text-sm">(Niv. {hs.levelId})</span>
                  </div>
                  <span className="text-yellow-300 text-lg font-bold">{hs.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-4 pt-4">
          <button onClick={() => rejouer(resultat.levelId)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition">
            <Play size={22} />
            Rejouer
          </button>
          <button onClick={retournerAccueil} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition">
            <Home size={22} />
            Accueil
          </button>
        </div>

      </div>
    </div>
  );
};

export default Score;