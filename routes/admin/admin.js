const express = require("express");
const router = express.Router();

//Hello controller 
const UserRouter = require('./user');
router.use('/user', UserRouter)

module.exports = router;