const express = require("express");
const router = express.Router();

const { createNotes, deleteNotes, getAllNotes, getSingleNotes, updateNotes } = require('../../controllers/notes/notes');

router.route('/').post(createNotes);
router.route('/').get(getAllNotes);
router.route('/single/:id').get(getSingleNotes);
router.route('/:id').delete(deleteNotes);
router.route('/:id').put(updateNotes);

module.exports = router;