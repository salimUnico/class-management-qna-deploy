const express = require("express");
const router = express.Router();

//Admin controller 
const {helloController} = require("../../controllers/hello");

router.route("/").get(helloController);

module.exports = router;
