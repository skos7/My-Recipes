import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import imageBackground from '../assets/food1.jpg';
import { useGetUserID } from '../hooks/useGetUserID';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {

      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/${userID}`);
        setSavedRecipes(response.data.savedRecipes);
        console.log("dasdas!", response.data.savedRecipes);

      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedRecipes();
  }, []);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:3001/recipes/savedRecipes/${userID}/${recipeId}`);
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
      setSelectedRecipe(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Img Background */}
      <img
        src={imageBackground}
        alt="Background"
        className="absolute w-full h-full object-cover"
      />

      {/* Content */}
      <div className="flex justify-center items-center relative z-10 p-14">
        <h1 className="text-4xl font-bold text-white absolute top-0 left-0 right-0 mt-15 text-center">
          Spremljeni recepti
        </h1>        <ul className="border bg-white border-black">
          {savedRecipes.map((recipe) => (
            <li key={recipe._id} className="mb-4 p-6 border-4 border-black rounded">
              {/* {savedRecipes.includes(recipe._id) && <h1 className='text-xl font-semibold text-red-500'>Recept je već spemljen</h1>} */}
              <div className="text-center mb-2">
                <h2 className="text-xl font-semibold">{recipe.name}</h2>
              </div>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="mx-auto w-full h-96 object-cover rounded"
                onClick={() => openModal(recipe)}
              />
              <p className="text-center text-xl font-semibold">Vrijeme kuhanja: {recipe.cookingTime} (minuta)</p>
            </li>

          ))}
        </ul>
        {isModalOpen && selectedRecipe && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
            <div className="bg-white p-12 rounded-lg max-w-2xl w-full">
              <h2 className="text-3xl font-semibold mb-4">{selectedRecipe.name}</h2>
              <p className="mb-4">Sastojci: {selectedRecipe.ingredients.join(', ')}</p>
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.name}
                className="mx-auto w-full h-96 object-cover rounded"
              />
              <p className="mb-2">Postupak izrade jela: {selectedRecipe.instructions}</p>
              <p>Vrijeme pripreme (minute): {selectedRecipe.cookingTime}</p>
              <div className="flex justify-between">
                <button
                  className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Zatvori
                </button>
                <button
                  className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDeleteRecipe(selectedRecipe._id)}
                >
                  Izbriši
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedRecipes;
