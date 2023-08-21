import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cookingTime: { type: Number, required: true },
    userOwner: { type: mongoose.Schema.Types.ObjectId, ref: "users", require: true },
});

//recipes is name of the collection in database
export const RecipeModel = mongoose.model("recipes", RecipeSchema)