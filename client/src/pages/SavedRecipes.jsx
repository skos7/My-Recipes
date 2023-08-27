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
      <div className="flex justify-center items-center relative p-14">
        <h1 className="text-4xl md:text-5xl font-bold text-white absolute top-0 left-0 right-0 text-center">
          Spremljeni recepti
        </h1>
        <ul className="border bg-white border-black w-full md:max-w-4xl">
          {savedRecipes.map((recipe) => (
            <li key={recipe._id} className="p-2 border-4 border-black rounded">
              {/* {savedRecipes.includes(recipe._id) && <h1 className='text-xl font-semibold text-red-500'>Recept je već spremljen</h1>} */}
              <div className="text-center mb-2">
                <h2 className="text-xl md:text-2xl font-semibold">{recipe.name}</h2>
              </div>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="mx-auto w-full h-auto md:h-96 object-cover rounded cursor-pointer"
                onClick={() => openModal(recipe)}
              />
              <p className="text-center text-lg md:text-xl font-semibold mt-2">
                Vrijeme kuhanja: {recipe.cookingTime} (minuta)
              </p>
            </li>
          ))}
        </ul>
        {isModalOpen && selectedRecipe && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full md:max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">{selectedRecipe.name}</h2>
              <p className="mb-4"> <strong>Sastojci:</strong> {selectedRecipe.ingredients.join(', ')}</p>
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.name}
                className="mx-auto w-full h-auto md:h-96 object-cover rounded"
              />
              <p className="mb-2"> <strong>Postupak izrade jela:</strong> {selectedRecipe.instructions}</p>
              <p><strong> Vrijeme pripreme:</strong> {selectedRecipe.cookingTime} min</p>
              <div className="flex justify-between mt-6">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Zatvori
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
