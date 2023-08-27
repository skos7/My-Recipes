import React, { useState } from 'react';
import imageBackground from '../assets/food2.jpg';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const url = "http://localhost:3001/uploads"

const CreateRecipes = () => {

  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const [postImage, setPostImage] = useState({ myFile: "" })

  const createPost = async (newImage) => {
    try {
      await axios.post(url, newImage)
    } catch (error) {
      console.log(error)
    }
  }

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  }

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = recipe.ingredients;
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  }

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
    console.log("RECIPE", recipe);
  }

  const removeIngredient = (index) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const splitIngredients = (ingredients) => {
    const halfLength = Math.ceil(ingredients.length / 2);
    const firstColumn = ingredients.slice(0, halfLength);
    const secondColumn = ingredients.slice(halfLength);
    return [firstColumn, secondColumn];
  };

  const [firstColumn, secondColumn] = splitIngredients(recipe.ingredients);

  const onSubmit = async (event) => {
    event.preventDefault();
    createPost(postImage);
    console.log("Uploaeded:", postImage);
    console.log("Submitting recipe:", recipe);
    try {
      await axios.post("http://localhost:3001/recipes", recipe, {
        headers: { authorization: cookies.access_token },
      });
      alert("Recipe Created!");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    console.log(base64);
    setPostImage({ ...postImage, myFile: base64 })
    setRecipe({ ...recipe, imageUrl: base64 });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className='absolute w-full h-full'>
        <h1 className="text-4xl font-bold text-white absolute top-0 left-0 right-0 mt-15 text-center">
          Kreiraj recept
        </h1>
        {/* Img Background */}
        <img
          src={imageBackground}
          alt="Background"
          className="absolute w-full h-full object-cover"
        />
      </div>
      <div className="absolute w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Naziv jela
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 border border-black rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4" >
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
              <div> Sastojci  <p className="text-red-500">polja "Sastojci" ne smiju ostati prazna</p></div>
            </label>
            <div className="flex">
              <div className="w-1/2 pr-2">
                {firstColumn.map((ingredient, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      name="ingredients"
                      value={ingredient}
                      onChange={(event) => handleIngredientChange(event, index)}
                      className="mt-1 p-2 border border-black rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-1/2 pl-2">
                {secondColumn.map((ingredient, index) => (
                  <div key={index + firstColumn.length} className="flex mb-2">
                    <input
                      type="text"
                      name="ingredients"
                      value={ingredient}
                      onChange={(event) => handleIngredientChange(event, index + firstColumn.length)}
                      className="mt-1 p-2 border border-black rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index + firstColumn.length)}
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={addIngredient} type="button" className="w-full bg-gradient-to-r from-red-500 to-indigo-500 text-white px-4 py-2 rounded-md hover:from-indigo-500 hover:to-red-500">
              Dodaj Sastojak
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
              Postupak izrade jela
            </label>
            <textarea
              name="instructions"
              id="instructions"
              className="mt-1 p-2 border border-black rounded-md w-full h-32 focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <input
              type="file"
              lable="Image"
              name="myFile"
              id='file-upload'
              accept='.jpeg, .png, .jpg'
              onChange={(e) => handleFileUpload(e)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">
              Vrijeme pripreme (minute)
            </label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              className="mt-1 p-2 border border-black rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-indigo-500 text-white px-4 py-2 rounded-md hover:from-indigo-500 hover:to-red-500"
          >
            Kreiraj recept
          </button>
        </form>
      </div>
    </div>
  );

}

export default CreateRecipes;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}