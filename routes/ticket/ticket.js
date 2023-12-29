const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/query");
const msj = require("../../templates/messages");
const { getTicket, skipTicket } = require("./query");


module.exports = (io) => {
    router.get("/get", (req, res) => {
        queryDatabase(getTicket())
            .then((results) => {
                res.send(results);
            })
            .catch((err) => {
                res.status(500).send({ message: errorQuery });
            });
    });


    router.delete("/delete/:id", async (req, res) => {
        const id = req.params.id;
    
        try {
          const deleteQuery = skipTicket(id);
          const result = await queryDatabase(deleteQuery.queryTicket, deleteQuery.valuesTicket);
    
          if (result.affectedRows === 0) {
            res.status(404).send({ message: msj.notFound });
          } else {
            io.emit('lobby', '');
            io.emit('cola', '');
            res.status(200).send({ message: msj.successDelete });
          }
        } catch (err) {
          console.log(err)
          res.status(500).send({ message: msj.errorQuery });
        }
      });
    return router;
}
