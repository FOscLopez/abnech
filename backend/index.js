const express = require("express");
const cors = require("cors");

const standingsRoutes = require("./routes/standings.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔹 Ruta raíz (para Render)
app.get("/", (req, res) => {
  res.send("ABNECH Backend OK");
});

// 🔹 API
app.use("/api/standings", standingsRoutes);

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
