const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/admin.routes");
const fixturesRoutes = require("./routes/fixtures.routes");
const standingsRoutes = require("./routes/standings.routes");

const app = express();

/* ================== MIDDLEWARE ================== */

// CORS
app.use(cors());

// 👇 ESTO ES LO QUE FALTABA (CLAVE)
app.use(express.json());

/* ================== ROUTES ================== */

app.use("/api/admin", adminRoutes);
app.use("/api/fixtures", fixturesRoutes);
app.use("/api/standings", standingsRoutes);

/* ================== ROOT ================== */

app.get("/", (req, res) => {
  res.send("ABNECH API OK");
});

/* ================== SERVER ================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
