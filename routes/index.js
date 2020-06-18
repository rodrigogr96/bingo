var express = require('express');

var router = express.Router();

const {
  getCurrentRoomName,
  getRoom
} = require('../utils/users');

/* GET home page. */
router.post('/createSala', async(req, res, next)=> {
  const validate = getCurrentRoomName(req.body.room)
  console.log(validate)
  if(validate==-1){
    res.status(200).send({room:false})
  }else{
    res.status(200).send({room:true,info:[]})
  }
});



module.exports = router;
