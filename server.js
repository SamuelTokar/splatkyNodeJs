const express = require("express"); // Importujeme express pro vytváření webového serveru
const app = express(); // Vytvoření instance express aplikace
const bodyParser = require("body-parser"); // Importujeme body-parser pro parsování těla požadavků
const mongoose = require("mongoose"); // Importujeme mongoose pro práci s MongoDB
const pagesRouter = require("./routes/pagesRoutes"); // Importujeme routy pro veřejné stránky
const adminRouter = require("./routes/adminRoutes"); // Importujeme routy pro administraci

// připojení MongoDB
mongoose.connect("mongodb://localhost/splatkydb");

// Middleware pro parsování URL-encoded dat (např. z formulářů)
app.use(bodyParser.urlencoded({ extended: true }));

// Nastavení motoru šablon na EJS
app.set("view engine", "ejs");

// Použití routeru pro veřejné stránky
app.use("/", pagesRouter);

// Použití routeru pro administraci
app.use("/", adminRouter);

// Spuštění serveru na portu 3000
app.listen(3000, () => {
  console.log("Server běží na portu 3000"); // Potvrzení, že server běží
});
