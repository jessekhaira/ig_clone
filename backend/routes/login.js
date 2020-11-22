var express = require('express');
var router = express.Router();


router.post('/', (req,res,next) => {
    console.log(req); 
});


exports.login_router = router; 