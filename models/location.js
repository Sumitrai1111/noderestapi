const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  location_id: Number,
  location_name: String,
  state_id: Number,
  state: String,
  country_name: String,
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
