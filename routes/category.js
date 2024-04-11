//for now, this will be for creating categories only
const express = require("express");
const router = express.Router();

const {CategoryController} = require(__dirname + "/../controllers/CategoryController.js");
const { authenticationVerifier } = require('../middlewares/verifyToken');

router.post("/create", authenticationVerifier, CategoryController.create_category);

module.exports = router;