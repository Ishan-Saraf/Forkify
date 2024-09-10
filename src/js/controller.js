import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {

    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    // 1) Loading Recpie:
    
    await model.loadRecipe(id);

    // 2) Rendering Recipe:

    recipeView.render(model.state.recipe);
  }

  catch (err) {
    recipeView.renderError();
  }
};

const controlSecrchResults = async function () {
  try {
    resultsView.renderSpinner();

    //  1) Get Search Query:
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load Search Results:
    await model.loadSearchResults(query);

    // 3) Render Results:
    resultsView.render(model.getSearchResultsPage(1));

    // 4) Render initial pagination results:
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  // Update the recipe servings:
  model.updateServings(newServings);

  // Update the recipe view:
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSecrchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();