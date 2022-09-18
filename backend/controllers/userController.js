const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const Otp = require('../models/otpModel')
const moment = require('moment')
const {generateRandomNumber ,sendOTP} = require('./otpController')
const Type = require("../models/typeModel");
const UserType = require("../models/userTypeModel");
const Review = require("../models/reviewModel");

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
    //check if user with phone exists
    const phoneExists = await User.findOne({phone})
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
        phone,
        username,
        password: hashedPassword,
        profile_link:username
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
        sendOTP(user.phone ,otp.code ,otp.expiresAt)

        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
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
    const user = await User.findById(req.user.id).select('-password')
    //check if user exists
    if (user){
        // generate , save and send OTP to users phone
        const otp = await Otp.create({
            code: generateRandomNumber(1000,9999),
            model_id: user.id,
            verification_type:'User',
            expiresAt:moment().add(6 , 'minute').format('YYYY-MM-DD hh:mm:ss')
        })

        //send OTP through sms
        sendOTP(user.phone ,otp.code ,otp.expiresAt)

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

    let current_time = moment().format('YYYY-MM-DD hh:mm:ss')
    const {_id} = await  User.findById(req.user.id)
    const {code} = req.body

    //get the otp
    const otp  = await Otp.findOne({code ,'model_id': _id})

    //check if otp exists
    if(otp){
        //check if otp status is marked as new
        if(otp.status === 'new'){
            //check if otp is not expire
            if(otp.expiresAt >= current_time){
                await otp.updateOne({status:'used'})
                res.status(200).json({message:'Account has been verified'})

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
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Username or password don\'t match')
    }

})

/**
 * @description Authenticate a user
 * @route GET /api/users
 * @access Private
 */
const getMe = asyncHandler (async (req, res) => {
    const {_id , name , username ,phone ,email ,user_type} = await User.findById(req.user.id)

    //get the general user type
    const userType = await UserType.findOne({user_id:_id})

    //map the user with their type
    const type = await Type.findOne({
        _id:userType.type_id,
    })

    res.json({
        id:_id,
        name,
        username,
        phone,
        email,
        user_type:type.name,
    })
})

/**
 * @description Update a user
 * @route PUT /api/users
 * @access Private
 */
const updateUser = asyncHandler( async ( req ,res ) =>{
    const {bio , profile_link} = req.body
    const user = await User.findById(req.user.id)

    //check if review exists
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }
    //update the review
    const updateUserData = await User.findOneAndUpdate({_id:user.id} ,{bio :bio , profile_link: profile_link} , {returnOriginal: false})

    res.status(200).json(updateUserData)
})
//generate JWT
const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET,{
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    verifyUserOTP,
    resendUserOTP,
    updateUser
}
