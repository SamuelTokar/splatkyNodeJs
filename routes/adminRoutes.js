const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const session = require("express-session");
const bcrypt = require("bcrypt");

const adminPasswordHash = bcrypt.hashSync("heslo", 10);

// Funkce pro ověření autentizace
function checkAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    return next(); // Pokračovat k dalšímu middleware nebo routě
  } else {
    res.redirect("/login-admin"); // Přesměrovat na přihlašovací stránku
  }
}

// Nastavení session
router.use(
  session({
    secret: "tajny_klic",
    resave: false,
    saveUninitialized: true,
  })
);

// Přihlášení administrátora
router.get("/login-admin", (req, res) => {
  res.render("login-admin");
});

// Porovnání hesla při přihlášení
router.post(
  "/login-compare",
  express.urlencoded({ extended: true }),
  (req, res) => {
    const { password } = req.body;

    // Ověření hesla
    if (bcrypt.compareSync(password, adminPasswordHash)) {
      req.session.isAuthenticated = true;
      res.redirect("/form-admin");
    } else {
      res.send("Nesprávné heslo");
    }
  }
);

// Zobrazení formuláře pro přidání auta
router.get("/form-admin", checkAuth, (req, res) => {
  res.render("form-admin");
});

// Zobrazení seznamu aut
router.get("/seznam-aut-admin", checkAuth, async (req, res) => {
  try {
    const cars = await Car.find();
    res.render("seznam-aut-admin", { cars });
  } catch (error) {
    console.error("Chyba při načítání aut:", error);
    res.status(500).send("Chyba při načítání aut!");
  }
});

// Přidání auta
router.post("/add-car", checkAuth, async (req, res) => {
  const { name, price } = req.body;
  const newCar = new Car({ name, price });

  try {
    await newCar.save();
    res.redirect("/seznam-aut-admin");
  } catch (error) {
    console.error("Chyba při ukládání auta:", error);
    res.status(500).send("Chyba při ukládání auta!");
  }
});

// Smazání auta
router.post("/delete/:id", checkAuth, async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.redirect("/seznam-aut-admin");
  } catch (error) {
    console.error("Chyba při mazání auta:", error);
    res.status(500).send("Chyba při mazání auta!");
  }
});

// Editace auta (GET)
router.get("/edit/:id", checkAuth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send("Auto nenalezeno.");
    }
    res.render("car-edit-admin", { car });
  } catch (error) {
    console.error("Chyba při načítání auta:", error);
    res.status(500).send("Chyba při načítání auta!");
  }
});

// Editace auta (POST)
router.post("/edit/:id", checkAuth, async (req, res) => {
  const { name, price } = req.body;

  try {
    await Car.findByIdAndUpdate(req.params.id, { name, price });
    res.redirect("/seznam-aut-admin");
  } catch (error) {
    console.error("Chyba při úpravě auta:", error);
    res.status(500).send("Chyba při úpravě auta!");
  }
});

module.exports = router;
