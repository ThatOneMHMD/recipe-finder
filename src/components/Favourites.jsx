import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import '../assets/css/Favourites.css';
import '../assets/css/RecipeSearch.css';


const Favourites = () => {

  // nothing special but just src is too frkn long hence needed a separate const to not ruin the code down there!
  const noImgSrc = "data:image/png;base64,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";

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



      {/* Later add a CLEAR button to delete all favourite recipes, if needed */}


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

                {/* If img does not exist, display 'no image' icon! */}
                {favouriteRecipes.recipe.image ? (
                  <img 
                    src={favouriteRecipes.recipe.image} alt={favouriteRecipes.recipe.label} 
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if 'noImgSrc' also fails to load
                      e.target.src = noImgSrc;
                      e.target.alt = 'No Image Screen...';
                    }}
                  />
                  
                ): (<img src={noImgSrc} alt="No Image Screen..." />)}

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