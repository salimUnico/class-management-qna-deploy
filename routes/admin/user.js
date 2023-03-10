const express = require("express");
const router = express.Router();

// User pre login controller s
const { forgetPassword, forgetPasswordWithToken, loginUser, resetPassword, createNewUser, getAllUser, deleteUser } = require('../../controllers/user/user');

router.route('/').get(getAllUser);
router.route('/:id').delete(deleteUser);


router.route('/new').post(createNewUser);
router.route('/reset/:id').put(resetPassword);
router.route('/login').post(loginUser);
router.route('/forgot').post(forgetPassword);
router.route('/forgot-token-reset').post(forgetPasswordWithToken);


module.exports = router;