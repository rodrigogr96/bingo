


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


module.exports = {
  userJoin,
  userLeave,
  getCurrentRoomName,
  chocolatear,
  getRoom,
  createRoomNew,
  existMaster,
  pushBingo
};