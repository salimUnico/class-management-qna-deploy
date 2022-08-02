const express = require("express");
const router = express.Router();

// User pre login controller s
const { forgetPassword, forgetPasswordWithToken, loginUser, resetPassword } = require('../../controllers/user/user');

router.route('reset/:id').put(resetPassword);
router.route('login').post(loginUser);
router.route('forgot').post(forgetPassword);
router.route('forgot-token-reset').post(forgetPasswordWithToken);

module.exports = router;