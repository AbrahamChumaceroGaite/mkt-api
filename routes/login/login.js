const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/query");
const msj = require("../../templates/messages");
const { generateAuthToken, getUser } = require("./query");

router.post('/access', async (req, res) => {
    console.log(req.body);
    const { ci } = req.body;
    try {
        const userQuery = getUser(ci);
        const [user] = await queryDatabase(userQuery.query, userQuery.value);
  
        if (user) {
            const token = await generateAuthToken({
                iduser: user.id,
                nombre: user.nombre,
            });
            res.json({
                token,
                iduser: user.id,
                nombre: user.nombre,
            });
        } else {
            res.status(500).json({ message: msj.loginNoUser });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: msj.errorQuery });
    }
  });

module.exports = router;
