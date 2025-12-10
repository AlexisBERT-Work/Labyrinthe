import { Play, Trophy, Spotlight } from 'lucide-react';
import { useJeu } from '../context/ContexteJeu.jsx';

const Accueil = () => {
  const {
    nomJoueur, setNomJoueur, 
    demarrerJeu, 
    afficherNiveaux, 
    afficherClassement
  } = useJeu();

  const BoutonsBasiques =
    "w-full flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg shadow-lg transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-[1.03]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 p-6">
      
      <div className="w-full max-w-xl bg-gray-800/40 backdrop-blur-xl border border-gray-700/40 rounded-2xl shadow-2xl p-10 space-y-6 animate-fade-in">

        <h1 className="text-5xl font-extrabold text-center text-yellow-400 drop-shadow-lg tracking-wide">
          FlipLabyrinth
        </h1>

        <p className="text-center text-indigo-200 font-medium">
          Explorez. Révélez. Survivez.
        </p>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-40"></div>

        <p className="text-indigo-100 text-center leading-relaxed text-lg">
          Découvrez un <span className="font-semibold text-yellow-300">labyrinthe mystérieux</span> où chaque tuile révélée peut être une avancée…
          ou un danger caché. <br />
          Trouvez la sortie, évitez les murs, et tentez d'aller le plus loin possible !
        </p>

        <div className="space-y-2">
          <label htmlFor="playerName" className="text-indigo-200 font-medium">
            Votre pseudo
          </label>

          <input id="playerName" type="text" value={nomJoueur} onChange={(e) => setNomJoueur(e.target.value)} placeholder="Entrez votre pseudo" className="w-full px-4 py-2 bg-gray-900/40 border border-indigo-600/50 rounded-lg text-indigo-100 placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">

          <button onClick={demarrerJeu} disabled={!nomJoueur.trim()} className={`${BoutonsBasiques} bg-indigo-600 hover:bg-indigo-700 text-white`}>
            <Play size={22} className="mr-2" />
            Démarrer (Niveau 1)
          </button>

          <button onClick={afficherNiveaux} disabled={!nomJoueur.trim()} className={`${BoutonsBasiques} bg-gray-300 hover:bg-gray-200 text-gray-900`}>
            <Trophy size={22} className="mr-2" />
            Choisir un niveau
          </button>

          <button onClick={afficherClassement} className={`${BoutonsBasiques} bg-gray-300 hover:bg-gray-200 text-gray-900`}>
            <Spotlight size={22} className="mr-2" />
            Voir le classement
          </button>

        </div>
      </div>
    </div>
  );
};

export default Accueil;