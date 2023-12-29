const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const cors = require("cors");
const bodyParser = require("body-parser");
const personRouter = require('./routes/person/person')(io);
const ticketRouter = require('./routes/ticket/ticket')(io);
const colaRouter = require('./routes/cola/cola')(io);
const loginRouter = require('./routes/login/login');

// Parsear el contenido enviado
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/mkt/api/person', personRouter);
app.use('/mkt/api/ticket', ticketRouter);
app.use('/mkt/api/cola', colaRouter);
app.use('/mkt/api/login', loginRouter);


io.on("connection", (socket) => {
  const idHandShake = socket.id;
  const { nameRoom } = socket.handshake.query;

  socket.join(nameRoom);

  socket.on('lobby', (res) => {
    socket.to(nameRoom).emit('lobby', '');
  })

  socket.on('cola', (res) => {
    socket.to(nameRoom).emit('cola', '');
  })

  // Manejo de errores
  socket.on('error', (error) => {
    console.error("Error en la conexión: " + error);
  });
});


// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error del servidor' });
});

function emitNotification(room, message) {
  io.to(room).emit('notification', message);
}

const port = 80; 

http.listen(port, function () {
  console.log('\n');
  console.log(`>> Express y Socket.io listos y escuchando por el puerto ` + port);
});

module.exports = app;
module.exports.io = io;
