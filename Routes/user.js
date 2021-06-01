const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../config/models/user');

//@route  POST  /api/user
//@desc   Register a user
//@access Public

router.post('/' , [
    check('name', 'Please Enter a name').not().isEmpty(),
    check('email', 'Please Enter valid Email').isEmail(),
    check('password', 'Please Enter Password At Least 6 Characters').isLength({min:6})
] , async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({email})
        if(user){
        return  res.status(400).json({msg:'This User is Already Exists'})
    }

    user = new User({
        name,
        email,
        password
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
});

module.exports = router; 