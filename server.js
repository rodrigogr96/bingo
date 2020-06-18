const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getCurrentPhone,
    all,
    chocolatearArray,
    createRoom,
    getCurrentRoomName,
    chocolatear
  } = require('./utils/users');

var cookieParser = require('cookie-parser')
var cors = require('cors')
var corsOptions = {
  origin: '*',
  methods: "POST,GET",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index')

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use('/bingo',cors(corsOptions), indexRouter)

// Set static folder
app.use(express.static(path.join(__dirname, '/dist')));


app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

// Run when client connects
io.on('connection', socket => {

  socket.on('createRoom',({room}) => {
    const validate = getCurrentRoomName(room)
    if(validate){
      const create = createRoom(room)
      socket.join(room);
      io.to(room).emit('roomCreate', {
        room:create
      });
    }
  })

  socket.on('girar',({room}) => {
    console.log(room)
    if(room.master){
      const chocolate = chocolatear(room.room)
      io.to(room.room).emit('play', {
        data:chocolate
      });
    }
  })

  socket.on('joinRoom', ({ bingo, phone, room, user, master }) => {
    // console.log(socket)

    const validate = getCurrentPhone(phone)

    if(validate){
      const userP = userJoin(socket.id, phone, user, room, bingo, master)
    
      socket.join(userP.room);
  
      // Broadcast when a user connects
      socket.broadcast
        .to(userP.room)
        .emit(
          'message',`${userP.user} entro al juego`
      );
  
      // Send users and room info
      io.to(userP.room).emit('roomUsers', {
          room: userP.room,
          users: getRoomUsers(userP.room)
      });

    }else{
      io.to(socket.id).emit(
        'validatePhone',`0`
      );
    }
});
  

  // Listen for chatMessage
//   socket.on('chatMessage', msg => {
//     const user = getCurrentUser(socket.id);

//     io.to(user.room).emit('message', formatMessage(user.username, msg));
//   });

  // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          'message',`${user.user} Salio de la sala`
        );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
});

const port = process.env.PORT || 3000;

server.listen(port , () => console.log(`Server running on port ${port}`));