const express = require('express')

const router = express.Router()

const {registerUser ,loginUser, getMe ,verifyUserOTP ,resendUserOTP} = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')

router.post('/' , registerUser)

router.post('/verify-user-otp', protect ,verifyUserOTP)

router.post('/resend-user-otp', protect ,resendUserOTP)

router.post('/login' ,loginUser)

router.get('/me', protect ,getMe)


module.exports = router
