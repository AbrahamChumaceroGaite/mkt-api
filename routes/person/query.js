function getPerson() {
    return "SELECT p.* FROM persona p WHERE p.activo = 1";
}

function getPersonById(id) {
    return {
        query: "SELECT * FROM persona WHERE id = ?",
        values: [id],
    };
}

function insertPerson(nombre, apellido, telefono, colegio, representante, carrera, fecha_c) {
    nombre = nombre ? nombre.toString() : '';
    apellido = apellido ? apellido.toString() : '';
    telefono = telefono ? telefono.toString() : '';
    colegio = colegio ? colegio.toString() : '';
    representante = representante ? representante.toString() : '';
    carrera = carrera ? carrera.toString() : '';
    fecha_c = fecha_c ? fecha_c.toString() : '';
    
    return {
        query: "INSERT INTO persona (nombre, apellido, telefono, colegio, representante, carrera, fecha_c) VALUES (?, ?, ?, ?, ?, ?, ?)",
        values: [nombre, apellido, telefono, colegio, representante, carrera, fecha_c],
    };
}

function updatePerson(id, nombre, telefono, colegio, representante, carrera) {
    let query = "UPDATE persona SET ";
    const values = [];

    if (nombre !== undefined) {
        query += "nombre = ?, ";
        values.push(nombre);
    }
    if (telefono !== undefined) {
        query += "telefono = ?, ";
        values.push(telefono);
    }
    if (colegio !== undefined) {
        query += "colegio = ?, ";
        values.push(colegio);
    }
    if (representante !== undefined) {
        query += "representante = ?, ";
        values.push(representante);
    }
    if (carrera !== undefined) {
        query += "carrera = ?, ";
        values.push(carrera);
    }  

    query = query.slice(0, -1);
    query += " WHERE id = ?";
    values.push(id);

    return {
        query,
        values,
    };
}

function deletePerson(id) {
    return {
        query: "UPDATE persona SET activo = 0 WHERE id = ?",
        values: [id]
    };
}

function checkDuplicatePerson(telefono) {
    let query = "SELECT * FROM persona WHERE telefono = ?";
    const values = [telefono];

    return {
        query,
        values,
    };
}

function checkDuplicatePersonUpdate(nombre, telefono, colegio, representante, carrera, id = null) {
    let query = "SELECT * FROM persona WHERE ( ";
    const values = [];

    if (nombre) {
        query += "nombre = ? OR ";
        values.push(nombre);
    }
    if (telefono) {
        query += "telefono = ? OR ";
        values.push(telefono);
    }
    if (colegio) {
        query += "colegio = ? ";
        values.push(colegio);
    }
    if (representante) {
        query += "representante = ? ";
        values.push(representante);
    }
    if (carrera) {
        query += "carrera = ? ";
        values.push(carrera);
    }
    if (id !== null) {
        query += ") AND id <> ?";
        values.push(id);
    }

    return {
        query,
        values,
    };
}

module.exports = {
    getPerson,
    getPersonById,
    insertPerson,
    updatePerson,
    deletePerson,
    checkDuplicatePerson,
    checkDuplicatePersonUpdate
};