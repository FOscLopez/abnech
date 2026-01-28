const express = require("express");
const router = express.Router();

const {
  getFixturesByCategory,
} = require("../services/fixtures.service");

const {
  updateFixture,
  createFixture,
  deleteFixture
} = require("../services/admin.service");

/* ================== GET ================== */

router.get("/fixtures/:categoryId", async (req, res) => {
  try {
    const data = await getFixturesByCategory(req.params.categoryId);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error obteniendo" });
  }
});

/* ================== CREATE ================== */

router.post("/fixtures", async (req, res) => {
  try {
    const data = await createFixture(req.body);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/* ================== UPDATE ================== */

router.put("/fixtures/:id", async (req, res) => {
  try {
    await updateFixture(req.params.id, req.body);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Error update" });
  }
});

/* ================== DELETE ================== */

router.delete("/fixtures/:id", async (req, res) => {
  try {
    await deleteFixture(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Error delete" });
  }
});

module.exports = router;
