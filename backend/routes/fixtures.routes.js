const express = require("express");
const router = express.Router();

const { getFixturesById } = require("../services/firestore.service");

// /api/fixtures/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getFixturesById(id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo fixture" });
  }
});

module.exports = router;
