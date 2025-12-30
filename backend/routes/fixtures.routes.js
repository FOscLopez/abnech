const express = require("express");
const router = express.Router();

const { getFixtures } = require("../services/firestore.service");

router.get("/", async (req, res) => {
  try {
    const data = await getFixtures();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo fixtures" });
  }
});

module.exports = router;
