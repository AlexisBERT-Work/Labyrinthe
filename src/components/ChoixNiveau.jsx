import React, { useState, useEffect } from 'react';
import { Sword, KeyRound, TriangleAlert } from 'lucide-react';
import { useJeu } from '../context/ContexteJeu'; 

const ChoixNiveau = () => {
  const { selectionnerNiveau, retournerAccueil } = useJeu(); 
  const [Niveaux, setNiveaux] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/levels');
        if (!res.ok) throw new Error("Erreur lors de la récupération des niveaux");
        const data = await res.json();
        setNiveaux(data);
      } catch (error) {
        console.error('Erreur chargement niveaux:', error);
      } finally {
        setChargement(false);
      }
    };
    fetchNiveaux();
  }, []);

  const CouleursDifficulte = {
    easy: "from-green-500 to-green-700",
    medium: "from-yellow-400 to-yellow-600",
    hard: "from-orange-500 to-orange-700",
    extreme: "from-red-600 to-red-800"
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 flex items-center justify-center">
        <div className="text-indigo-200 text-xl animate-pulse">
          Chargement des niveaux...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-8 shadow-xl">
          <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow mb-2">
            Sélection du niveau
          </h2>
          <p className="text-indigo-200 text-lg">
            Choisissez votre prochain défi...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Niveaux.map((niveau) => (
            <div key={niveau.id} onClick={() => selectionnerNiveau(niveau.id)} className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/40 rounded-xl p-6 shadow-md hover:border-yellow-400 hover:bg-gray-700/40 transition-all duration-200 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition">
                    {niveau.name}
                  </h3>
                  <p className="text-indigo-300 text-sm">{niveau.description}</p>
                </div>

                <span className={`text-white text-xs px-3 py-1 rounded-lg font-bold uppercase bg-gradient-to-br ${CouleursDifficulte[niveau.difficulty]}`}>
                  {niveau.difficulty}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="text-indigo-300">
                  Taille :
                  <span className="text-white font-bold ml-1">
                    {niveau.rows}×{niveau.cols}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {niveau.hasCombat && (
                  <span className="bg-red-900/50 text-red-200 text-xs px-2 py-1 rounded flex items-center gap-1 border border-red-700/40">
                    <Sword size={14} />
                    Combat
                  </span>
                )}

                {niveau.hasKeys && (
                  <span className="bg-yellow-900/50 text-yellow-200 text-xs px-2 py-1 rounded flex items-center gap-1 border border-yellow-700/40">
                    <KeyRound size={14} />
                    Clés
                  </span>
                )}

                {niveau.hasObstacles && (
                  <span className="bg-orange-900/50 text-orange-200 text-xs px-2 py-1 rounded flex items-center gap-1 border border-orange-700/40">
                    <TriangleAlert size={14} />
                    Obstacles
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
        <button onClick={retournerAccueil} className="w-full bg-gray-700/60 hover:bg-gray-600 text-white font-bold py-3 rounded-xl shadow-lg backdrop-blur border border-gray-600/40 transition">
          Retour à l'Accueil
        </button>
      </div>
    </div>
  );
};

export default ChoixNiveau;