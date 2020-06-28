


const rooms = []
// Join user to chat
function userJoin(user) {
  
  const posicionRoom = rooms.findIndex(r => r.room === user.room)

  if(posicionRoom>-1){
    if(rooms[posicionRoom].ready){
      return 0
    }else{
      const push = rooms[posicionRoom].users
      push.push(user)
      return rooms[posicionRoom];
    }
  }else{
    return 1
  }
  
}

function pushBingo(user) {
  
  const posicionRoom = rooms.findIndex(r => r.room === user.room)

  if(posicionRoom>-1){
    const push = rooms[posicionRoom].bingo
    if(rooms[posicionRoom].bingo.length>0){

    }else{
      push.push(user)
    }
    return rooms[posicionRoom];
  }else{
    return null
  }
  
}

function createRoomNew(room,user){

  let array = []
  let users = []

  for (let index = 1; index <= room.count; index++) {
    array.push(index)
  }

  users.push(user)

  const newRoom={
    room:room.room,
    count:room.count,
    arrayBingo:array,
    select:[],
    ready:false,
    users:users,
    bingo:[],
    shape:room.shape
  }

  rooms.push(newRoom)

  return newRoom
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
    
    let validate = rooms[indexRoom].users[indexUser].master
    rooms[indexRoom].users.splice(indexUser,1)
   
    if(rooms[indexRoom].users.length<1){
      rooms.splice(indexRoom,1)
      element=null
    }else{
      if(validate){
        rooms[indexRoom].users[0].master=true
      }
    }
  }

  return {element,room:rooms[indexRoom]}
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

      rooms[index2].ready=true
      
      var ctr = rooms[index2].arrayBingo.length

      var aleatorio 

      for (let index = 0; index < ctr; index++) {
        aleatorio = Math.floor(Math.random() * ctr);
      }

      rooms[index2].select.push(rooms[index2].arrayBingo[aleatorio])
      rooms[index2].arrayBingo.splice(aleatorio,1)
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