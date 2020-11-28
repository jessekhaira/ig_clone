var express = require('express');
var router = express.Router();
var validator = require('express-validator');


router.post('/', [
  (req,res,next) => {
    console.log(req.body); 
  }
]);

exports.register_router = router; 