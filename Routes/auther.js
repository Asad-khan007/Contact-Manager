const express = require('express');
const router = express.Router();

//@route  GET  /api/auther
//@desc   Get the Loggin user
//@access Private

router.get('/' , (req,res) => {
    res.send('Get the loggin user')
} );


//@route  POST  /api/auther
//@desc   Authorize user and get the token 
//@access Public

router.post('/' ,(req,res) => {
    res.send('Authorize user and get the token')
} );

module.exports = router; 