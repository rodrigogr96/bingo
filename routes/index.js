var express = require('express');

var router = express.Router();

const {
  getCurrentRoomName,
  getRoom
} = require('../utils/users');

/* GET home page. */
router.use('/createSala/:id', async(req, res, next)=> {
  console.log(req.params)
  const validate = getCurrentRoomName(req.params.id)
  console.log(validate)
  if(validate==-1){
    res.status(200).send({room:false})
  }else{
    res.status(200).send({room:true,info:[]})
  }
});



module.exports = router;
