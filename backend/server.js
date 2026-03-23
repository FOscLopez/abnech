const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

/* =========================
   GET FIXTURE
========================= */
app.get("/api/fixture", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync("./data/fixture.json", "utf-8")
  );
  res.json(data);
});

/* =========================
   POST RESULTADO (ADMIN FUTURO)
========================= */
app.post("/api/result", (req, res) => {
  const newResult = req.body;

  const data = JSON.parse(
    fs.readFileSync("./data/fixture.json", "utf-8")
  );

  data.results.push(newResult);

  fs.writeFileSync(
    "./data/fixture.json",
    JSON.stringify(data, null, 2)
  );

  res.json({ message: "Resultado agregado" });
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});