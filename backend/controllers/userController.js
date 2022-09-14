const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const Otp = require('../models/otpModel')
const moment = require('moment')
const {generateRandomNumber ,sendOTP} = require('./otpController')

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
        password: hashedPassword
    })

    if (user){

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
 * @description Verify user OTP
 * @route POST /api/users
 * @access Public
 */
const verifyUserOTP = asyncHandler (async  (req, res) => {

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
    const {_id , name , username ,phone ,email} = await  User.findById(req.user.id)

    res.json({
        id:_id,
        name,
        username,
        phone,
        email
    })
})

//generate JWT
const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET,{
        expiresIn: '30d',
    })
}

/*/function to generate random number
const generateRandomNumber = (min, max)  => {
    return Math.floor(Math.random() * (max - min) + min);
}
//function to send OTP using AWS-SNS
const sendOTP = (mobileNo) =>{
    //let mobileNo = "+16476329002";
    let OTP = generateRandomNumber(1000,9999);

    let params = {
        Message: "Welcome! your mobile OTP code is: " + OTP +" Mobile Number is:" +mobileNo,
        PhoneNumber: mobileNo,
    };
    return new AWS.SNS({apiVersion: '2010–03–31'}).publish(params).promise()
        .then(message => {
            console.log("OTP SEND SUCCESS");
        })
        .catch(err => {
            console.log("Error "+err)
            return err;});
}
//sendOTP();//calling send otp function
*/
module.exports = {
    registerUser,
    loginUser,
    getMe
}
