const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const respondError = require(__dirname + "/../helpers/respondError");

const AuthController = {

    /* create new user */
    async create_admin(req, res, next) {
		const {username, email, password} = req.body;
		
		
        const newAdmin = new Admin({username, email, password});

        try {
            await newAdmin.save();
            res.status(201).json({
                type : 'success',
                message: "Admin has been created successfuly",
                data: newAdmin.toJSON()
            })
        } catch (err) {
        	respondError(res, err);
        }
    },

    /* login existing user */
    async login_admin(req, res) {
        
        const {username, password, email} = req.body;
        
        const sendError = () => {
        	res.status(500).json({
                type: "error",
                message: "invalid combination of username/email and password"
            })
        }
        
        let validationSuccess;
        
        try {
        	validationSuccess = await Admin.authenticate({username, password, email});
        } catch (err) {
        	return sendError();
        }
        
        if (! validationSuccess) {
           sendError();
        } else {
			const {admin_id, password, ...data} = await Admin.findOne( (username)? {username} : {email} );
            
            const accessToken = jwt.sign({admin_id}, 
	            process.env.JWT_SECRET,
	            { expiresIn: "1d"}
            );

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