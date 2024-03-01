const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: Number,
  name: String,
  email: String,
  address: String,
  phone: Number,
  cost: Number,
  menuItem: [Number, Number, Number],
  status: String,
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
