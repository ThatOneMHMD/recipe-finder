import React, { useState, useEffect } from 'react';
// import { BrowserRouter as useHistory } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/RecipeSearch.css';

const RecipeSearch = () => {

  const app_id = process.env.REACT_APP_ID;
  const app_key = process.env.REACT_APP_KEY;
   
  const healthFilters = ['alcohol-free', 'pork-free']; // Add more filters as needed
  const healthFilterQuery = healthFilters.map((filter) => `health=${filter}`).join('&');

  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [recipesCount, setRecipesCount] = useState('');
  const [from, setFrom] = useState(0);
  const [message, setMessage] = useState('');

  const [apiCallsInLastMinute, setApiCallsInLastMinute] = useState(0);



  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}&from=${from}&to=${from+60}&more=true&${healthFilterQuery}`
      );

      setRecipes(response.data.hits);
      setRecipesCount(response.data.count);

      
      console.log(response.data.hits);
      console.log("//////////////////////////////////");
      console.log(response.data);
      console.log(response.data.count);
      console.log("//////////////////////////////////");
      console.log(response.data.hits[0].recipe.label);
      console.log(response.data.hits[0].recipe.image);
      console.log(response.data.hits[0].recipe.yield);
      console.log(response.data.hits[0].recipe.healthLabels);
      console.log(response.data.hits[0].recipe.ingredientLines);
      console.log(response.data.hits[0].recipe.mealType[0]);
      console.log(response.data.hits[0].recipe.cuisineType[0]);
      console.log(response.data.hits[0].recipe.dishType[0]);
      console.log(response.data.hits[0].recipe.url);


    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleMoreRecipes = async () => {
    try {
      if (apiCallsInLastMinute < 10) {
        const response = await axios.get(
          `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}&from=${from}&to=${from + 60}&more=true&health=alcohol-free&health=pork-free`
        );
  
        if (from + 60 < response.data.count) {
          // Increment the 'from' parameter by 60
          setFrom((prevFrom) => prevFrom + 60);

          console.log(from);
          
  
          // Increment the API calls counter
          setApiCallsInLastMinute((prevCalls) => prevCalls + 1);
  
          // Set a timer to reset the API calls counter after 1 minute
          setTimeout(() => {
            setApiCallsInLastMinute(0);
          }, 60000);
        } else {
          setMessage('No more recipes');
  
          // Clear the message after 3 seconds
          const timeoutId = setTimeout(() => {
            setMessage('');
          }, 3000);
        }
      } else {
        setMessage('API call limit reached. Please try again later.');
  
        // Clear the message after 3 seconds
        const timeoutId = setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error fetching more recipes:', error);
    }
  };
  

  // Use the useEffect hook to run the handleSearch function whenever the 'from' state changes
  useEffect(() => {
    if (apiCallsInLastMinute < 10) {
      setApiCallsInLastMinute((prevCalls) => prevCalls + 1);
      handleSearch();
      console.log(from);
    } else {
      setMessage('API call limit reached. Please try again later.');

      // Clear the message after 3 seconds
      const timeoutId = setTimeout(() => {
        setMessage('');
      }, 3000);

      // Reset the apiCallsInLastMinute after a minute
      setTimeout(() => {
        setApiCallsInLastMinute(0);
      }, 60000);
    }
  }, [from, apiCallsInLastMinute]);


  useEffect(() => {
    // Load recipes when the component mounts
    handleSearch();

    // Cleanup the message when the component unmounts
    return () => clearTimeout();
  }, []);

  // const history = useHistory();

  const handleRecipeClick = (recipeIndex) => {

    // work on this later!!!! COnnected to the recipeDetail component!!!!!!
    // history.push(`/recipe/${recipeIndex}`);

    console.log("this is work in progress...", recipeIndex)

  };

  return (
    <div>

      <h2>Recipe Search</h2>

      <input
        type="text"
        placeholder="Enter Recipe Name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      <br />

      <h5>{recipesCount >= 9999 ? `more than ${recipesCount} recipes found!` : `${recipesCount} recipes found!`}</h5>


      <div className="recipe-list">

        {recipes.map((recipe, index) => (


          <div className="recipe-card" value={index} key={recipe.recipe.uri} onClick={() => handleRecipeClick(index)}>

            <div className='recipeFront'>

              <img src={recipe.recipe.image} alt={recipe.recipe.label} />

              <h3 id='recipeLabel'>{recipe.recipe.label}</h3>

            </div>

            <div className='suprificialInfo'>

              
              <p>{recipe.recipe.cuisineType} {recipe.recipe.dishType}</p>
                
              

              <div className='flex-row-border'>
                <p id='calories'> {Math.round(recipe.recipe.calories)} calories</p>
                <p id='num-ingredients'> {recipe.recipe.ingredients.length} ingredients </p>
              </div>
      
              <p id='recipeSource'> 

                <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">
                  {recipe.recipe.source} 
                </a>

              </p>

            </div>

          </div>


        ))}
      </div>

      {/* add a timer to prevent this button from clicking more than 10 times per minute, this should be combined with the search button; together they cannot exceed 10 per minute */}
      <button onClick={handleMoreRecipes}> More Recipes </button>

      <p>{message}</p>

    </div>
  );
};

export default RecipeSearch;
