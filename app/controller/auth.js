const bcrypt = require("bcrypt")
// const { User } = require("../model")
const jwt = require('jsonwebtoken')
// const { handleError, sendMailer, handleResponse, createUUID } = require("../utils/helpers")
// Login User

exports.login = async (req, res, next) => {

    const { email, password } = req.body
    const { error } = login.validate(req.body, { abortEarly: false })

    if (error) {
        handleError(error, req, res)
        return
    }

    const user = await User.findOne({ email: email, password: md5(password) })
    if (!user) {
        return handleError('Invalid login credential', req, res)
    }
    else {
        const token = await jwt.sign({
            id: user._id,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRE_ACCESS}` })

        res.send({
            token: token,
            message: 'LoggedIn Successfully',
            error: false
        })
    }

}

// Logout User
// exports.logout = async (req, res) => {
//     try {
//         res.cookie("token", null, {
//             expires: new Date(Date.now()),
//             httpOnly: true,
//         })
//         res.send({
//             message: 'Logout',
//             error: false
//         })
//     }
//     catch (error) {
//         handleError(error, req, res)
//     }
// }

// // Forgot Password
exports.forgotPassword = async (req, res) => {
    const email = req.body.email

    const user = await User.findOne({ email: email })

    if (user === null) {
        handleError('Invalid email address', req, res)
    }

    if (user) {
        const token = createUUID()
        await User.updateOne({ _id: user._id }, { token: token },
            {
                new: true
            })
            .then(data => {
                const subject = 'Your forgot password link'
                const message = `<div style="margin:auto width:70%">
                                        <div style="font-family: Helvetica,Arial,sans-serifmin-width:1000pxoverflow:autoline-height:2">
                                        <div style="margin:50px autowidth:60%padding:20px 0">
                                        <p style="font-size:25px">Hello,</p>

                                        <p>Use the code below to recover access to your Human relief account.</p>
                                                <div style="border-bottom:1px solid #eee"> OTP = ${token}</div>

                                        <p>The recovery code is only valid for 24 hours after it’s generated. If your code has already expired, you can restart the recovery process and generate a new code.
                                        If you haven't initiated an account recovery or password reset in the last 24 hours, ignore this message.</p>
                                        <p style="font-size:0.9em">Best Regards,<br />HUMAN RELIEF</p>
                                        </div>
                                        </div>
                                        </div>`

                sendMailer(`${email}`, subject, message, res)

                return res.send({ message: `We have sent reset password email link`, error: false })
            })
            .catch(err => {
                handleError(err, req, res)
            })
    }
}

// // Forgot Password verify
exports.forgotPasswordVerify = async (req, res) => {

    const user = await User.findOne({ token: req.body.token })

    if (user === null) {
        return res.send({ message: 'This otp has already been used', error: true })
    }

    if (req.body.new_password === req.body.confirm_password) {

        await User.updateOne({ token: req.body.token, _id: user._id }, { token: null, password: md5(req.body.new_password) }, { new: true })

            .then(data => {
                return res.send({ message: 'You have successfully reset your password', error: false })
            })
            .catch(err => {
                handleError(err, 400, res)
            })
    }
    else
        return res.send({ message: 'Password and confirm password should be same.', error: true })

}