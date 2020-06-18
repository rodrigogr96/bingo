const users = [];
const numbers = 75
const arrayBingo = []
const selectNumber = []
const rooms = []
// Join user to chat
function userJoin(id, phone, user, room, bingo, master) {
  
  const userP = { id, phone, user, room, bingo, master };

  users.push(userP);

  return userP;
}

function createRoom(room) {

  console.log(room)
  let arrayBingo2 = []
  let selectNumbe2r = []

  for (let index = 1; index <= 75; index++) {
    arrayBingo2.push(index)
  }

  const roomp = { room:room,arrayBingo:arrayBingo2,selectNumber:selectNumbe2r,ready:false };

  rooms.push(roomp);

  return rooms

}

function chocolatear(room) {
  const index2 = rooms.findIndex(r => r.room === room)
  // const array = rooms[index]
  console.log(index2)
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
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoom(room) {
  return rooms.filter(ro => ro.room === room);
}
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
  createRoom,
  getCurrentRoomName,
  getRoom,
  chocolatear
};