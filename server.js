const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {
    userJoin,
    userLeave,
    getCurrentRoomName,
    chocolatear,
    getRoom,
    createRoomNew,
    existMaster,
    pushBingo,
  } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '/dist')));


app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

// Run when client connects
io.on('connection', socket => {

  socket.on('createRoom',({room,user}) => {
    const validate = getCurrentRoomName(room)
    const usuario = user
    usuario.id=socket.id

    if(validate==-1){
      const create = createRoomNew(room,usuario)
      socket.join(room);
      io.to(room).emit('room', {
        room:create
      });
    }else{
      const validae = existMaster(usuario)

      if(validae==true){
        console.log("1")
        io.to(socket.id).emit(
          'sala',`0`
        );
      }else{
        console.log("2")
        const room  = userJoin(usuario)
        socket.join(usuario.room);

        socket.broadcast
            .to(usuario.room)
            .emit(
              'message',`${usuario.user} entro al juego`
        );

        io.to(usuario.room).emit('room', {
            room: room,
        });
      }
    }
  })

  socket.on('girar',({room}) => {
    console.log(room)
    if(room.master){
      const chocolate = chocolatear(room.room)
      io.to(room.room).emit('play', {
        room:chocolate
      });
    }
  })

  socket.on('win',({room}) => {
      io.to(room.room).emit('pausar','0');
      const bingo = pushBingo(room)
      io.to(room.room).emit('bingo', {
        room:bingo
      });
  })

  socket.on('joinRoom', ({ user }) => {

    const usuario = user
    usuario.id=socket.id

    const room  = userJoin(usuario)

    if(room!=null){
      socket.join(usuario.room);

      socket.broadcast
          .to(usuario.room)
          .emit(
            'message',`${usuario.user} entro al juego`
      );

      io.to(usuario.room).emit('room', {
          room: room,
      });
    }else{
      io.to(socket.id).emit(
        'sala',`0`
      );
    }

});
  

  // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if (user!=null) {
        io.to(user.room).emit('room', {
          room: getRoom(user.room)[0],
        })
        io.to(user.room).emit('message', `${user.user} salio del juego`);
      }
    })
});

const port = process.env.PORT || 3000;

server.listen(port , () => console.log(`Server running on port ${port}`));