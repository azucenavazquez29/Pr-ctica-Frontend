const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id_usuario,
      username: user.username,
      rol: user.nombre_rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );
};

module.exports = {
  generateToken,
};