const express = require("express");
const router = express.Router();

// controller 
const UserRouter = require('./user');
const QuestionRouter = require('./qp');
const NotesRouter = require('./qp');

router.use('/user', UserRouter);
router.use('/question', QuestionRouter);
router.use('/notes', NotesRouter);

module.exports = router;