const mongoose = require("mongoose");

const mealTypeSchema = new mongoose.Schema({
  mealtype_id: Number,
  mealtype: String,
  content: String,
  meal_image: String,
});

const MealType = mongoose.model("MealType", mealTypeSchema);
module.exports = MealType;
