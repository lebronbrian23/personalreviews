const express = require('express')

const router = express.Router()

const {
    updateUserAccountStatus,
    getUserByUsername,
    updateUserType,
    forgotPasword,
    verifyUserOTP,
    resendUserOTP,
    resetPasword,
    registerUser,
    searchUsers,
    updateUser,
    listUsers,
    loginUser,
    getMe,
} = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')

router.route('/').post(registerUser).put(protect,updateUser)

router.post('/verify-user-otp', protect ,verifyUserOTP)

router.post('/resend-user-otp', protect ,resendUserOTP)

router.post('/forgot-password' ,forgotPasword)

router.put('/reset-password' ,resetPasword)

router.post('/login' ,loginUser)

router.get('/me', protect ,getMe)

router.get('/u/:username' ,getUserByUsername)

router.get('/search-users'  ,searchUsers)

/** For Backend */
router.put('/user-type', protect ,updateUserType)

router.get('/list-users' ,protect ,listUsers)

router.put('/update-user-account-status',protect ,updateUserAccountStatus)


module.exports = router
