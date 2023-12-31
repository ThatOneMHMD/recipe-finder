import React from 'react'
import '../assets/css/NavBar.css';
import { Link, useLocation } from "react-router-dom";

// component is using destrucutred props from APP.js:
// - activeTab: Currently active tab name.
// - setActiveTab: Function to set the active tab.
const NavBar = ({ activeTab, setActiveTab }) => {

  // Get the current location using the useLocation hook
  const location = useLocation();

  // Function to check if a given link is active based on the current location
  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  // Function to check if the current location matches the default path
  const isDefaultPath = () => {
    return location.pathname === '/' || location.pathname === '/recipe-finder' || location.pathname === '/recipe-finder/' || location.pathname === '';
  }; 

  return (
    <div className='navbar-container'>

      {/* Later, consider adding users, then allow users to post their recipes. Add ads, and earn money. Pay users to post (from ads, like YT)... */}

      {/* ALSO add a Support/Contact tab to allow for email communications using Email.js,etc. */}

      {/* ALSO, add an About tan for the user to learn more about the app, developers, etc. */}

      {/* Also add another tab that would take the user's ingredients then show available recipes!! */}

      {/* Also, in the recipe list, when the no-image icon is rendered: apply a hover so that when user hovers it says try search again or reload page etc. (NO, no reload page, GitHub gets angry... and it crashes)*/}

      {/* Add icon to Title in nav? NOT WORKING... */}
      {/* <img src="../assets/images/chefHeadIcon.png" alt="!!!Recipe Finder Recipe" /> */}

      {/* ALSO, add a google translate to translate the search bar input into chosen lnaguage then to Eng, do search, get response, translate to chosen language, etc. */}




      
      <h1 className='headerTextWithShadow'>

        <Link to="/">
          Recipe Finder
        </Link>
        
      </h1>

      {/* Navigation links: set correct path corersponding to clicked link and make it the active tab then apply the active CSS class! */}
      <ul className="navbar-links">
        <li>
          <Link to="/recipeSearch" className={isLinkActive('/recipeSearch') || isDefaultPath() ? "active" : ""}>Recipes</Link>
        </li>

        <li>
          <Link to="/favourites" className={isLinkActive('/favourites') || isDefaultPath() ? "active" : ""}>Favourites</Link>
        </li>
        
        

      </ul>
    </div>
    
  )
}

export default NavBar
