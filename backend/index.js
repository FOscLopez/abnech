const express = require("express");
const cors = require("cors");

const standingsRoutes = require("./routes/standings.routes");

const app = express();

/* =========================
   CORS — CONFIG CORRECTA
   (ESTO ES LO CLAVE)
========================= */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// IMPORTANTE para preflight
app.options("*", cors());

app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/api/standings", standingsRoutes);

/* =========================
   START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
