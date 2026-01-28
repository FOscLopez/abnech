const express = require("express");
const router = express.Router();

const {
  getFixturesByCategory,
} = require("../services/fixtures.service");

const {
  updateFixture,
  createFixture,
  deleteFixture,
} = require("../services/admin.service");

/* ================== GET ================== */
router.get("/fixtures/:categoryId", async (req, res) => {
  try {
    const data = await getFixturesByCategory(req.params.categoryId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo fixtures" });
  }
});

/* ================== POST ================== */
router.post("/fixtures", async (req, res) => {
  try {
    const data = await createFixture(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

/* ================== PUT ================== */
router.put("/fixtures/:id", async (req, res) => {
  try {
    await updateFixture(req.params.id, req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando fixture" });
  }
});

/* ================== DELETE (SOFT) ================== */
router.delete("/fixtures/:id", async (req, res) => {
  try {
    await deleteFixture(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error borrando fixture" });
  }
});

module.exports = router;
