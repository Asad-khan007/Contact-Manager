const jwt = require('jsonwebtoken');
const config = require('config')

module.exports = function (req, res, next) {
    //Get the token from the Header
    const token = req.header('x-auther-token')
    //If token dosent exists
    if(!token) {
        return res.status(401).json({msg: "Autherization is denied, Token is missing"})
    }
    try {
        //Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: "Invalid Token"})
    }
}