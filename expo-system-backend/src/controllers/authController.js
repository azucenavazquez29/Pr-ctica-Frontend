const bcrypt = require("bcryptjs");
const { loginUser } = require("../services/authService");
const { generateToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username y password requeridos",
      });
    }

    const user = await loginUser(username);

    if (!user) {
      return res.status(401).json({
        message: "Usuario no encontrado",
      });
    }

    // TEMPORAL:
    // luego meteremos bcrypt real

    if (password !== user.password) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id_usuario,
        username: user.username,
        rol: user.nombre_rol,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  login,
};