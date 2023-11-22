import React from 'react';

const RecipeDetail = ({ recipe }) => {

  // ADD a way to add recipes to a favorites list (maybe use local storage for now, then add a database later)
  

  return (
    <div className="individual-recipe">
      <img src={recipe.recipe.image} alt={recipe.recipe.label} />
      <h3>{recipe.recipe.label}</h3>
      <p>
        <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">
          View Recipe
        </a>
      </p>
      <p>
        <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">
          View Ingredients
        </a>
      </p>
      <p>
        <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">
          View Preparation
        </a>
      </p>
      <p>Health Labels: {recipe.recipe.healthLabels.join(', ')}</p>
      <p>Meal Type: {recipe.recipe.mealType.join(', ')}</p>
      <p>Cuisine Type: {recipe.recipe.cuisineType.join(', ')}</p>
      <p>Dish Type: {recipe.recipe.dishType.join(', ')}</p>
      <p>Ingredients: {recipe.recipe.ingredientLines.join(', ')}</p>
    </div>
  );

  
};

export default RecipeDetail;
