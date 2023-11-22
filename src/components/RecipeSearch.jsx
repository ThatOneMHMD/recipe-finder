import React, { useState, useEffect } from 'react';
// import { BrowserRouter as useHistory } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/RecipeSearch.css';

const RecipeSearch = () => {

  const app_id = process.env.REACT_APP_ID;
  const app_key = process.env.REACT_APP_KEY;

  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [recipesCount, setRecipesCount] = useState('');
  const [from, setFrom] = useState(0);
  const [message, setMessage] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [apiCalls, setApiCalls] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(60); // Countdown in seconds

  // health filters 
  const [selectedHealthFilters, setSelectedHealthFilters] = useState(['alcohol-free', 'pork-free']); 
  const healthFilterQuery = selectedHealthFilters.map((filter) => `health=${filter}`).join('&');

  // diet filters
  const [selectedDietFilters, setSelectedDietFilters] = useState([]); 
  const dietFilterQuery = selectedDietFilters.map((filter) => `diet=${filter}`).join('&');

  // mealType filters
  const [selectedMealTypeFilters, setSelectedMealTypeFilters] = useState([]); 
  const mealTypeFilterQuery = selectedMealTypeFilters.map((filter) => `mealType=${filter}`).join('&');





  const handleSearch = async () => {

    // Handle the API call limit. Note that we could have just made use of the 'more' parameter in the API call, but I wanted to demonstrate how to handle the API call limit in another way. (ex: in the catch block, we could have checked if the error message was 'too many requests' and then set the countdown accordingly.)
    if (apiCalls >= 10) {
      setMessage('API call limit reached. Please try again later.');

      // Disable the button
      setDisableButton(true);

      // Start the countdown
      let countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // Clear the message and re-enable the button after the countdown
      setTimeout(() => {
        setMessage('');
        setDisableButton(false);
        setCountdown(60);
        clearInterval(countdownInterval);
        setApiCalls(0);
      }, countdown * 1000);

      return;
    }

    try {
      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}&from=0&to=100&imageSize=THUMBNAIL&imageSize=SMALL&imageSize=REGULAR&more=true&health=pork-free&health=alcohol-free&${healthFilterQuery}&${dietFilterQuery}&${mealTypeFilterQuery}`
      );

      // REMOVED THIS FOR NOW CUZ KEEPS CALLING API!! `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}&from=0&to=100&more=true&health=pork-free&health=alcohol-free&${healthFilterQuery}&${dietFilterQuery}`

      setRecipes(response.data.hits);
      setRecipesCount(response.data.count);
      setApiCalls((prevApiCalls) => prevApiCalls + 1);

      
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

  // fetch more recipes (at the moment useless since the max is 100 recipes per search  - 10 per minute) and I am getting them all!
  const handleMoreRecipes = async () => {
    try {

      // remove this and simple use the recipesCount state to determine if there are more recipes to fetch

      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}&from=${from}&to=${from+60}&more=true&health=alcohol-free&health=pork-free`
      );

      if (from + 60 < response.data.count) {


        // Increment the 'from' parameter by 60
        setFrom((prevFrom) => prevFrom + 60);

      } else {
        setMessage('No more recipes');
  
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
    handleSearch();
    console.log(from)
  }, [from]);

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

  const toggleFilters = () => {
    setButtonClicked(!buttonClicked);
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    // Hide the filters on mobile
    const resizeHandler = () => {
      if (window.innerWidth <= 640) {
        setShowFilters(false);
      } else {
        setShowFilters(true);
      }
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const handleHealthFilterChange = (filter) => {
    // Toggle the selected state of the filter
    setSelectedHealthFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((f) => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  };

  const handleDietFilterChange = (filter) => {
    // Toggle the selected state of the filter
    setSelectedDietFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((f) => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  };

  const handleMealTypeFilterChange = (filter) => {
    // Toggle the selected state of the filter
    setSelectedMealTypeFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((f) => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  };



  return (
    <div>

      <div className='Searchbar-container'>

        <input
          className='searchbar-input'
          type="text"
          placeholder="Enter Recipe Name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={handleSearch} disabled={disableButton} className={disableButton ? 'button-disabled' : 'searchBtn'}>
          {disableButton ? `Wait ${countdown}s` : 'Search'}
        </button>   

      </div>

      {/* ADD the physical secondary navbar for HEALTH/DIET/CALORIE LIMIT, INGREDIENTS LIMIT, etc. MAKE SURE they get applied to the API CALL!!!! */}
      <div>
        <div className='flex-center'>
          <button onClick={toggleFilters} className={`toggle-filters-btn ${buttonClicked ? 'toggle-button-clicked' : ''}`}>
            Filters
          </button>
        </div>

        {showFilters && (

          <div className="second-navbar">


            <div className='flex-center'>

              {/* Health Filters */}
              <div className="dropdown">
                <button className="dropbtn">Health Filter</button>
                <div id='health-dropdown-content' className="dropdown-content">
                  <ul>
                    {/* Map through the health filter options */}
                    {[
                      'Alcohol-Cocktail',
                      'Alcohol-Free',
                      'Celery-Free',
                      'Crustcean-Free',
                      'Dairy-Free',
                      'DASH',
                      'Egg-Free',
                      'Fish-Free',
                      'FODMAP-Free',
                      'Gluten-Free',
                      'Immuno-Supportive',
                      'Keto-Friendly',
                      'Kidney-Friendly',
                      'Kosher',
                      'Low Potassium',
                      'Low Sugar',
                      'Lupine-Free',
                      'Mediterranean',
                      'Mollusk-Free',
                      'Mustard-Free',
                      'No oil added',
                      'Paleo',
                      'Peanut-Free',
                      'Pescatarian',
                      'Pork-Free',
                      'Red-Meat-Free',
                      'Sesame-Free',
                      'Shellfish-Free',
                      'Soy-Free',
                      'Sugar-Conscious',
                      'Sulfite-Free',
                      'Tree-Nut-Free',
                      'Vegan',
                      'Vegetarian',
                      'Wheat-Free',
                    ].map((filter) => (
                      <li key={filter}>
                        <input
                          type="checkbox"
                          id={filter}
                          name={filter}
                          checked={selectedHealthFilters.includes(filter.toLowerCase())}
                          onChange={() => handleHealthFilterChange(filter.toLowerCase())}
                        />
                        <label htmlFor={filter}>{filter}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Diet Filters */}
              <div className="dropdown">
                <button className="dropbtn">Dietary Filter</button>
                <div className="dropdown-content">
                  <ul>
                    {/* Map through the dietary filter options */}
                    {[
                      'Balanced',
                      'High-Fiber',
                      'High-Protein',
                      'Low-Carb',
                      'Low-Fat',
                      'Low-Sodium',
                    ].map((filter) => (
                      <li key={filter}>
                        <input
                          type="checkbox"
                          id={filter}
                          name={filter}
                          checked={selectedDietFilters.includes(filter.toLowerCase())}
                          onChange={() => handleDietFilterChange(filter.toLowerCase())}
                        />
                        <label htmlFor={filter}>{filter}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* MealType Filters */}
              <div className="dropdown">
                <button className="dropbtn">Meal Type Filter</button>
                <div className="dropdown-content">
                  <ul>
                    {/* Map through the mealType filter options */}
                    {[
                      'Breakfast',
                      'Brunch',
                      'Lunch/Dinner',
                      'Snack',
                      'Teatime',
                    ].map((filter) => (
                      <li key={filter}>
                        <input
                          type="checkbox"
                          id={filter}
                          name={filter}
                          checked={selectedMealTypeFilters.includes(filter.toLowerCase())}
                          onChange={() => handleMealTypeFilterChange(filter.toLowerCase())}
                        />
                        <label htmlFor={filter}>{filter}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>            


            <div>     
              <button onClick={handleSearch} disabled={disableButton} className={disableButton ? 'button-disabled' : 'apply-filters-Btn'}>
                {disableButton ? `Wait ${countdown}s` : 'Apply Filters'}
              </button>
            </div>





          </div>
          


        )}

        
      </div>
      
      
      
      
      

      







      {/* useless since I do not have access to them all! I can only access 100! */}
      {/* <h5>{recipesCount >= 9999 ? `more than ${recipesCount} recipes found!` : `${recipesCount} recipes found!`}</h5> */}

      <h5>{`${recipes.length} recipes found!`}</h5>


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
      {/* This is useless for now! Need to pay and get more recipe results per call to make this meaningful! */}
      {/* <button onClick={handleMoreRecipes}> More Recipes </button> */}

      <p>{message}</p>

    </div>
  );
};

export default RecipeSearch;
