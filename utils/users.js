const { element } = require("protractor");

const users = [];
const numbers = 75
const arrayBingo = []
const selectNumber = []
const rooms = []
// Join user to chat
function userJoin(user) {
  
  const posicionRoom = rooms.findIndex(r => r.room === user.room)

  if(posicionRoom>-1){
    const push = rooms[posicionRoom].users
    push.push(user)
    return rooms[posicionRoom];
  }else{
    return null
  }
  
}

function pushBingo(user) {
  
  const posicionRoom = rooms.findIndex(r => r.room === user.room)

  if(posicionRoom>-1){
    const push = rooms[posicionRoom].bingo
    push.push(user)
    return rooms[posicionRoom];
  }else{
    return null
  }
  
}

function createRoomNew(room,user){
  let array = []
  let select = []
  let users = []
  let bingo = []

  for (let index = 1; index <= 75; index++) {
    array.push(index)
  }

  users.push(user)

  const newRomm = { room:room,ready:false,arrayBingo:array,selectNumber:select,users:users, bingo:bingo};

  rooms.push(newRomm)

  return newRomm
}

function existMaster(info){
  const posicion = rooms.findIndex(r => r.room === info.room)

  let element = false

  for (let index = 0; index < rooms[posicion].users.length; index++) {
    if(rooms[posicion].users[index].master){
      element = true
      break;
    }
  }

  return element

}

function userLeave(id) {

  var array = rooms.map(info => {
    return info.users
    }
  )

  let indexUser = -1
  let indexRoom = -1
  let element = null

  for (let index = 0; index < array.length; index++) {
    for (let index2 = 0; index2 < array[index].length; index2++) {
      if(array[index][index2].id === id){
        indexUser = index2
        indexRoom = index
        element = array[index][index2]
        break;
      }
    }
  }

  if(indexRoom>-1 && indexUser>-1){
    rooms[indexRoom].users.splice(indexUser,1)

    if(rooms[indexRoom].users.length<1){
      rooms.splice(indexRoom,1)
      element=null
    }
  }

  return element
}

function getRoom(room) {
  return rooms.filter(ro => ro.room === room);
}

function getCurrentRoomName(room) {
  return rooms.findIndex(r => r.room === room)
}

// function createRoom(room) {

//   let arrayBingo2 = []
//   let selectNumbe2r = []

//   for (let index = 1; index <= 75; index++) {
//     arrayBingo2.push(index)
//   }

//   const roomp = { room:room,arrayBingo:arrayBingo2,selectNumber:selectNumbe2r,ready:false };

//   rooms.push(roomp);

//   return roomp

// }

function getRoomBingo(room) {
  const index2 = rooms.findIndex(r => r.room === room)
  if(index2>-1){
    return rooms[index2]
  }else{
    this.createRoom(room)
  }
}

function chocolatear(room) {
  const index2 = rooms.findIndex(r => r.room === room)
  
  if(index2>-1){
    if(rooms[index2].arrayBingo.length>0){
      var ctr = rooms[index2].arrayBingo.length, temp, index;

      while (ctr > 0) {

          index = Math.floor(Math.random() * ctr);

          ctr--;

          temp = rooms[index2].arrayBingo[ctr];
          rooms[index2].arrayBingo[ctr] = rooms[index2].arrayBingo[index];
          rooms[index2].arrayBingo[index] = temp;

      }

      rooms[index2].selectNumber.push(rooms[index2].arrayBingo[0])
      rooms[index2].arrayBingo.shift()
    }
  }

  return rooms[index2]
  
}


function getCurrentRoomName(room) {
  return rooms.findIndex(r => r.room === room)
}

function all(){

  if(arrayBingo.length==0){
    for (let index = 1; index <= numbers; index++) {
      arrayBingo.push(index)
    }
    selectNumber == []
  }
  return {arrayBingo,selectNumber}
}

function chocolatearArray() {
  if(arrayBingo.length>0){
    var ctr = arrayBingo.length, temp, index;

    while (ctr > 0) {

        index = Math.floor(Math.random() * ctr);

        ctr--;

        temp = arrayBingo[ctr];
        arrayBingo[ctr] = arrayBingo[index];
        arrayBingo[index] = temp;

    }

    selectNumber.push(arrayBingo[0])
    arrayBingo.shift()
  }else{
    while (selectNumber.length) {
      selectNumber.pop();
    }
  }
  return {arrayBingo,selectNumber}
}
// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function getCurrentPhone(phone){
  return users.findIndex(user => user.phone === phone);
}

// User leaves chat
// function userLeave(id) {
//   const index = users.findIndex(user => user.id === id);

//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }


// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getCurrentPhone,
  all,
  chocolatearArray,
  getCurrentRoomName,
  getRoom,
  chocolatear,
  getRoomBingo,
  createRoomNew,
  existMaster,
  pushBingo
};