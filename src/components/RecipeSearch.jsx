import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/RecipeSearch.css';

const RecipeSearch = () => {

  const app_id = process.env.REACT_APP_ID;
  const app_key = process.env.REACT_APP_KEY;

  const [query, setQuery] = useState('');
  const [offLineQuery, setOffLineQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [recipesCount, setRecipesCount] = useState('');
  const [from, setFrom] = useState(0);
  const [message, setMessage] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [apiCalls, setApiCalls] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(60); // Countdown in seconds
  const [apiLoading, setApiLoading] = useState(false);

  // for search history
  const [searchHistory, setSearchHistory] = useState([]);
  const maxHistoryItems = 10;
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  // const [lastExecutionTime, setLastExecutionTime] = useState(0);


  // health filters 
  const [selectedHealthFilters, setSelectedHealthFilters] = useState(['alcohol-free', 'pork-free']); 
  const healthFilterQuery = selectedHealthFilters.map((filter) => `health=${filter}`).join('&');

  // diet filters
  const [selectedDietFilters, setSelectedDietFilters] = useState([]); 
  const dietFilterQuery = selectedDietFilters.map((filter) => `diet=${filter}`).join('&');

  // mealType filters
  const [selectedMealTypeFilters, setSelectedMealTypeFilters] = useState([]); 
  const mealTypeFilterQuery = selectedMealTypeFilters.map((filter) => `mealType=${filter}`).join('&');

  // nothing special but just src is too frkn long hence needed a separate const to not ruin the code down there!
  const noImgSrc = "data:image/png;base64,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";


  // pass in query so that later on I can use the history item to run this func
  const handleSearch = async (query) => {

    if (query === undefined) {
      setQuery('chocolate chip cookies');
    }

    
    // Hide the search history dropdown when a history item is clicked
    setShowHistoryDropdown(false);

    // Set loading to true when starting the API call
    setApiLoading(true);

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

      // save the response to local storage
      localStorage.setItem('recipeResponse', JSON.stringify(response.data.hits));
      
      // save the entire response to local storage
      localStorage.setItem('dataResponse', JSON.stringify(response.data));

      // get the query (actually all data) from local storage
      const storedDataResponse = JSON.parse(localStorage.getItem('dataResponse'));

      // REMOVED THIS FOR NOW CUZ KEEPS CALLING API!! `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}&from=0&to=100&more=true&health=pork-free&health=alcohol-free&${healthFilterQuery}&${dietFilterQuery}`

      setRecipes(response.data.hits);
      setRecipesCount(response.data.count);
      setApiCalls((prevApiCalls) => prevApiCalls + 1);

      if(storedDataResponse){
        setQuery(storedDataResponse.q);
        setOffLineQuery(storedDataResponse.q)
      }

      

      // Set loading to false when the API call is successful
      setApiLoading(false);

      if (query !== undefined) {
        // for search history: add the query to the search history array
        if (query.trim() !== '' && !searchHistory.includes(query)) {
          const updatedHistory = [query, ...searchHistory.slice(0, maxHistoryItems - 1)];
          localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
          setSearchHistory(updatedHistory);
        }
      }
      
      


      
      // This list of logs helps view the data structure of the API response; very important to know what you are working with!
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
      // Set loading to false when there's an error in the API call
      setApiLoading(false);

    }
  };

  // handleSeach but for Button since it cannot take in a parameter
  const handleSearchBtn = async () => {
    handleSearch(query);
  }

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
    const storedResponse = JSON.parse(localStorage.getItem('recipeResponse'));
    const storedDataResponse = JSON.parse(localStorage.getItem('dataResponse'));
    
    if (storedResponse) {
      setRecipes(storedResponse);
      setApiLoading(false);

      if (storedDataResponse) {
        setQuery(storedDataResponse.q);
      }

      return;
    }

    


    handleSearch(query);
    console.log(from)
  }, [from]);

  useEffect(() => {

    if (query === undefined) {
      setQuery('chocolate chip cookies');
    }

    const storedResponse = JSON.parse(localStorage.getItem('recipeResponse'));
    const storedDataResponse = JSON.parse(localStorage.getItem('dataResponse'));
    const storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    if (storedResponse) {
      setRecipes(storedResponse);
      setApiLoading(false);
      if (storedDataResponse) {
        setOffLineQuery(storedDataResponse.q)
      }
      setSearchHistory(storedSearchHistory);
      return;
    }

    // Load recipes when the component mounts
    handleSearch(query);

    // Cleanup the message when the component unmounts
    return () => clearTimeout();
  }, []);

  // Save the selected recipe to Local Storage
  const handleRecipeClick = (recipeIndex) => {
    // Retrieve and parse the object from Local Storage
    const storedResponse = JSON.parse(localStorage.getItem('recipeResponse'));
  
    // Check if the array and the element exist
    if (storedResponse && storedResponse[recipeIndex]) {

      // Access the recipe property: this is basically: response.data.hits[recipeIndex].recipe
      const selectedRecipe = storedResponse[recipeIndex];

      // Save the selected recipe to Local Storage
      localStorage.setItem('selectedRecipe', JSON.stringify(selectedRecipe));

      // Save the recipe index to Local Storage
      localStorage.setItem('recipeIndex', JSON.stringify(recipeIndex));
      
    } else {
      console.log("Invalid recipe index or missing data.");
    }
  };

  // Save the scroll position when the component unmounts (it seems that sessionStorage does not work here)
  useEffect(() => {
    if (recipes.length) {
      const scrollPosition = localStorage.getItem('scrollPosition');
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        localStorage.removeItem('scrollPosition');
      }
    }
  }, [recipes]);

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

  // for search history
  useEffect(() => {
    const storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(storedSearchHistory);
  }, []);

  // useEffect(() => {
  //   localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  // }, [searchHistory]);

  const handleInputClick = () => {
    const storedSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (storedSearchHistory.length === 0) {
      setShowHistoryDropdown(false);
    } else{
      // Show the search history dropdown when the input is clicked
      setShowHistoryDropdown(true); 
    }
  };

  const handleInputBlur = () => {
    // Delay execution by 1 second
    setTimeout(() => {
      // Do not show the search history dropdown when user clicks away from the input
      setShowHistoryDropdown(false);
    }, 250);

  };





  useEffect(() => {
    // Log the updated query value
    console.log(query);
  }, [query]);

  // When clicking on a history item, set the query and run the search (Add one to only change query but not run search!)
  const handleHistoryClick = (item) => {

    // Move the clicked item to the top of the history
    const updatedHistory = [item, ...searchHistory.filter((historyItem) => historyItem !== item)];

    setSearchHistory(updatedHistory);

    setQuery(item);

    // setQuery(item, handleSearch ());




    // THIs is still not working. Maybe use HandleSearch(item) instead of just handleSearch()? Think of a better way. ORORORORO, just make do without it, as in let the history click allow the query and text iside input to change then they click on handleSearch manually!!!





    

    // // Run the search (I had it as handleSearch(item) but it was causing lots of issues!))
    handleSearch(item);

    // Hide the search history dropdown when a history item is clicked
    setShowHistoryDropdown(false);

    console.log(query)
  };

  // useEffect(() => {

  //   // Check if the function can be executed based on the refractory period (2 seconds in this example)
  //   const currentTime = new Date().getTime();
  //   if (currentTime - lastExecutionTime >= 5000) {
  //     // Update the last execution time
  //     setLastExecutionTime(currentTime);

  //     console.log('function called....')
  //     handleSearch();
  //   }

  // }, [searchHistory]);


  

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

        {/* ADD a TRANSLATION API!!!!!! */}






        <form className='flex-center' onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}>
          <input
            className='searchbar-input'
            type="text"
            placeholder={query ? query : "Enter Recipe Name"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
          />

          {/* Render the search history dropdown only if it should be visible */}
          {showHistoryDropdown && (
            <div className="searchHistoryDropdown">
              <div className='searchHistoryDropdown-content'>
                <ul>
                  {searchHistory.map((item, index) => (
                    <li key={index} onClick={() => {
                      handleHistoryClick(item);
                    }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </form>
        

        <button onClick={handleSearchBtn} disabled={disableButton} className={disableButton ? 'button-disabled' : 'searchBtn'}>
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
              <button onClick={handleSearchBtn} disabled={disableButton} className={disableButton ? 'button-disabled' : 'apply-filters-Btn'}>
                {disableButton ? `Wait ${countdown}s` : 'Apply Filters'}
              </button>
            </div>





          </div>
          


        )}

        
      </div>


      {apiLoading && (
        <div className="loading-container">
         <img src="https://png.pngtree.com/png-vector/20220705/ourmid/pngtree-loading-icon-vector-transparent-png-image_5687537.png" alt="Loading Screen..." />
        </div>
      )}
      
      
      

      {/* useless since I do not have access to them all! I can only access 100! */}
      {/* <h5>{recipesCount >= 9999 ? `more than ${recipesCount} recipes found!` : `${recipesCount} recipes found!`}</h5> */}


      {apiLoading && query ? <h5>Searching...</h5> : <h5>{`${recipes.length} ${offLineQuery} recipes found!`}</h5>}

      {recipes.length === 0 ? (
        // Render this if the array is empty
        <div>
          
          <h5>We couldn't find any matches for "{offLineQuery}"</h5>
          <h5>Double check your search for any typos or spelling errors - or try a different search term!</h5>

          <br />

          {/* add a picture of a chef scratching head or shrugging etc. */}
          
        </div>
      ) : ('')}


      <div className="recipe-list">

        {recipes.map((recipe, index) => (


          <div className="recipe-card" value={index} key={recipe.recipe.uri} onClick={() => handleRecipeClick(index)}>
            
            <Link to={`/recipe/${index}`} key={recipe.recipe.uri} onClick={() =>
                localStorage.setItem('scrollPosition', window.pageYOffset)
              }>
              
              <div className='recipeFront'>

                {/* If img does not exist, display 'no image' icon! */}
                {recipe.recipe.image ? (
                  <img 
                    src={recipe.recipe.image} alt={recipe.recipe.label} 
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if 'noImgSrc' also fails to load
                      e.target.src = noImgSrc;
                      e.target.alt = 'No Image Screen...';
                      handleSearchBtn(); // Run the API search
                    }}
                  />
                  
                ): (<img 
                      src={noImgSrc} 
                      alt="No Image Screen..." 
                      onLoad={handleSearchBtn} // Run the API search when 'noImgSrc' is displayed
                    />)}

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

            </Link>

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


// CheckPOINT!!

export default RecipeSearch;
