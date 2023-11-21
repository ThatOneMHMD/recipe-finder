import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState} from "react";
import './App.css';
import './index.css';
import RecipeSearch from './components/RecipeSearch';
import RecipeDetail from './components/RecipeDetail';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Favourites from './components/Favourites';


function App() {

  // This makes sure the default active tab is the "about" section
  const [activeTab, setActiveTab] = useState("RecipeSearch");

  


  return (

    <Router>

      <div className="App mainBackground">

        {/* pass in activeTab state */}
        <NavBar setActiveTab={setActiveTab} activeTab={activeTab} />
        

        <Routes>
          
          <Route path="/" element={<RecipeSearch />} />        
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="*" element={<RecipeSearch />} />

        </Routes>

        <Footer />

      </div>

    </Router>
  );
}

export default App;

// check