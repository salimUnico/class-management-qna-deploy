const express = require("express");
const router = express.Router();

// User pre login controller s
const { createQuestionPaper, deleteQP, getAllQP, getSingleQP } = require('../../controllers/questions/qp');
const { createQuestionAnswer, deleteQA, getAllQA, getSingleQA } = require('../../controllers/questions/qna');

router.route('/paper').post(createQuestionPaper);
router.route('/paper').get(getAllQP);
router.route('/paper/:id').get(getSingleQP);
router.route('/paper/:id').delete(deleteQP);

router.route('/ans').post(createQuestionAnswer);
router.route('/ans/paper/:qp_id').get(getAllQA);
router.route('/ans/:id').get(getSingleQA);
router.route('/ans/:id').delete(deleteQA);

module.exports = router;