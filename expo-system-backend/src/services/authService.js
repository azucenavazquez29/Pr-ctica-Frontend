const pool = require("../config/db");

const loginUser = async (username) => {
  const query = `
    SELECT
      u.id_usuario,
      u.username,
      u.password,
      r.nombre_rol
    FROM usuario u
    INNER JOIN rol r
      ON u.id_rol = r.id_rol
    WHERE u.username = $1
  `;

  const result = await pool.query(query, [username]);

  return result.rows[0];
};

module.exports = {
  loginUser,
};