var express = require('express');

var router = express.Router();

const {
  getCurrentRoomName,
  getRoom
} = require('../utils/users');

/* GET home page. */
router.post('/createSala', async(req, res, next)=> {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  const validate = getCurrentRoomName(req.body.room)
  console.log(validate)
  if(validate==-1){
    res.status(200).send({room:false})
  }else{
    res.status(200).send({room:true,info:[]})
  }
});



module.exports = router;
