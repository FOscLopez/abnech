const express = require("express");
const router = express.Router();

const {
  getFixturesByCategory,
  updateFixture
} = require("../services/admin.service");

// GET fixtures
router.get("/fixtures/:categoryId", async (req, res) => {
  try {
    const data = await getFixturesByCategory(req.params.categoryId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error admin fixtures" });
  }
});

// UPDATE fixture
router.put("/fixtures/:id", async (req, res) => {
  try {
    await updateFixture(req.params.id, req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando fixture" });
  }
});

module.exports = router;
