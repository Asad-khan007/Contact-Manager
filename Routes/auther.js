const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../config/models/user');
const Auther = require('../middleware/auth');

//@route  GET  /api/auther
//@desc   Get the Loggin user
//@access Private

router.get('/',Auther, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER_ERROR')
    }
});


//@route  POST  /api/auther
//@desc   Authorize user and get the token 
//@access Public

router.post('/',[
    check('email', 'Please Enter Valid Email').isEmail(),
    check('password', 'Please Enter the Password').exists()
] , 
async (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }

    const {email, password} = req.body

    try {
        let user = await User.findOne({email})
        if(!user){
           return res.status(400).json({msg:'User with this Email is not Exists'})
        }    

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
            return res.status(400).json({msg: "Password Incorrect Try again !"})
        }
        //Paching the Token
        const payload = {
            user: {
                id: user.id
            }
        }
    
        jwt.sign(payload, config.get('jwtSecret'),{
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            res.json({token})
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("SERVER_ERROR")
    }
    
} );

module.exports = router; 