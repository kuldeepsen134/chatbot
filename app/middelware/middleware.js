const jwt = require("jsonwebtoken");


exports.authJWT = async (req, res, next) => {

    if (req.path.includes('/login') || req.path.includes('/register') || req.path.includes('/forgotPassword') || req.path.includes('/reset-password-email') || req.path.includes('/update-password') || req.path.includes('/email-resend'))
        return next()

    // if (req.cookies.token) {
    //     try {
    //         const data = await jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    //         req.user = data;
    //         return next()
    //     } catch (error) {
    //         res.status(401).send({
    //             error: { message: ['Unauthorized access!'] }
    //         })
    //     }
    // } else
    //     res.status(401).send({
    //         error: { message: ['Unauthorized access!'] }
    //     })
}