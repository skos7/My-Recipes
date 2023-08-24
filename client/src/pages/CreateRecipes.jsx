import React, { useState } from 'react';
import imageBackground from '../assets/food2.jpg';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const CreateRecipes = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [base64, setBase64] = useState("");
  const [fileName, setFileName] = useState("");

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

  // const onSubmit = async (event) => {
  //   event.preventDefault();
  
  //   // First, handle the file upload to obtain the image URL
  //   const formData = new FormData();
  //   formData.append("image", selectedFile); // Replace 'selectedFile' with the actual variable where you stored the selected file
  
  //   try {
  //     const response = await axios.post("http://localhost:3001/recipes/uploadImage", formData, {
  //       headers: { authorization: cookies.access_token },
  //     });
      
  //     // Get the generated image URL from the response
  //     const imageUrl = response.data.imageUrl;
  
  //     // Create the recipe object with the image URL
  //     const updatedRecipe = {
  //       ...recipe,
  //       imageUrl: imageUrl,
  //     };
  
  //     // Make the POST request to create the recipe
  //     await axios.post("http://localhost:3001/recipes", updatedRecipe, {
  //       headers: { authorization: cookies.access_token },
  //     });
  
  //     alert("Recipe Created!");
  //     navigate("/");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const handleFileSubmit = (e) => {
  //   e.preventDefault();
  //   let data = {
  //     name: fileName,
  //     base64Data: base64
  //   };

  //   dispatch(CreateFile(data)).then((result) => {
  //     if (isFulfilled(result)) {
  //       handleFileReset();
  //     }
  //   });
  // }

  // const handleFileReset = () => {
  //   setFileName("");
  //   setBase64("");
  // }

  // const handleFileInput = (e) => {
  //   let file = e.target.files[0];
  //   if (file == null) return;
  //   setFileName(file.name);
  //   setSelectedFile(file); // Update the selectedFile state

  //   getBase64(file).then(result => {
  //     let base = result.split("base64,")[1];
  //     setBase64(base);
  //   });
  // }

  // const getBase64 = (file) => {
  //   return new Promise(resolve => {
  //     let baseURL = "";
  //     let reader = new FileReader();

  //     reader.readAsDataURL(file);

  //     reader.onload = () => {
  //       baseURL = reader.result;
  //       resolve(baseURL);
  //     };
  //   });
  // };

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
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              URL slike - copy image address(na web-u)
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              className="mt-1 p-2 border border-black rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleChange}
            />
          </div>
          {/* <div className="mb-4">
            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700">
              Choose File
            </label>
            <input
              type="file"
              id="fileInput"
              name="fileInput"
              className="mt-1 p-2 border border-black rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              onChange={(e) => handleFileInput(e)}
            />
            {fileName && (
              <div className="mt-2">
                <p>Selected File: {fileName}</p>
                <button onClick={handleFileSubmit} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                  Upload
                </button>
                <button onClick={handleFileReset} className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md">
                  Reset
                </button>
              </div>
            )}
          </div> */}
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
