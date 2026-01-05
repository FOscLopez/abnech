const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/admin.routes");
const standingsRoutes = require("./routes/standings.routes");
const fixturesRoutes = require("./routes/fixtures.routes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);


app.use("/api/admin", adminRoutes);
app.options("*", cors());
app.use(express.json());

// Standings
app.use("/api/standings", standingsRoutes);

// Fixtures (con id dinámico)
app.use("/api/fixtures", fixturesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
