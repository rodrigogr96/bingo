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
    const sala = room
    const usuario = user
    const validate = getCurrentRoomName(usuario.room)
    usuario.id=socket.id

    if(validate==-1){
      const create = createRoomNew(sala,usuario)
      socket.join(sala.room);
      io.to(sala.room).emit('room', {
        room:create
      });
    }else{
      const validate = existMaster(usuario)
      if(validate){
        io.to(socket.id).emit(
          'existMaster',true
        )
        usuario.master = false
        const infoRoom  = userJoin(usuario)

        if(infoRoom==0){
          
          io.to(socket.id).emit(
            'ready',true
          )

        }else if(infoRoom==1){

          io.to(socket.id).emit(
            'existRoom',false
          )

        }else{
          socket.join(usuario.room);

          socket.broadcast
              .to(usuario.room)
              .emit(
                'message',`${usuario.user} entro al juego`
          )

          io.to(usuario.room).emit('changeMaster', {
              room: infoRoom,
          })

          io.to(usuario.id).emit('idroom', {
            room: infoRoom,
          })

          io.to(usuario.room).emit('addRoom', {
              room: infoRoom,
          })
        }

      }else{
        const infoRoom  = userJoin(usuario)

        if(infoRoom==0){
          
          io.to(socket.id).emit(
            'ready',true
          )

        }else if(infoRoom==1){

          io.to(socket.id).emit(
            'existRoom',false
          )

        }else{
          socket.join(usuario.room);

          socket.broadcast
              .to(usuario.room)
              .emit(
                'message',`${usuario.user} entro al juego`
          )

          io.to(usuario.id).emit('idroom', {
            room: infoRoom,
          })
  
          io.to(usuario.room).emit('addRoom', {
              room: infoRoom,
          })
        }
      }
    }
    //else{
    //   const validae = existMaster(usuario)

    //   if(validae==true){
    //     console.log("1")
    //     io.to(socket.id).emit(
    //       'sala',`0`
    //     );
    //   }else{
    //     console.log("2")
    //     const room  = userJoin(usuario)
    //     socket.join(usuario.room);

    //     socket.broadcast
    //         .to(usuario.room)
    //         .emit(
    //           'message',`${usuario.user} entro al juego`
    //     );

    //     io.to(usuario.room).emit('room', {
    //         room: room,
    //     });
    //   }
    // }
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
      if(bingo==null){
        io.to(room.room).emit('plays','0');
      }else{
        io.to(room.room).emit('bingo', {
          room:bingo
        });
      }
  })

  socket.on('joinRoom', ({ user }) => {

    const usuario = user
    usuario.id=socket.id

    const room  = userJoin(usuario)

    if(room == 0){
      io.to(socket.id).emit(
        'ready',true
      )
    }else if(room == 1){
      io.to(socket.id).emit(
        'existRoom',false
      )
    }else{

      socket.join(usuario.room);

      socket.broadcast
          .to(usuario.room)
          .emit(
            'message',`${usuario.user} entro al juego`
      );

      io.to(usuario.id).emit('idroom', {
          room: room,
      })

      io.to(usuario.room).emit('addRoom', {
          room: room,
      })
    }

});
  

  // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if (user.element!=null) {
        io.to(user.element.room).emit('leaveroom', {
          room: user.room,
        })
        io.to(user.element.room).emit('message', `${user.element.user} salio del juego`);
      }
    })
});

const port = process.env.PORT || 3000;

server.listen(port , () => console.log(`Server running on port ${port}`));