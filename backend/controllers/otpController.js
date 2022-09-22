const asyncHandler = require('express-async-handler')

const AWS = require("aws-sdk");
const Otp = require("../models/otpModel");
const moment = require("moment/moment");
const dotenv = require('dotenv').config();

//function to generate random number
const generateRandomNumber = (min, max)  => {
    return Math.floor(Math.random() * (max - min) + min);
}

// function to save OTP code
const saveOTP = async (model_id ,verification_type ,expires_at ) => {

    return await Otp.create({
        code: generateRandomNumber(1000, 9999),
        model_id: model_id,
        verification_type: verification_type,
        expiresAt: moment().add(expires_at, 'minute').format('YYYY-MM-DD hh:mm:ss')
    })
}

//function to send OTP using AWS-SNS
const sendSMS = (phone_umber ,message) => {

    let params = {
        Message: process.env.APP_NAME+': '+message,
        PhoneNumber: phone_umber,
    };
    return new AWS.SNS({apiVersion: '2010–03–31'}).publish(params).promise()
        .then(message => {
            console.log('OTP SEND SUCCESS');
        })
        .catch(err => {
            return err;});
}


module.exports = {
    generateRandomNumber,
    sendSMS,
    saveOTP
}
