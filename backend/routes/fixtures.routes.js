const express = require("express");
const router = express.Router();

const { getFixturesByCategory } = require("../services/fixtures.service");

router.get("/:categoryId", async (req, res) => {
  try {
    const data = await getFixturesByCategory(req.params.categoryId);
    res.json(data);
  } catch (err) {
    console.error("Error fixtures:", err);
    res.status(500).json({ error: "Error obteniendo fixtures" });
  }
});

module.exports = router;
