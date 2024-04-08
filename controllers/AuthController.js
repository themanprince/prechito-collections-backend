const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const api_config = require("../config/api.js");
/*
config/api.js contains just the jwt secret for now
will change this to be in .env
*/

const AuthController = {

    /* create new user */
    async create_user(req, res, next) {

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
            //please change this from hashSync, to non-blocking version
        });

        try {
            const user = await newUser.save();
            res.status(201).json({
                type : 'success',
                message: "User has been created successfuly",
                user
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    },

    /* login existing user */
    async login_user(req, res) {
        
        const user = await User.findOne({ username: req.body.username });

        if (!user || /*change following compareSync to non-blocking version*/ !bcrypt.compareSync(req.body.password, user.password)) {
            res.status(500).json({
                type: "error",
                message: "User not exists or invalid credentials",
            })
        } else {

            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin}, 
            api_config.api.jwt_secret, //dotrnv pls
            { expiresIn: "1d"}
            );

            const { password, ...data } = user._doc;

            res.status(200).json({
                type: "success",
                message: "Successfully logged",
                ...data,
                accessToken
            })
        }
    }
};

module.exports = AuthController;