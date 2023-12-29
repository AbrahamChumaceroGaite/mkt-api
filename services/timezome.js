function BoliviaTimeZone(date) {
    const fechaActualUTC = new Date(date);
    const offset = -4 * 60; // GMT-4
    const fechaBoliviana = new Date(fechaActualUTC.getTime() + offset * 60 * 1000);

    // Formatear la fecha como "YYYY-MM-DD HH:MM:SS"
    const formattedDate = fechaBoliviana.toISOString().slice(0, 19).replace("T", " ");

    return formattedDate;
}

module.exports = {
    BoliviaTimeZone
};
