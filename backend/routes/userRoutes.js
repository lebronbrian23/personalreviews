const express = require('express')

const router = express.Router()

const {
    registerUser,
    loginUser,
    getMe,
    verifyUserOTP,
    resendUserOTP,
    updateUser,
    updateUserType,
    listUsers,
    searchUsers,
    updateUserAccountStatus,
    getUserByUsername
} = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')

router.route('/').post(registerUser).put(protect,updateUser)

router.post('/verify-user-otp', protect ,verifyUserOTP)

router.post('/resend-user-otp', protect ,resendUserOTP)

router.post('/login' ,loginUser)

router.get('/me', protect ,getMe)

router.get('/u/:username' ,getUserByUsername)

router.get('/search-users'  ,searchUsers)

/** For Backend */
router.put('/user-type', protect ,updateUserType)

router.get('/list-users' ,protect ,listUsers)

router.put('/update-user-account-status',protect ,updateUserAccountStatus)


module.exports = router
