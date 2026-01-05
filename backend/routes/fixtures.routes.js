const express = require("express");
const router = express.Router();

const { getFixturesByCategory } = require("../services/fixtures.service");

// /api/fixtures/:categoryId
router.get("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const data = await getFixturesByCategory(categoryId);
    res.json(data);
  } catch (err) {
    console.error("Error fixtures:", err);
    res.status(500).json({ error: "Error obteniendo fixtures" });
  }
});

module.exports = router;
