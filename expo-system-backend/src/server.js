require("dotenv").config();

const app = require("./app");

const pool = require("./config/db");

const PORT = process.env.PORT || 5050;

pool.connect()
  .then(() => {
    console.log("DB conectada correctamente");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error conectando DB");
    console.log(err);
  });