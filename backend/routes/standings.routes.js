const express = require("express");
const router = express.Router();

const {
  getStandingsByCategory,
} = require("../services/firestore.service");

router.get("/:id", async (req, res) => {
  try {
    const data = await getStandingsByCategory(req.params.id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo standings" });
  }
});

module.exports = router;
