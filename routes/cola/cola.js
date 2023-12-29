const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/query");
const msj = require("../../templates/messages");
const { getCola, getColaByIdUser, insertCola, deletePrevious } = require("./query");
const { updateTicket } = require("../ticket/query");
const { BoliviaTimeZone } = require("../../services/timezome")
module.exports = (io) => {

    router.get("/get", (req, res) => {
        queryDatabase(getCola())
            .then((results) => {
                res.send(results);
            })
            .catch((err) => {
                res.status(500).send({ message: errorQuery });
            });
    });

    router.get("/getByIdUser/:id", async (req, res) => {
        const iduser = req.params.id;
        try {
            const { query, values } = await getColaByIdUser(iduser);
            const results = await queryDatabase(query, values);
            res.send(results);
        } catch (err) {
            res.status(500).send({ message: errorQuery });
        }
    });
    
    router.post("/post", async (req, res) => {
        const { idusuario, idticket } = req.body;   
        const fecha_c = BoliviaTimeZone(new Date());
       
        try {

            const deleteQuery = await deletePrevious(idusuario);
            await queryDatabase(deleteQuery.queryTicket, deleteQuery.valuesTicket);

            const insertQuery = await insertCola(idusuario, idticket, fecha_c);                
            await queryDatabase(insertQuery.query, insertQuery.values);
            const updateQuery = await updateTicket(idticket);
            await queryDatabase(updateQuery.queryTicket, updateQuery.valuesTicket);
    
            io.emit('lobby', '');
            io.emit('cola', '');
            res.status(200).send({ message: msj.successPost });
        } catch (err) {
          console.log(err)
          res.status(500).send({ message: msj.errorQuery });
        }
      });
    return router;
}