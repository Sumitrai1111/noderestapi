const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Location = require("./models/location.js");
const Order = require("./models/order.js");
const Menu = require("./models/menu.js");
const Restaurant = require("./models/restaurant.js");
const MealType = require("./models/mealType.js");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //for parsing data from post request

main()
  .then((res) => {
    console.log("Connected To DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb+srv://developer111:vQlJ9j6vUbC4tqM5@cluster0.rqfhzo1.mongodb.net/?retryWrites=true");
}
//list of location
app.get("/location", async (req, res) => {
  const locations = await Location.find({});
  res.send(locations);
});

// list of restaurant with respect to city http://localhost:8080/restaurant?stateId=3 (with queryParams)
app.get("/restaurant", async (req, res) => {
  let stateId = req.query.stateId;
  let mealId = req.query.mealId;
  let query = {};
  if (stateId) {
    query = { state_id: stateId };
  } else if (mealId) {
    query = { "mealTypes.mealtype_id": mealId };
  } else {
    query = {};
  }
  let restaurant = await Restaurant.find(query);
  res.send(restaurant);
});

//fiter http://localhost:8080/filter/1?cuisineId=1  resturant wrt meal & cuisine
app.get("/filter/:mealId", async (req, res) => {
  let query = {};
  let sort = { cost: 1 };
  let mealId = req.params.mealId;
  let cuisineId = req.query.cuisineId;
  let lcost = req.query.lcost;
  let hcost = req.query.hcost;
  if (req.query.sort) {
    sort = { cost: req.query.sort };
  }

  if (lcost && hcost && cuisineId) {
    query = {
      "mealTypes.mealtype_id": mealId,
      $and: [{ cost: { $gt: lcost, $lt: hcost } }],
    };
  } else if (lcost && hcost) {
    query = {
      "mealTypes.mealtype_id": mealId,
      $and: [{ cost: { $gt: lcost, $lt: hcost } }],
    };
  } else if (cuisineId) {
    query = {
      "mealTypes.mealtype_id": mealId,
      "cuisines.cuisine_id": cuisineId,
    };
  } else {
    query = { "mealTypes.mealtype_id": mealId };
  }
  let restaurant = await Restaurant.find(query).sort(sort);
  res.send(restaurant);
});

//detail of restaurant
app.get("/details/:restaurantId", async (req, res) => {
  let restaurantId = req.params.restaurantId;
  let restaurant = await Restaurant.find({ restaurant_id: restaurantId });
  res.send(restaurant);
});

//restaurant with respect to menu
app.get("/menu/:id", async (req, res) => {
  let id = req.params.id;
  let result = await Menu.find({ restaurant_id: id });
  res.send(result);
});

//list of mealType
app.get("/meal", async (req, res) => {
  let meal = await MealType.find();
  res.send(meal);
});

//list of order or order with respect to email
app.get("/orders", async (req, res) => {
  let email = req.query.email;
  let query = {};
  if (email) {
    query = { email: email };
  }
  let orders = await Order.find(query);
  res.send(orders);
});

//placeorder
app.post("/placeOrder", (req, res) => {
  let { orderId, name, email, address, phone, cost, menuItem } = req.body;
  let order = new Order({
    orderId: orderId,
    name: name,
    email: email,
    address: address,
    phone: phone,
    cost: cost,
    menuItem: menuItem,
  });
  order
    .save()
    .then((res) => {
      console.log("Order Placed");
    })
    .catch((err) => {
      console.log(err);
    });
  res.send("Order Placed");
});

//menu details with respect to item
app.post("/menuItem", async (req, res) => {
  let { id } = req.body;
  if (Array.isArray(id)) {
    let menu = await Menu.find({ menu_id: { $in: id } });
    res.send(menu);
  } else {
    res.send("Invalid Input");
  }
});

//updateOrder
app.put("/updateOrder/:id", async (req, res) => {
  let { id } = req.params.id;
  let { status, bank_name, date } = req.body;
  let order = await Order.updateOne(
    { orderId: id },
    {
      $set: {
        status: status,
        bank_name: bank_name,
        date: date,
      },
    },
    { new: true }
  );
  console.log(order);
  res.send("Order Updated");
});

//delete order
app.delete("/deleteOrder/:id", async (req, res) => {
  //let { _id } = mongo.ObjectId(req.params.id);
  let id = req.params.id;
  let deletedOrder = await Order.deleteOne({ orderId: id });
  console.log(deletedOrder);
  res.send("Order Deleted");
});

app.listen(8080, () => {
  console.log("App on listning on port 8080 ");
});
