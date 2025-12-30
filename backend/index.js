const express = require("express");
const cors = require("cors");

// ✅ RUTA CORRECTA
const standingsRoutes = require("./routes/standings.routes");

const app = express();

/* =====================
   CORS (NO ROMPE NADA)
===================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);

app.use(express.json());

/* =====================
   RUTAS API
===================== */
app.use("/api/standings", standingsRoutes);

/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
