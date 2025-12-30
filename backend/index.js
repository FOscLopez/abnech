const express = require("express");
const cors = require("cors");

const standingsRouter = require("./services/standings.routes");

const app = express();

/* =======================
   CORS – SOLUCIÓN REAL
======================= */
app.use(
  cors({
    origin: "*", // luego si querés lo limitamos
    methods: ["GET"],
  })
);

app.use(express.json());

/* =======================
   RUTAS
======================= */
app.use("/api/standings", standingsRouter);

/* =======================
   START
======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
