const asyncHandler = require('express-async-handler')

const AWS = require("aws-sdk");

//function to generate random number
const generateRandomNumber = (min, max)  => {
    return Math.floor(Math.random() * (max - min) + min);
}

//function to send OTP using AWS-SNS
const sendOTP = (phoneNumber , otp ,expires) => {

    let params = {
        Message: 'Your Personal Review OTP code is: ' + otp +' expires at ' + expires ,
        PhoneNumber: phoneNumber,
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
    sendOTP,
}
