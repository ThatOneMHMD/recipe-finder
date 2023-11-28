import React from 'react';
import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import '../assets/css/RecipeDetail.css';


const RecipeDetail = () => {

  // const { index } = useParams();

  const [favouriteRecipes, setFavouriteRecipes] = useState([]);

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [favBtnClicked, setFavBtnClicked] = useState(false);

  // on mount, retrieve the selected recipe from local storage tp dosplay it accordingly. Also, retrieve the favourite recipes from local storage and set the state with them
  useEffect(() => {
    // Retrieve the stored recipe from local storage
    const storedRecipe = JSON.parse(localStorage.getItem('selectedRecipe'));
    // Set the state with the retrieved recipe
    setSelectedRecipe(storedRecipe);


    // Retrieve favourite recipes from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('Favouriterecipes'));
    // Set the state with the retrieved favorites or an empty array if not found
    setFavouriteRecipes(storedFavorites || []);

  }, []);

 

  // add the loading effect for button later on, make it gray, unclickabhle etc.
  // add or remove the recipe from the favouriteRecipes array
  const handleFavourites = async () => {
    try {
      // Retrieve the stored recipe from local storage
      const storedRecipe = JSON.parse(localStorage.getItem('selectedRecipe'));
  
      if (!storedRecipe) {
        console.log('No stored recipe found.');
        return;
      }
    
      // check if the selectedRecipe is already in the favouriteRecipes array
      const isRecipeInFavorites = favouriteRecipes.some((favoriteRecipe) =>
        favoriteRecipe.recipe.label === storedRecipe.recipe.label
      );
    
      if (isRecipeInFavorites) {
        // The selectedRecipe is in the favoriteRecipes array
        console.log('Recipe has been removed from favorites!');
  
        const updatedFavorites = favouriteRecipes.filter(
          (favoriteRecipe) => favoriteRecipe.recipe.label !== storedRecipe.recipe.label
        );
  
        // remove the selectedRecipe from the favouriteRecipes array
        setFavouriteRecipes(updatedFavorites);
  
        // save the new favourite array to local storage
        localStorage.setItem('Favouriterecipes', JSON.stringify(updatedFavorites));

        setFavBtnClicked(false)

      } else {

        console.log('Recipe has been added to favorites!');

        // add the selectedRecipe to the favouriteRecipes array
        setFavouriteRecipes((prevFavorites) => [...prevFavorites, storedRecipe]);
  
        // save the new favourite array to local storage
        localStorage.setItem('Favouriterecipes', JSON.stringify([...favouriteRecipes, storedRecipe]));

        setFavBtnClicked(true)
      }
    } catch (error) {
      console.error('Error adding recipe to favourites:', error);
    }
  };

  // check if the selected recipe is in the favouriteRecipes array then allow the Button to display the correct text
  useEffect(() => {
    // Retrieve the stored recipe from local storage
    const storedRecipe = JSON.parse(localStorage.getItem('selectedRecipe'));
    // Set the state with the retrieved recipe
    setSelectedRecipe(storedRecipe);
  
    // Retrieve favourite recipes from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('Favouriterecipes')) || [];
    // Set the state with the retrieved favorites or an empty array if not found
    setFavouriteRecipes(storedFavorites);
  
    // Check if the current recipe is in favorites
    const isRecipeInFavorites = storedFavorites && storedFavorites.some((favoriteRecipe) =>
      favoriteRecipe.recipe.label === storedRecipe?.recipe.label
    );
    // Set the initial state of favBtnClicked
    setFavBtnClicked(isRecipeInFavorites);
  }, []);
  

  if (!selectedRecipe) {
    return (
      <div className="loading-container">
        <img src="https://png.pngtree.com/png-vector/20220705/ourmid/pngtree-loading-icon-vector-transparent-png-image_5687537.png" alt="Loading Screen..." />
      </div>
    );
  }

  // add more info? This shows the recipe data overall: if yes, choose something, if not, delete it
  // console.log(selectedRecipe.recipe)



  return (
    <div className="detailed-recipe-container">

      <div className="detailed-recipe-card">
            
        <div className='detailed-recipeFront'>

          <div className='flex-row'>
            <img src={selectedRecipe.recipe.image} alt={selectedRecipe.recipe.label} />
          </div>

          <div className='flex-column'>
            <h3  id='detailed-recipeLabel'>{selectedRecipe.recipe.label}</h3>

            <div className='textLeft'>
              <p> Meal Type: {selectedRecipe.recipe.mealType}</p>
              <p> Cuisine Type: {selectedRecipe.recipe.cuisineType}</p>
              <p> Dish Type: {selectedRecipe.recipe.dishType}</p>
              

            </div>

            {/* MAKE the button toggle ADD to Favourites or Remove from Fav */}
            <button onClick={handleFavourites} className={`favBtn ${favBtnClicked ? 'favBtn-unClicked' : ''}`} >

             {favBtnClicked ? '✓ Recipe Added!' : 'Save to Favourites'}  

            </button>

          </div>

        </div>

        <br /> <br />

        <div className='detailed-flex-row-border'>

          <div className='nutrition'> 

            <p>
             {selectedRecipe.recipe.yield}
            </p>
            
            <p>Servings</p> 

          </div>

          <div className='nutrition' id='detailed-calories'> 

            <p>
             {Math.round(selectedRecipe.recipe.calories/selectedRecipe.recipe.yield)} 
            </p>
          
            <p>
              calories per serving
            </p>

          </div>

        </div>


        <div className='detailed-suprificialInfo'>

          <div className='detailed-recipe-info'>

            <div className='detailed-recipe-healthLables'> 

              <p> Health Labels: </p> 

              <div>
                {selectedRecipe.recipe.healthLabels.map((healthLabel, index) => (
                  <span key={index}>
                    {index > 0 && ', '} {healthLabel}
                  </span>
                ))}
              </div>


            </div>
            
            <div className='detailed-recipe-ingredients'> 

              <p> {selectedRecipe.recipe.ingredients.length} Ingredients: </p>
            
              <ul>
                {selectedRecipe.recipe.ingredientLines.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>

              
            </div>

            

        

          </div>

          <div id='detailed-recipeSource'> 

            <p> For the preperation method and more info on the recipe, please click here: </p>  

            <a href={selectedRecipe.recipe.url} target="_blank" rel="noopener noreferrer">
              {selectedRecipe.recipe.source} 
            </a>

          </div>

        </div>

      </div>

    </div>
  );

  
};

export default RecipeDetail;
