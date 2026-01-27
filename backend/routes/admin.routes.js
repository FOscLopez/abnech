const express = require("express");
const router = express.Router();

const {
  getFixturesByCategory,
} = require("../services/fixtures.service");

const {
  updateFixture,
  createFixture,
} = require("../services/admin.service");

/* ================== GET FIXTURES POR CATEGORIA ================== */
router.get("/fixtures/:categoryId", async (req, res) => {
  try {
    const data = await getFixturesByCategory(req.params.categoryId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo fixtures" });
  }
});

/* ================== CREAR NUEVO FIXTURE ================== */
router.post("/fixtures", async (req, res) => {
  try {
    const data = await createFixture(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

/* ================== ACTUALIZAR FIXTURE ================== */
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
