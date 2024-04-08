const jwt =require('jsonwebtoken')

const api_config = require("../config/api.js");

/* jwt token verify */
const authenticationVerifier = (req, res, next)=> {

    const authHeader = req.headers.token;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, api_config.api.jwt_secret,(err, user)=>{
        	//please use a return statement in next line to ensure that the following lines are not reached
            if(err) res.status(401).json("Invalid token");
            req.user = user;
            next()
        })
    } else {
        return res.status(401).json("You are not authenticated");
    }
}

/* check if the current user */
const accessLevelVerifier = (req, res, next) => {
    authenticationVerifier(req,res, ()=>{
    	/*
    		this is specifically for 'PUT user/:id' routes
    		the first-half condition of below if statement goes like this
    			"if the user whose details you wish to update (specified by params.id) is you,
    			then you're free"
    		the second half condition says you have to be admin first
    	*/
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("You are not allowed to perform this task");
        }
    })
}

/* access_level_verifier('admin') */
const isAdminVerifier = (req, res, next) => {
    authenticationVerifier(req, res, ()=> {
        if(req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to perform this task")
        }
    })
}

module.exports = { authenticationVerifier, accessLevelVerifier, isAdminVerifier };