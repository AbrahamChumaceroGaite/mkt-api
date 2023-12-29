function getCola() {
    return "SELECT t.*, CONCAT_WS(' ', p.nombre, p.apellido) as cola, u.nombre FROM cola c JOIN ticket t ON c.id_ticket = t.id JOIN persona p ON t.id_persona = p.id JOIN usuario u ON c.id_usuario = u.id WHERE c.activo = 1 AND c.estado = 1";
}

function getColaByIdUser(idusuario) {
    return {
        query: 'SELECT t.*, p.* FROM cola c JOIN ticket t ON c.id_ticket = t.id JOIN persona p ON t.id_persona = p.id WHERE c.id_usuario =  ? AND c.estado = 1 AND c.activo = 1',
        values: [idusuario],
    };
}

function insertCola(idusuario, idticket, fecha_c) {
/*     idusuario = idusuario ? idusuario.toString() : '';
    idticket = idticket ? idticket.toString() : ''; */

    return {
        query: "INSERT INTO cola (id_ticket, id_usuario, fecha_c) VALUES (?, ?, ?)",
        values: [idticket, idusuario, fecha_c],
    };
}

function deletePrevious(idusuario) {
    return {
        queryTicket: "UPDATE cola SET activo = 0 AND estado = 0 WHERE id_usuario = ?",
        valuesTicket: [idusuario],
    };
}



module.exports = {
    getCola,
    getColaByIdUser,
    insertCola,
    deletePrevious,

};