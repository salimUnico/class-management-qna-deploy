const asyncHandler = require('../../middleware/asyncHandler');
const ErrorResponse = require('../../utils/ErrorResponse');
const { validationCheck } = require('../../middleware/validationCheck');
const { hashPassword, comparePassword } = require('../../utils/hashing')
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
const { sendEmail } = require('../../utils/sendEmail');

//models
const User = require('../../models/user');

/*
* Create a new user /api/v1/user/admin/user - Admin only - POST
*/
exports.createNewUser = asyncHandler(async (req, res) => {
    const { name, email, role, password, telephone, gender, } = req.body;
    const userData = {
        name, email, role, password, telephone, gender,
    };
    const validation = validationCheck({
        name, email, role, password, telephone, gender,
    });
    if (!validation.status) {
        throw new ErrorResponse(`Please provide a ${validation?.errorAt}`, 400);
    }
    // Password Validation 
    const specialCharacterFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (password.search(/[0-9]/) == -1) {
        throw new ErrorResponse("Password must contain atleast 6 characters", 400);
    } else if (password.search(/[a-z]/) == -1) {
        throw new ErrorResponse(
            "Password must contain one lower case character",
            400
        );
    } else if (password.search(/[A-Z]/) == -1) {
        throw new ErrorResponse(
            "Password must contain one upper case character",
            400
        );
    } else if (!specialCharacterFormat.test(password)) {
        throw new ErrorResponse("Password must contain special character", 400);
    }
    //Check if email already registered
    let userEmailVerfication = await User.findOne({ email: email });
    if (userEmailVerfication) {
        throw new ErrorResponse("Email already registered", 400);
    }
    const hashedPassword = await hashPassword(password);
    userData.password = hashedPassword;
    try {
        const userCreation = await User.create(userData);
        return res.status(201).json({ success: true, data: userCreation });
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

/*
* Returns list of all user  /api/v1/user/${admin | manager}/user - Admin | Manager only - GET
*/
exports.getAllUser = asyncHandler(async (req, res) => {
    try {
        const userData = await User.find({});
        return res.status(200).json({ success: true, data: userData })
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

/*
* Returns single user  /api/v1/user/${admin | manager}/user/:id - Admin | Manager only - GET
*/
exports.getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ErrorResponse(`Please provide a user id `, 400);
    }
    try {
        const userData = await User.findOne({ _id: id });
        return res.status(200).json({ success: true, data: userData })
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);

    }
})

/*
* Delete a user  /api/v1/user/${admin | manager}/user/:id - Admin | Manager only - DELETE
*/
exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ErrorResponse(`Please provide a user id `, 400);
    }
    try {
        const userData = await User.deleteOne({ _id: id });
        return res.status(200).json({ success: true, data: "User deleted successfully" })
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }
})

/*
* Update a user  /api/v1/user/${admin | manager}/user/:id - Admin | Manager only - PUT
* Only admin update role using this api
*/
exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, role, status, telephone, gender, dob } = req.body;
    const userData = {
        name, email, role, status, telephone, gender, dob
    };
    const validation = validationCheck({ userData });
    if (!id) {
        throw new ErrorResponse(`Please provide a user id `, 400);
    }
    if (!validation.status) {
        throw new ErrorResponse(`Please provide a ${validation?.errorAt}`, 400);
    }
    try {
        const userUpdatedData = await User.findOneAndUpdate({ _id: id }, userData, { returnOriginal: false });
        return res.status(201).json({ success: true, data: userUpdatedData })
    } catch (error) {
        throw new ErrorResponse(`Server error :${error}`, 400);
    }

})

/*
* Reset Password using old password  /api/v1/user/user/reset/:id - All - PUT
* Anybody can use this api to reset there password
*/
exports.resetPassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { oldpassword, newpassword } = req.body;
    const resetData = { oldpassword, newpassword };
    const validation = validationCheck(resetData);
    if (!validation.status) {
        throw new ErrorResponse(`Please provide a ${validation.errorAt}`, 400);
    }
    if (!id) {
        throw new ErrorResponse(`Please provide id`, 400);
    }
    const user = await User.findOne({ _id: id })
    if (!user) {
        throw new ErrorResponse(`Email doesn't exists`, 400);
    }
    const passwordOk = await comparePassword(oldpassword, user.password);
    if (passwordOk) {
        // Password strong or not check
        const specialCharacterFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (newpassword.search(/[0-9]/) == -1) {
            throw new ErrorResponse("Password must contain atleast 6 characters", 400);
        } else if (newpassword.search(/[a-z]/) == -1) {
            throw new ErrorResponse(
                "Password must contain one lower case character",
                400
            );
        } else if (newpassword.search(/[A-Z]/) == -1) {
            throw new ErrorResponse(
                "Password must contain one upper case character",
                400
            );
        } else if (!specialCharacterFormat.test(newpassword)) {
            throw new ErrorResponse("Password must contain special character", 400);
        }
        // Storing Password and stuff
        let hashedPassword = await hashPassword(newpassword);
        await User.findOneAndUpdate({ _id: id }, { password: hashedPassword })
            .then(data => res.status(201).json({ success: true, msg: "Password reset successfully " }))
            .catch(err => {
                throw new ErrorResponse(`Error : ${err}`, 500);
            })
    } else {
        throw new ErrorResponse(`Old password incorrect`, 400);
    }
})

