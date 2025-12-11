import React, { createContext, useState, useContext } from 'react';
import { replace, useNavigate } from 'react-router-dom';

const JeuContext = createContext();

export const useJeu = () => useContext(JeuContext);

export function JeuProvider({ children }) {

  const [nomJoueur, setNomJoueur] = useState('');
  const [niveau, setNiveau] = useState(null);
  const [joueurPos, setJoueurPos] = useState(null);
  const [resultatPartie, setResultatPartie] = useState(null);
  const [classement, setClassement] = useState(null); 
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const navigate = useNavigate();

  const retournerAccueil = () => {
    resetApp();
    navigate('/', { replace: true });
  };

  const resetApp = () => {
    sessionStorage.clear();
    localStorage.clear();
    setNomJoueur('');
    setNiveau(null);
    setResultatPartie(null);
    setClassement(null);
    setErreur(null);
  };

  const chargerNiveau = async (idNiveau = 1) => {
    setChargement(true);
    setErreur(null);

    try {
      const reponse = await fetch(`http://localhost:4000/api/levels/${idNiveau}`);

      if (!reponse.ok) throw new Error('Erreur lors du chargement du niveau');

      const donnees = await reponse.json();
      setNiveau(donnees);
      navigate(`/jeu/${donnees.id}`);

    } catch (err) {
      console.error('Erreur de chargement :', err);
      setErreur("Impossible de charger le niveau. Vérifie l'API.");
    } finally {
      setChargement(false);
    }
  };
  
  const chargerClassement = async (idNiveau = null, limite = 10) => {
    setChargement(true);
    setErreur(null);
    setClassement(null);

    let url = 'http://localhost:4000/api/highscores';
    const params = [];

    if (idNiveau !== null) params.push(`levelId=${idNiveau}`);
    params.push(`limit=${limite}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    try {
      const reponse = await fetch(url);

      if (!reponse.ok) throw new Error('Erreur lors du chargement du classement');

      const donnees = await reponse.json();
      setClassement(donnees);

    } catch (err) {
      console.error('Erreur de chargement du classement :', err);
      setErreur("Impossible de charger le classement. Vérifie l'API.");
    } finally {
      setChargement(false);
    }
  };

  const demarrerJeu = () => {
    if (nomJoueur.trim()) {
      chargerNiveau(1);
    }
  };

  const afficherNiveaux = () => {
    if (nomJoueur.trim()) {
      navigate('/levels');
    }
  };

  const selectionnerNiveau = (id) => {
    chargerNiveau(id);
  };

  const finirPartie = (resultat) => {
    setResultatPartie(resultat);
    setClassement(null);
    navigate('/score');
  };

  const rejouer = () => {
    if (niveau?.id) {
      chargerNiveau(niveau.id);
    } else {
      navigate('/');
    }
  };

  const afficherClassement = (idNiveau = null) => {
    setResultatPartie(null);
    chargerClassement(idNiveau);
    navigate('/score');
  };

  const valeursContexte = {
    nomJoueur,
    setNomJoueur,
    niveau,
    joueurPos,
    setJoueurPos,
    resultatPartie,
    classement,
    chargement,
    erreur,
    demarrerJeu,
    afficherNiveaux,
    selectionnerNiveau,
    finirPartie,
    rejouer,
    retournerAccueil,
    chargerNiveau,
    afficherClassement,
    chargerClassement
  };

  return (
    <JeuContext.Provider value={valeursContexte}>
      {children}
    </JeuContext.Provider>
  );
}

export default JeuContext;