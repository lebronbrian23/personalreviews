const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const Otp = require('../models/otpModel')
const moment = require('moment')
const {generateRandomNumber ,sendSMS ,saveOTP} = require('./otpController')
const Type = require("../models/typeModel");
const UserType = require("../models/userTypeModel");
const ImageFile = require("../models/imageModel");
const escapeStringRegexp = require('escape-string-regexp');
const {saveImage} = require("./imageController");


/**
 * @description Registers new user
 * @route POST /api/users
 * @access Public
 */
const registerUser = asyncHandler (async (req, res) => {
    const{ name , email ,password ,phone ,username} = req.body

    if(!name || !username || !password || !phone){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //check if email has been submited
    if(email){
        //check if user with email exists
        const emailExists = await User.findOne({email})
        if(emailExists){
            res.status(400)
            throw new Error('User with email already exists')
        }
    }

    const phone_number = phone.charAt(0) === '+' ? phone : '+'+phone;
    //check if user with phone exists
    const phoneExists = await User.findOne({phone:phone_number})
    if(phoneExists){
        res.status(400)
        throw new Error('User with phone already exists')
    }
    //check if user with username exists
    const usernameExists = await User.findOne({username})
    if(usernameExists){
        res.status(400)
        throw new Error('Username already exists')
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password ,salt)

    //create the user
    const user = await User.create({
        name,
        email,
        phone : phone_number,
        username,
        password:hashedPassword,
        profile_link:username,
        bio:''
    })

    if (user){

        //get the general user type
        const userType = await Type.findOne({name:'general'})

        //map the user with their type
        await UserType.create({
            type_id:userType._id,
            user_id:user._id
        })
        // generate , save and send OTP to users phone
        const otp = await Otp.create({
            code: generateRandomNumber(1000,9999),
            model_id:user.id,
            verification_type:'User',
            expiresAt:moment().add(6 , 'minute').format('YYYY-MM-DD hh:mm:ss')
        })

        //send OTP through sms
        let message = 'Welcome! your Personal Review code is: '+ otp.code + ' expires at '+ otp.expiresAt+ '.Don\'t share it with anyone'
        sendSMS(user.phone ,message)

        res.status(200).json({
            _id: user.id,
            name: user.name,
            verified: user.verified,
            token: generateToken(user._id),
            user_type:userType.name,
            username: user.username,
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }

})

/**
 * @description resend user OTP
 * @route POST /api/users/resend-user-otp
 * @access Public
 */
const resendUserOTP = asyncHandler (async  (req, res) => {
    // get the logged in user
    const user = req.user
    //check if user exists
    if (user){
        // generate , save and send OTP to users phone
        const otp = await saveOTP(user.id ,'User' ,6)

        //send OTP through sms
        let message = 'Your Personal Review code is: '+ otp.code + ' expires at '+ otp.expiresAt+ '.Don\'t share it with anyone'
        sendSMS(user.phone ,message)

        res.status(200).json({'message' : 'A code has been sent to '+ user.phone})

    }else {
        res.status(400)
        throw new Error('User not found')
    }
})

/**
 * @description Verify user OTP
 * @route POST /api/users/verify-user-otp
 * @access Public
 */
const verifyUserOTP = asyncHandler (async  (req, res) => {

    const current_time = moment().format('YYYY-MM-DD hh:mm:ss')
    const {_id} = req.user
    const {code} = req.body

    //get the otp
    const otp  = await Otp.findOne({code ,model_id: _id, verification_type:'User'})

    //check if otp exists
    if(otp){
        //check if otp status is marked as new
        if(otp.status === 'new'){
            //check if otp is not expire
            if(otp.expiresAt >= current_time){
                //update otp
                await otp.updateOne({status:'used'})

                //get new updated info for the user
                const user = await User.findOne({_id})
                //update verified to yes
                await user.updateOne({_id:_id},{verified:'yes' ,is_account_active:'yes'})

                //get the general user type
                const userType = await UserType.findOne({user_id:_id})

                //map the user with their type
                const type = await Type.findOne({
                    _id:userType.type_id,
                })

                //get new updated info for the user
                const updatedUser = await User.findById(_id)

                res.status(200).json({
                    _id: updatedUser.id,
                    name: updatedUser.name,
                    verified: updatedUser.verified,
                    token: generateToken(updatedUser._id),
                    user_type:type.name,
                    username: user.username,
                })

            }
            else{
                if(otp.status !== 'used') {
                    otp.updateOne({status: 'expired'})
                }

                res.status(400)
                throw new Error('Code is expired')
            }
        }
        else{
            res.status(400)
            throw new Error('Code is expired or already used.')
        }
    }else {
        res.status(400)
        throw new Error('No OTP Code found')
    }
})

/**
 * @description Authenticate a user
 * @route POST /api/users
 * @access Public
 */
const loginUser = asyncHandler (async  (req, res) => {
    const {username , password} = req.body

    //check for username
    const user = await  User.findOne({username})

    //check user password match
    if(user && ( await bcrypt.compare(password ,user.password))){
        //get the general user type
        const userType = await UserType.findOne({user_id:user.id})

        //map the user with their type
        const type = await Type.findOne({
            _id:userType.type_id,
        })
        res.status(200).json({
            _id: user.id,
            name: user.name,
            username: user.username,
            verified: user.verified,
            token: generateToken(user._id),
            user_type:type.name,
        })
    }else{
        res.status(400)
        throw new Error('Username or password don\'t match.')
    }

})

/**
 * @description Forgot password
 * @route POST /api/users/forgot-password
 * @access Public
 */
const forgotPasword = asyncHandler( async ( req , res) => {
    const { username } = req.body

    //check for username
    const user = await  User.findOne({username})

    // if user with the username doesn't exist
    if(!user){
        res.status(400)
        throw new Error('Username doesn\'t match')
    }
    // generate , save and send OTP to users phone
    const otp = await saveOTP(user.id ,'Password' ,6)

    //send OTP through sms
    let message = 'Your password reset code is: '+ otp.code + ' expires at '+ otp.expiresAt+ '.Don\'t share it with anyone'
    sendSMS(user.phone ,message)

    res.status(200).json({'message' : 'A password reset code has been sent to '+ user.phone})

} )

/**
 * @description Reset password
 * @route PUT /api/users/reset-password
 * @access Public
 */
const resetPasword = asyncHandler( async ( req , res) => {

    const { username ,code , password } = req.body
    const current_time = moment().format('YYYY-MM-DD hh:mm:ss');

    //check for username
    const user = await User.findOne({username})

    // if user with the username doesn't exist
    if(!user){
        res.status(400)
        throw new Error('Username doesn\'t match')
    }

    //get the otp
    const otp  = await Otp.findOne({code ,model_id: user.id , verification_type:'Password'})

    //check if otp exists
    if(otp){
        //check if otp status is marked as new
        if(otp.status === 'new'){
            //check if otp is not expire
            if(otp.expiresAt >= current_time){
                await otp.updateOne({status:'used'})

                //hashing the password
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password ,salt)

                //update user password
                await User.updateOne({username},{password:hashedPassword} )

                //send OTP through sms
                let message = 'Your password has been reset'
                sendSMS(user.phone ,message)

                res.status(200).json({message:'Your password has been reset'})

            }
            else{
                if(otp.status !== 'used') {
                    otp.updateOne({status: 'expired'})
                }

                res.status(400)
                throw new Error('Code is expired')
            }
        }
        else{
            res.status(400)
            throw new Error('Code is expired or already used.')
        }
    }
    else {
        res.status(400)
        throw new Error('No OTP Code found')
    }

} )

/**
 * @description Get a logged user's profile
 * @route GET /api/users
 * @access Private
 */
const getMe = asyncHandler (async (req, res) => {
    res.status(200).json(await getUser(req.user.username))
})

/**
 * @description Get a user by username
 * @route GET /api/users/u/:username
 * @access Public
 */
const getUserByUsername = asyncHandler (async (req, res) => {
    res.status(200).json(await getUser(req.params.username))
})

/**
 * @description Get a usere
 */
const getUser = async (username) => {

    const find_user = await User.findOne({username}).select('-password')

    if(!find_user){
        res.status(400)
        throw new Error('User not found.')
    }

    //get the general user type
    const userType = await UserType.findOne({user_id:find_user._id})

    //map the user with their type
    const type = await Type.findOne({
        _id:userType.type_id,
    })

    const data = {
        id:find_user._id,
        name:find_user.name,
        username:find_user.username,
        phone:find_user.phone,
        email:find_user.email,
        bio:find_user.bio,
        is_account_active:find_user.is_account_active,
        profile_link:find_user.profile_link,
        user_type:type.name,
    }
    return data
}

/**
 * @description Update a user data
 * @route PUT /api/users
 * @access Private
 */
const updateUser = asyncHandler( async ( req ,res ) =>{

    const {bio ,is_account_active ,user_type, user_id} = req.body

    const user = await User.findById(user_id)

    //check if user exists
    if(!user){
        res.status(400)
        throw new Error('User not found.')
    }

    //update the user data
    const updateUserData = await User.updateOne(
        {_id:user.id} ,
        {
            bio : bio ? bio : user.bio,
            is_account_active : is_account_active ? is_account_active : user.is_account_active
        } ,
        {returnOriginal: false})

    // if user type has been submitted
    if(user_type){
        const get_user_type = await Type.findOne({name:user_type})

        //const userType = await UserType.findOne({user_id:user._id})

        await userType.updateOne(
            {user_id:user._id},
            {
                type_id:get_user_type._id,
                _id:userType._id
            }
        )
    }
    res.status(200).json(updateUserData)
})

/**
 * @description search users
 * @route GET /api/users/search-users
 * @access Public
 */
const searchUsers = asyncHandler (async (req, res) => {
    const {search , limit} = req.query

    const search_query = new RegExp(escapeStringRegexp(search) , 'ig');

    const users = await User.find({ name: search_query  ,verified: 'yes', is_account_active: 'yes' })
        .limit(limit).select('-password')

    const users_array =  []

    // for loop to iterate through each user
    for (const index in users) {

        //get the general user type
        const userType = await UserType.findOne({user_id:users[index]._id})
        //map the user with their type
        const type = await Type.findOne({_id:userType.type_id,})

        //check if the user has a usertype general
        if(type.name === 'general') {
            //push data to user array
            users_array.push({
                id: users[index]._id,
                name: users[index].name,
                username: users[index].username,
                phone: users[index].phone,
                bio: users[index].bio,
                email: users[index].email,
                user_type: type.name,

            })
        }
    }
    res.status(200).json(users_array)
})


/**_______________________________________
 *  For Backend
 ________________________________________*/

/**
 * @description Update a user type
 * @route PUT /api/users/user-type
 * @access Private | Backend
 */
const updateUserType = asyncHandler( async ( req ,res ) =>{
    const {user_id , type_id} = req.body

    //check the user type of the logged in user to see if there admins
    if(req.type.name !== 'admin') {
        res.status(400)
        throw new Error('Only Admins can update user type')
    }

    //check if the logged in user is  the same as the user being updated
    if(req.user.id === user_id) {
        res.status(400)
        throw new Error('You can\'t update your own account type.')
    }

    //check user
    const user = await User.findById(user_id)

    //check if review exists
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }
    //update the user type
    const updateUserType = await UserType.findOneAndUpdate({user_id:user_id} ,{type_id :type_id} , {returnOriginal: false})

    res.status(200).json(updateUserType)

})

/**
 * @description list users
 * @route GET /api/users/list-users
 * @access Private | Backend
 */
const listUsers = asyncHandler (async (req, res) => {

    const {search , limit} = req.query

    const search_query = new RegExp(escapeStringRegexp(search) , 'ig');

    const users = await User.find({ name: search_query  ,verified: 'yes', is_account_active: 'yes' })
        .limit(limit).select('-password')

    const users_array =  []

    // for loop to iterate through each user
    for (const index in users) {

        //get the general user type
        const userType = await UserType.findOne({user_id:users[index]._id})
        //map the user with their type
        const type = await Type.findOne({_id:userType.type_id,})

        //push data to user array
        users_array.push({
            id:users[index]._id,
            name:users[index].name,
            username:users[index].username,
            phone:users[index].phone,
            bio:users[index].bio,
            email:users[index].email,
            user_type:type.name,
        })
    }
    res.status(200).json(users_array)
})

/**
 * @description Update a user account status
 * @route PUT /api/users/update-user-account-status
 * @access Private | Backend
 */
const updateUserAccountStatus = asyncHandler( async ( req ,res ) =>{
    const {is_account_active, user_id} = req.body

    //check the user type of the logged in user to see if there admins
    if(req.type.name !== 'admin') {
        res.status(400)
        throw new Error('Only Admins can update user status')
    }
    //check if the logged in user is  the same as the user being updated
    if(req.user.id === user_id) {
        res.status(400)
        throw new Error('You can\'t update your own account status.')
    }
    const user = await User.findById(user_id)

    //check if user exists
    if (!user) {
        res.status(400)
        throw new Error('User not found')
    }

    //update the user
    const updateUserData = await User.findOneAndUpdate(
        {_id: user.id},
        {is_account_active: is_account_active},
        {returnOriginal: false})
    res.status(200).json(updateUserData)

})

/**
 * @description Update a user account status
 * @route PUT /api/users/update-user-account-status
 * @access Private | Backend
 */
const getAccountTypes = asyncHandler( async ( req ,res ) =>{

    //get the account types
    const types = await Type.find()

    const types_array = []
    // for loop to iterate through each account type
    for (const index in types) {

        types_array.push({
            id:types[index]._id,
            name:types[index].name,
        })
    }
    res.status(200).json(types_array)

})

/**
 *  user authentication
 */

/**
 * generate JWT for user authentication
 */
const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET,{
        expiresIn: '30d',
    })
}

module.exports = {
    updateUserAccountStatus,
    getUserByUsername,
    getAccountTypes,
    updateUserType,
    forgotPasword,
    verifyUserOTP,
    resendUserOTP,
    resetPasword,
    registerUser,
    searchUsers,
    updateUser,
    loginUser,
    listUsers,
    getMe,

}
