import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { JeuProvider } from './context/ContexteJeu'; 

import Accueil from './components/Accueil';
import ChoixNiveau from './components/ChoixNiveau';
import Jeu from './components/Jeu';
import Score from './components/Score';

function App() {
  return (
    <Router>
      <JeuProvider>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/levels" element={<ChoixNiveau />} />
          <Route path="/jeu/:levelId" element={<Jeu />} /> 
          <Route path="/score" element={<Score />} />
        </Routes>
      </JeuProvider>
    </Router>
  );
}

export default App;
