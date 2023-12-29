const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/query");
const msj = require("../../templates/messages");
const { getTicket } = require("./query");


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
    return router;
}
