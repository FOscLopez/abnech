const express = require("express");
const router = express.Router();

const {
  getFixturesByCategory,
} = require("../services/fixtures.service");

const {
  updateFixture,
} = require("../services/admin.service");

// GET fixtures
router.get("/fixtures/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const fixtures = await getFixturesByCategory(categoryId);
    res.json(fixtures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error cargando fixtures" });
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
