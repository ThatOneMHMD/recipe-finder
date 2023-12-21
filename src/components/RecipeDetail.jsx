import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import '../assets/css/RecipeSearch.css';
import '../assets/css/RecipeDetail.css';


const RecipeDetail = () => {

  const app_id = process.env.REACT_APP_ID;
  const app_key = process.env.REACT_APP_KEY;


  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favBtnClicked, setFavBtnClicked] = useState(false);
  const [similarRecipes, setSimilarRecipes] = useState('');
  
  // State to store the checked status of each checkbox for each recipe
  const [checkedIngredients, setCheckedIngredients] = useState(() => {
    // Initialize based on local storage or default to all unchecked
    return JSON.parse(localStorage.getItem('checkedIngredients')) || [];
  });


  // nothing special but just src is too frkn long hence needed a separate const to not ruin the code down there!
  const noImgSrc = "data:image/png;base64,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";







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




  // Not Working as of now!!!! FIX later !!!!!!!!!!! Think about using favourites since they are "permanent" unless user deletres them...
  // Function to handle checkbox clicks for a specific recipe index
  const handleCheckboxChange = (ingredientIndex) => {

    // this is not working yet...


    
    // // Retrieve the selected recipe index from local storage
    // const selectedRecipeIndex = localStorage.getItem('recipeIndex');

    // // Toggle the checked status for the clicked checkbox for the specified recipe
    // setCheckedIngredients((prevCheckedIngredients) => {
    //   const recipeKey = `recipe-${selectedRecipeIndex}`;
    //   const recipeCheckedIngredients = prevCheckedIngredients[recipeKey] || {};

    //   // Toggle the checked status for the clicked ingredient
    //   const updatedCheckedIngredients = {
    //     ...prevCheckedIngredients,
    //     [recipeKey]: {
    //       ...recipeCheckedIngredients,
    //       [ingredientIndex]: !recipeCheckedIngredients[ingredientIndex],
    //     },
    //   };

    //   // Save the updated state to local storage
    //   localStorage.setItem('checkedIngredients', JSON.stringify(updatedCheckedIngredients));
    //   return updatedCheckedIngredients;
    // });



  };




 

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

  const similarRecipesLabel = selectedRecipe.recipe.label;
  console.log(similarRecipesLabel)




  // display the recipe list of recipes similar to the selected recipe
  const handleSimilarSearch = async (query) => {
    try {
      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}&from=0&to=100&imageSize=THUMBNAIL&imageSize=SMALL&imageSize=REGULAR&more=true&health=pork-free&health=alcohol-free`
      );

      // save the response to local storage
      localStorage.setItem('similarRecipesResponse', JSON.stringify(response.data.hits));
    

      setSimilarRecipes(response.data.hits);

    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSimilarSearchHandler = () => {
    handleSimilarSearch(similarRecipesLabel);
  }

  // useEffect(() => {
  //   handleSimilarSearch(similarRecipesLabel);

  //   console.log(similarRecipes)

  // }, []);


  // useEffect(() => {
  //   console.log('hi!')
  // }, []);




  // Save the selected recipe to Local Storage
  const handleSimilarRecipeClick = (recipeIndex) => {
    // Retrieve and parse the object from Local Storage
    const storedSimilarResponse = JSON.parse(localStorage.getItem('similarRecipesResponse'));
  
    // Check if the array and the element exist
    if (storedSimilarResponse && storedSimilarResponse[recipeIndex]) {

      // Access the recipe property: this is basically: response.data.hits[recipeIndex].recipe
      const selectedSimilarRecipe = storedSimilarResponse[recipeIndex];

      // Save the selected recipe to Local Storage
      localStorage.setItem('selectedRecipe', JSON.stringify(selectedSimilarRecipe));






      // add code to rereneder the page with the new recipe



    } else {
      console.log("Invalid recipe index or missing data.");
    }
  };



  // useEffect(() => {
  //   console.log('hi!')
  // }, []);




  return (
    <div className="detailed-recipe-container">

      <div className="detailed-recipe-card">
            
        <div className='detailed-recipeFront'>

          <div className='flex-row'>
            {selectedRecipe.recipe.image ? (
              <img 
                src={selectedRecipe.recipe.image} alt={selectedRecipe.recipe.label} 
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if 'noImgSrc' also fails to load
                  e.target.src = noImgSrc;
                  e.target.alt = 'No Image Screen...';
                }}
              />
            ) : (
              <img src={noImgSrc} alt="No Image Screen..." />
            )}
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

              {/* Not necessary for now */}
              {/* <p className='smallFont'> (beware: the checkboxes will be automatically reset when page is refreshed!) </p> */}



              {/* AT the moment, the checkboxes are not being saved after the page is refreshed. FIX later */}
              <ul>
                {selectedRecipe.recipe.ingredientLines.map((ingredient, index) => (
                  <li key={index} className="ingredient-checkbox">
                    <input
                      type="checkbox"
                      id={`ingredient-${index}`}
                      checked={checkedIngredients[`recipe-${index}`]?.[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <label htmlFor={`ingredient-${index}`}>{ingredient}</label>
                  </li>
                ))}
              </ul>


              
            </div>

          </div>

          <br /> <br />

          <div id='detailed-recipeSource'> 

            <p> See full recipe on: </p>  

            <a href={selectedRecipe.recipe.url} target="_blank" rel="noopener noreferrer">
              {selectedRecipe.recipe.source} 
            </a>

          </div>

        </div>


        <br /> <br />









        


        {/* needs rework: style and handleClick, and even auto rendering when compoenent loads should allow this to appear automatically instead of user clicking the button! ALSO, tune the query to choose a few key words from label instead of beiong too specific! Maybe cut words according to label words number... */}

        {/* show recipes similar to the chosen/selected one */}

        {/* This will be "display:none" for now until it's ready to be deployed! */}
        
        <div className="similar-recipe-list">
          {similarRecipes ? (
            similarRecipes.map((similarRecipe, index) => (
              <div className="recipe-card" value={index} key={similarRecipe.recipe.uri} onClick={() => handleSimilarRecipeClick(index)}>

                {/* The click does not rerender so the change is not apparent! */}
                <Link to={`/recipe/${index}`} key={similarRecipe.recipe.uri} >

                  <div className='recipeFront'>

                    {similarRecipe.recipe.image ? (
                      <img 
                        src={similarRecipe.recipe.image} alt={similarRecipe.recipe.label} 
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop if 'noImgSrc' also fails to load
                          e.target.src = noImgSrc;
                          e.target.alt = 'No Image Screen...';
                        }}
                      />
                    ) : (
                      <img src={noImgSrc} alt="No Image Screen..." />
                    )}

                    <h3 id='recipeLabel'>{similarRecipe.recipe.label}</h3>
                  </div>
                  <div className='suprificialInfo'>
                    <p>{similarRecipe.recipe.cuisineType} {similarRecipe.recipe.dishType}</p>
                    <div className='flex-row-border'>
                      <p id='calories'> {Math.round(similarRecipe.recipe.calories)} calories</p>
                      <p id='num-ingredients'> {similarRecipe.recipe.ingredients.length} ingredients </p>
                    </div>
                    <p id='recipeSource'>
                      <a href={similarRecipe.recipe.url} target="_blank" rel="noopener noreferrer">
                        {similarRecipe.recipe.source}
                      </a>
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div id='available-similar-recipes'>
              <p>No similar recipes available at the moment.</p>

              {/* if this button is staying here, allow for a loading pic!!! */}
              <button onClick={handleSimilarSearchHandler}> Similar Recipes</button>
            </div>
          )}
        </div>




      </div>

    </div>
  );

  
};

export default RecipeDetail;
