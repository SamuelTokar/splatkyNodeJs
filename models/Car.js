const mongoose = require("mongoose");

// Definice schématu pro auto
const carSchema = new mongoose.Schema({
  name: String, // Název auta
  price: Number, // Cena auta
});

// Vytvoření modelu na základě schématu
const Car = mongoose.model("Car", carSchema);

module.exports = Car;
