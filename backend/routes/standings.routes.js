const express = require("express");
const router = express.Router();

const { getStandingsPre } = require("../services/firestore.service");

router.get("/pre", async (req, res) => {
  try {
    const data = await getStandingsPre();
    res.json(data);
  } catch (err) {
    console.error("Error standings pre:", err);
    res.status(500).json({ error: "Error obteniendo standings" });
  }
});

module.exports = router;
