const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const { verifyToken } = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API funcionando :))",
  });
});

app.get(
  "/api/v1/protected",
  verifyToken,
  (req, res) => {
    res.json({
      message: "Ruta protegida",
      user: req.user,
    });
  }
);

module.exports = app;