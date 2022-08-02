const express = require("express");
const router = express.Router();

//Api auth 
const { ApiAuthentication, AdminAuthenctication, CutomerAuthenctication, ExecutiveAuthenctication, ManagerAuthenctication } = require('../../middleware/apiAuth');
//User related routers 
const usermain = require('./userRoutes');


router.use('/', ApiAuthentication, AdminAuthenctication, usermain);

module.exports = router;