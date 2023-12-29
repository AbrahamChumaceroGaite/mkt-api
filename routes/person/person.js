const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../services/query");
const msj = require("../../templates/messages");
const { getPerson, getPersonById, insertPerson, updatePerson, deletePerson, checkDuplicatePerson, checkDuplicatePersonUpdate } = require("./query");
const { insertTicket } = require("../ticket/query");
const { BoliviaTimeZone } = require("../../services/timezome")
module.exports = (io) => {
  router.get("/get", (req, res) => {
    queryDatabase(getPerson())
      .then((results) => {
        res.send(results);
      })
      .catch((err) => {
        res.status(500).send({ message: errorQuery });
      });
  });

  router.get("/getById/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const { query, values } = await getPersonById(id);
      const results = await queryDatabase(query, values);
      res.send(results);
    } catch (err) {
      res.status(500).send({ message: errorQuery });
    }
  });

  router.post("/post", async (req, res) => {
    const { nombre, apellido, telefono, colegio, representante, carrera, prioridad, atencion } = req.body;

    
    console.log(req.body)
    const fecha_c = BoliviaTimeZone(new Date());
   
    try {
      const duplicateCheckQuery = await checkDuplicatePerson(telefono);
      const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

      if (duplicateCheckResult.length > 0) {
        res.status(400).send({ message: msj.duplicatedUser });
      } else {
        const insertQuery = await insertPerson(nombre, apellido, telefono, colegio, representante, carrera, fecha_c);
        const idPerson = await queryDatabase(insertQuery.query, insertQuery.values);
        const id_persona = idPerson.insertId;

        const insertTicketQuery = insertTicket(id_persona, prioridad, atencion, fecha_c);

        await queryDatabase(insertTicketQuery.queryTicket, insertTicketQuery.valuesTicket);

        io.emit('lobby', '');
        res.status(200).send({ message: msj.successPost });

      }
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { idlocation, name, lastname, ci, phone, email, idautor } = req.body;
    try {
      const duplicateCheckQuery = checkDuplicatePersonUpdate(ci, phone, email, id);
      const duplicateCheckResult = await queryDatabase(duplicateCheckQuery.query, duplicateCheckQuery.values);

      if (duplicateCheckResult.length > 0) {
        res.status(400).send({ message: msj.duplicatedPerson });
        return;
      }

      const updateQuery = updatePerson(id, idlocation, name, lastname, ci, phone, email, idautor);
      await queryDatabase(updateQuery.query, updateQuery.values);
      res.status(200).send({ message: msj.successPut });
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
      const deleteQuery = deletePerson(id);
      const result = await queryDatabase(deleteQuery.query, deleteQuery.value);

      if (result.affectedRows === 0) {
        res.status(404).send({ message: msj.notFound });
      } else {
        res.status(200).send({ message: msj.successDelete });
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: msj.errorQuery });
    }
  });

  return router;
}

