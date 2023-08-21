import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import videoBackground from '../assets/Homepage.mp4';
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

  // const openModal = (recipe) => {
  //   setSelectedRecipe(recipe);
  //   setIsModalOpen(true);
  // };

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
      // Or navigate to the login page
      // navigate('/auth'); // Import useNavigate from 'react-router-dom'
    }
  };

  const isRecipeSaved = (id) => savedRecipes?.includes(id);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Video Background */}
      <video className="absolute w-full h-full object-cover" autoPlay muted loop>
        <source src={videoBackground} type="video/mp4" />
      </video>

      {/* Content */}
      <div className="flex justify-center items-center relative z-10 p-14">
        <ul className="border bg-white border-black">
          {recipes.map((recipe) => (
            <li key={recipe._id} className="mb-4 p-6 border-4 border-black rounded">
              {/* {savedRecipes.includes(recipe._id) && <h1 className='text-xl font-semibold text-red-500'>Recept je već spemljen</h1>} */}
              <div className="text-center mb-2">
                <h2 className="text-xl font-semibold">{recipe.name}</h2>
              </div>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="mx-auto w-full h-96 object-cover rounded"
                style={{ cursor: 'pointer' }}
                onClick={() => openModalForLoggedInUser(recipe)} // Use the modified function here
              />
              <p className="text-center text-xl font-semibold">Vrijeme kuhanja: {recipe.cookingTime} (minuta)</p>
              {userID && (
                <div>
                  <button
                    onClick={() => saveRecipe(recipe._id)}
                    disabled={isRecipeSaved(recipe._id)}
                    className={`mt-6 px-4 py-2 ${isRecipeSaved(recipe._id) ? 'bg-gray-400 text-gray-600' : 'bg-red-500 text-white hover:bg-red-600'
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
