const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
//Funcion para comparar contraseñas
function comparePassword(contrasena, hash) {
    return bcrypt.compareSync(contrasena, hash);
}

function getUser(ci) {
    return {
        query: `SELECT u.* FROM usuario u WHERE ci = ?`,
        value: [ci]
    };
}


function generateAuthToken(user) {
    const payload = {
        nombre: user.nombre,
        iduser: user.id
    };

    const options = {
        expiresIn: '1h', // Define la expiración del token (1 hora en este caso)
    };

    const secretKey = 'Omp4Bko8zb'; // Reemplaza esto con tu propia clave secreta

    const token = jwt.sign(payload, secretKey, options);
    return token;
}

module.exports = {
    getUser,
    comparePassword,
    generateAuthToken
};