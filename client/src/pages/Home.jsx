import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import imageBackground from '../assets/food3.jpg';
import { useGetUserID } from '../hooks/useGetUserID';
import { useCookies } from 'react-cookie';

const Home = () => {

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
        console.log("RESPONSE", response.data)

      } catch (err) {
        console.error(err);
      }
    };

    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
        setSavedRecipes(response.data.savedRecipes);
        console.log("RESPONSE1", response.data)
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipe();
    fetchSavedRecipe();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      }, { headers: { authorization: cookies.access_token } });
      setSavedRecipes(response.data.savedRecipes);
      alert("Uspješno spremljen recept!")
    } catch (err) {
      console.error(err);
    }
  }

  const openModalForLoggedInUser = (recipe) => {
    if (userID) {
      setSelectedRecipe(recipe);
      setIsModalOpen(true);
    } else {
      // You can show an alert, a message, or redirect to the login page
      alert("Potrebno je biti prijavljen za vidjeti detalje recepta.");
    }
  };

  const isRecipeSaved = (id) => savedRecipes?.includes(id);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Img Background */}
      <img
        src={imageBackground}
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      {/* Content */}
      <div className="flex flex-col items-center relative p-14">
        <ul className="border bg-white border-black w-full md:max-w-4xl">
          {recipes.map((recipe) => (
            <li key={recipe._id} className="p-2 border-4 border-black rounded">
              <div className="text-center mb-2">
                <h2 className="text-2xl md:text-3xl font-semibold">{recipe.name}</h2>
              </div>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="mx-auto w-full h-auto md:h-96 object-cover rounded cursor-pointer"
                onClick={() => openModalForLoggedInUser(recipe)}
              />
              <p className="text-center text-lg md:text-xl font-semibold mt-2">
                Vrijeme kuhanja: {recipe.cookingTime} (minuta)
              </p>
              {userID && (
                <div className="mt-4 md:mt-6">
                  <button
                    onClick={() => saveRecipe(recipe._id)}
                    disabled={isRecipeSaved(recipe._id)}
                    className={`px-4 py-2 ${isRecipeSaved(recipe._id)
                      ? 'bg-gray-400 text-gray-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                      } rounded`}
                  >
                    {isRecipeSaved(recipe._id) ? 'Spremljeno' : 'Spremi'}
                  </button>
                </div>
              )}
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
              <p className="mb-2"><strong> Postupak izrade jela: </strong>{selectedRecipe.instructions}</p>
              <p><strong> Vrijeme pripreme: </strong>{selectedRecipe.cookingTime} min</p>
              <div className="flex justify-between mt-6">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Zatvori
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
