const express = require("express"); // Importujeme express pro vytváření routeru
const router = express.Router(); // Vytvoření instance routeru
const Car = require("../models/Car"); // Importujeme model pro auta
const nodemailer = require("nodemailer"); // Importujeme nodemailer pro odesílání e-mailů

// Získání seznamu aut
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find(); // Asynchronní dotaz na databázi pro načtení aut
    res.render("seznam-aut", { cars }); // Odeslání načtených aut do šablony
  } catch (error) {
    console.error("Chyba při načítání aut:", error); // Zpracování chyb
    res.status(500).send("Chyba při načítání aut!"); // Odeslání chybové zprávy
  }
});

// Zobrazení formuláře pro žádost
router.get("/zadost", (req, res) => {
  res.render("zadost"); // Odeslání šablony pro formulář
});

// Odeslání žádosti
router.post("/odeslat-zadost", async (req, res) => {
  // Přidání async pro asynchronní operace
  const { name, question } = req.body; // Získání dat z formuláře

  // Nastavení SMTP serveru pro Seznam.cz
  const transporter = nodemailer.createTransport({
    host: "smtp.seznam.cz",
    port: 465,
    secure: true, // Použití SSL/TLS
    auth: {
      user: "zkouskamaileru@seznam.cz", // Tvoje Seznam e-mailová adresa
      pass: "Zkouska123", // Tvoje heslo
    },
  });

  // Možnosti e-mailu
  const mailOptions = {
    from: "zkouskamaileru@seznam.cz", // Odesílatel
    to: "zkouskamaileru@seznam.cz", // Příjemce
    subject: `Nová otázka od ${name}`, // Předmět e-mailu
    text: `Jméno: ${name}\nOtázka: ${question}`, // Tělo e-mailu
  };

  try {
    // Odeslání e-mailu
    await transporter.sendMail(mailOptions); // Použití await pro asynchronní odeslání e-mailu
    res.send("Děkujeme za vaši žádost."); // Potvrzení pro uživatele
    // Nebo můžeš použít res.redirect("/dekujeme") pro přesměrování na jinou stránku
  } catch (error) {
    console.error("Chyba při odesílání e-mailu:", error); // Zpracování chyb
    res.status(500).send("Chyba při odesílání e-mailu: " + error); // Odeslání chybové zprávy
  }
});

module.exports = router; // Export routeru
