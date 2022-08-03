const express = require("express");
const router = express.Router();

// controller 
const UserRouter = require('./user');
const QuestionRouter = require('./qp');

router.use('/user', UserRouter);
router.use('/question', QuestionRouter);

module.exports = router;