/*
* Login with email and password  /api/v1/user/user/login/ - All - POST
* Anybody can use this api to login
*/
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const loginData = { email, password };
    const validation = validationCheck(loginData);
    if (!validation.status) {
        throw new ErrorResponse(`Please provide a ${validation?.errorAt}`, 400);
    }

    try {
        const userData = await User.findOne({ email });
        if (!userData) {
            throw new ErrorResponse(`email provided doesn't exist`, 400);
        }

        const passwordOk = await comparePassword(password, userData.password);
        if (passwordOk) {
            const token = jwt.sign(
                {
                    name: userData.name,
                    email: userData.email,
                    userid: userData._id
                },
                process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24 * 7
            }); // 60*60*24*7 is 7 days, here 60 means 60 seconds
            let date = new Date();
            date.setDate(date.getDate() + 6);
            delete userData.password;
            return res.status(200).json({ success: true, msg: userData, jwt: { token, expiry: date.toISOString() } });
        } else {
            throw new ErrorResponse(`email or password incorrect`, 400);
        }
    } catch (error) {
        throw new ErrorResponse(`${error}`, 400);
    }
})

/*
* Forget Password get link on email id  /api/v1/user/forgot/ - All - POST
* Anybody can use this api to get forgot password link on thier email.
*/
exports.forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const employeeData = await User.findOne({ email: email });
    if (!employeeData) {
        throw new ErrorResponse("Email not found", 404);
    }

    const date = new Date();
    date.setDate(date.getDate() + 1);

    crypto.randomBytes(32, async (err, buffer) => {
        const token = buffer.toString("hex");
        const subject = "Forget Password";
        const body = `
      <div>
       Hey there!<br/> Did you request for a Forget password<br/> If yes, please  <a href="https://example.com/forget-password/${token}">click here for forget password</a>.<br/> If no? Please ignore this email.
       </div>
      `;
        const to = [employeeData.email];
        await sendEmail(subject, body, to);
        await User.findOneAndUpdate(
            { _id: employeeData._id },
            { resetToken: { token, expiry: date.toISOString() } }
        );
    });
    return res.status(200).json({ success: true, data: "Email sent successfully" });
});

/*
* Forget Password get link on email id  /api/v1/user/user/forgot-token-reset/ - All - POST
* Anybody can use this api with token to reset their password
*/
exports.forgetPasswordWithToken = asyncHandler(async (req, res) => {
    // const { token } = req.params;
    const { newPassword, token } = req.body;
    const employee = await User.findOne({ "resetToken.token": token });
    if (!employee) {
        throw new ErrorResponse("Token not found", 404);
    }
    const currentDate = new Date();
    const expiryDate = new Date(employee.resetToken.expiry);
    if (currentDate > expiryDate) {
        await User.findOneAndUpdate(
            { _id: employee._id },
            {
                resetToken: { token: null, expiry: null },
            }
        );
        throw new ErrorResponse("Token is expired", 400);
    }
    const specialCharacterFormat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (newPassword.search(/[0-9]/) == -1) {
        throw new ErrorResponse("Password must contain atleast 6 characters", 400);
    } else if (newPassword.search(/[a-z]/) == -1) {
        throw new ErrorResponse(
            "Password must contain one lower case character",
            400
        );
    } else if (newPassword.search(/[A-Z]/) == -1) {
        throw new ErrorResponse(
            "Password must contain one upper case character",
            400
        );
    } else if (!specialCharacterFormat.test(newPassword)) {
        throw new ErrorResponse("Password must contain special character", 400);
    }
    const updatedPassword = await hashPassword(newPassword);
    try {

        const dataUpdated = await User.findOneAndUpdate(
            { _id: employee._id },
            {
                password: updatedPassword,
                resetToken: { token: null, expiry: null },
            }
        );
        // console.log(updatedPassword, dataUpdated)
        if (dataUpdated) {
            return res.status(200).json({ success: true, data: "Password updated successfully" });
        }
    } catch (error) {
        throw new ErrorResponse(error, 400);

    }
});
