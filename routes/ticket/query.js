function insertTicket(id_persona, prioridad, tipo_atencion, fecha_c) {
    return {
        queryTicket: "INSERT INTO ticket (id_persona, prioridad, tipo_atencion, fecha_c) VALUES (?, ?, ?, ?)",
        valuesTicket: [id_persona, prioridad, tipo_atencion, fecha_c],
    };
}

function getTicket() {
    //ORDER BY t.id DESC
    return "SELECT CONCAT_WS(' ', p.nombre, p.apellido) as nombre, t.* FROM ticket t JOIN persona p on t.id_persona = p.id WHERE t.activo = 1";
}

function updateTicket(idticket) {
    return {
        queryTicket: "UPDATE ticket SET activo = 0 WHERE id = ?",
        valuesTicket: [idticket],
    };
}

function skipTicket(idticket) {
    return {
        queryTicket: "UPDATE ticket SET activo = 0, skip = 1 WHERE id = ?",
        valuesTicket: [idticket],
    };
}



module.exports = {
    insertTicket,
    getTicket,
    updateTicket,
    skipTicket
}