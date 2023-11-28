import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import '../assets/css/Favourites.css';
import '../assets/css/RecipeSearch.css';


const Favourites = () => {

  const [favouriteRecipes, setFavouriteRecipes] = useState([]);


  // on mount, retrieve the selected recipe from local storage tp dosplay it accordingly. Also, retrieve the favourite recipes from local storage and set the state with them
  useEffect(() => {

    // Retrieve favourite recipes from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('Favouriterecipes'));
    // Set the state with the retrieved favorites or an empty array if not found
    setFavouriteRecipes(storedFavorites || []);

  }, []);


  const handleRecipeClick = (recipeIndex) => {

  
    // Check if the array and the element exist
    if (favouriteRecipes && favouriteRecipes[recipeIndex]) {

      // Access the recipe property: this is basically: response.data.hits[recipeIndex].recipe
      const selectedRecipe = favouriteRecipes[recipeIndex];

      // Save the selected recipe to Local Storage
      localStorage.setItem('selectedRecipe', JSON.stringify(selectedRecipe));
      
    } else {
      console.log("Invalid recipe index or missing data.");
    }
  };


  return (
    <div className="favourite-container">


      {favouriteRecipes.length === 0 ? (
        // Render this if the array is empty
        <h5>No favorite recipes yet. Add some!</h5>
        ) : ('')
      }


      <div className="recipe-list">

        {favouriteRecipes.map((favouriteRecipes, index) => (


          <div className="recipe-card" value={index} key={favouriteRecipes.recipe.uri} onClick={() => handleRecipeClick(index)}>
            
            <Link to={`/recipe/${index}`} key={favouriteRecipes.recipe.uri}>
              
              <div className='recipeFront'>

                <img src={favouriteRecipes.recipe.image} alt={favouriteRecipes.recipe.label} />

                <h3 id='recipeLabel'>{favouriteRecipes.recipe.label}</h3>

              </div>

              <div className='suprificialInfo'>

                
                <p>{favouriteRecipes.recipe.cuisineType} {favouriteRecipes.recipe.dishType}</p>
                  
                

                <div className='flex-row-border'>
                  <p id='calories'> {Math.round(favouriteRecipes.recipe.calories)} calories</p>
                  <p id='num-ingredients'> {favouriteRecipes.recipe.ingredients.length} ingredients </p>
                </div>
        
                <p id='recipeSource'> 

                  <a href={favouriteRecipes.recipe.url} target="_blank" rel="noopener noreferrer">
                    {favouriteRecipes.recipe.source} 
                  </a>

                </p>

              </div>

            </Link>

          </div>


        ))}
      </div>










    </div>
  );

  
};

export default Favourites;