import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Play, Home, Zap } from 'lucide-react';
import { useJeu } from '../context/ContexteJeu';

const Score = () => {
  const { 
    resultatPartie: resultat,
    classement,
    chargement: chargementContexte,
    erreur: erreurContexte,
    nomJoueur, 
    rejouer, 
    retournerAccueil,
    chargerClassement
  } = useJeu();

  const [enregistrementEnCours, setEnregistrementEnCours] = useState(false);
  const [enregistre, setEnregistre] = useState(false);
  const [idScoreActuel, setIdScoreActuel] = useState(null);
  const aEteSoumis = useRef(false);
  const estModeScore = !!resultat && !classement;

  useEffect(() => {
    if (estModeScore && !aEteSoumis.current) {
      const saveAndFetchScores = async () => {
        aEteSoumis.current = true;
        setEnregistrementEnCours(true);

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

          chargerClassement(Number(resultat.levelId));
        } catch (err) {
          console.error('Erreur submit/reload :', err);
        } finally {
          setEnregistrementEnCours(false);
        }
      };

      saveAndFetchScores();
    }

    if (!estModeScore && !classement && !chargementContexte) {
      chargerClassement(null);
    }
  }, [estModeScore, resultat, nomJoueur, chargerClassement, classement, chargementContexte]);

  if (chargementContexte || (estModeScore && enregistrementEnCours)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        <div className="flex flex-col items-center gap-4 bg-gray-800/40 p-8 rounded-xl border border-gray-700">
          <p className="text-indigo-400 text-3xl mb-4 animate-bounce">
            <Zap size={30} className="inline mr-2" />
            {estModeScore ? 'Enregistrement du score...' : 'Chargement du classement...'}
          </p>
        </div>
      </div>
    );
  }

  if (erreurContexte) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        <div className="flex flex-col items-center gap-4 bg-gray-800/40 p-8 rounded-xl border border-gray-700">
          <div className="text-red-400 text-3xl mb-4">Erreur</div>
          <p>Erreur lors du chargement des données : {erreurContexte}</p>
        </div>
      </div>
    );
  }

  if (!resultat && !classement) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        <div className="flex flex-col items-center gap-4 bg-gray-800/40 p-8 rounded-xl border border-gray-700">
          <div className="text-red-400 text-3xl mb-4">Données Manquantes</div>
          <p>Le score ou le classement n'a pas pu être chargé. Veuillez recommencer.</p>
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

  const dataToDisplay = classement;
  const titre = estModeScore 
    ? `Score Final de ${nomJoueur} (Niveau ${resultat.levelId})`
    : 'Top 10 Global (Tous Niveaux)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/40 rounded-2xl shadow-2xl p-10 space-y-8 animate-fade-in">
        
        {estModeScore && (
          <div className="text-center pb-6 border-b border-gray-700/50">
            <p className="text-3xl font-light text-indigo-300">🎉 Bravo, ton score est de :</p>
            <p className="text-6xl font-extrabold text-yellow-400 mt-2">{resultat.score} pts</p>
            {enregistre && <p className="text-green-400 mt-2 flex items-center justify-center gap-2"><Trophy size={18} /> Score enregistré !</p>}
          </div>
        )}

        <div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
            <Trophy size={26} />
            {titre}
          </h3>
          
          {dataToDisplay && dataToDisplay.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {dataToDisplay.map((hs, index) => {
                const estActuellement = estModeScore && hs.id === idScoreActuel;
                const couleursRang = [
                  'bg-yellow-500 text-gray-900',
                  'bg-gray-300 text-gray-900',
                  'bg-orange-600 text-white'
                ];
                const couleurRang = couleursRang[index] || 'bg-gray-700 text-white';
                
                return (
                  <div 
                    key={hs.id} 
                    className={`rounded-lg p-4 flex items-center justify-between shadow transition-all 
                      ${estActuellement ? 'bg-yellow-900/40 border border-yellow-500/60 ring-2 ring-yellow-400' : 'bg-gray-800/50 border border-gray-700/40'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${couleurRang}`}>
                        {index + 1}
                      </div>
                      <span className={`font-semibold ${estActuellement ? 'text-yellow-200' : 'text-white'}`}>
                        {hs.playerName}
                      </span>
                      {(!estModeScore || hs.levelId !== resultat.levelId) && 
                        <span className="text-indigo-400 text-sm">(Niv. {hs.levelId})</span>
                      }
                    </div>
                    <span className="text-yellow-400 text-lg font-bold">{hs.score} pts</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-indigo-300 text-center">Aucun score enregistré pour ce classement.</p>
          )}
        </div>
        
        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => rejouer(resultat?.levelId)} 
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition"
          >
            <Play size={22} />
            Rejouer
          </button>
          <button 
            onClick={retournerAccueil} 
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition"
          >
            <Home size={22} />
            Accueil
          </button>
        </div>

      </div>
    </div>
  );
};

export default Score;