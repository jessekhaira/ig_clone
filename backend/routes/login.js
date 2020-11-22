var express = require('express');
var router = express.Router();


router.POST('/login', (req,res,next) => {
    console.log(req); 
})