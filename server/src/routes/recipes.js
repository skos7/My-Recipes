import express from 'express';
import { RecipeModel } from '../models/Recipes.js';
import { UserModel } from '../models/Users.js';
import { verifyToken } from './users.js';
// import multer from 'multer';
// import path from 'path';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({});
        res.json(response);
    } catch (err) {
        res.json(err);
    }
})

router.post("/", verifyToken, async (req, res) => {
    const recipe = new RecipeModel(req.body);
    try {
        const response = await recipe.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
})

router.put("/", verifyToken, async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
        res.json(err);
    }
})

router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (err) {
        res.json(err);
    }
})

router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({ _id: { $in: user.savedRecipes } });
        res.json({ savedRecipes });
    } catch (err) {
        res.json(err);
    }
})

router.delete("/savedRecipes/:userID/:recipeID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        if (!user) {
            return res.status(404).json({ error: 'Korisnik nije pronađen' });
        }

        const recipeIndex = user.savedRecipes.indexOf(req.params.recipeID);
        if (recipeIndex === -1) {
            return res.status(404).json({ error: 'Recept nije pronađen u Spremljeni recepti' });
        }

        user.savedRecipes.splice(recipeIndex, 1);
        await user.save();

        res.json({ message: 'Recept je izbrisan iz liste Spremljeni recepti' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads/') // Update the directory where you want to save the images
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const fileExtension = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
//     }
// });

// const upload = multer({ storage: storage });

// router.post("/uploadImage", verifyToken, upload.single('image'), (req, res) => {
//     try {
//         const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`; // Update with your server's URL and path
//         res.json({ imageUrl });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


export { router as recipesRouter };
