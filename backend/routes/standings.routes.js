const express = require("express");
const router = express.Router();
const { getStandingsPre } = require("../services/firestore.service");

router.get("/pre", async (req, res) => {
  try {
    const data = await getStandingsPre();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error obteniendo standings" });
  }
});

module.exports = router;
