const jwt = require('jsonwebtoken')

const asycHandler = require('express-async-handler')

const User = require('../models/userModel')
const UserType = require("../models/userTypeModel");
const Type = require("../models/typeModel");

const protect = asycHandler ( async  ( req , res, next) => {
    let token

    //check if headers and bearer token exist
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
            //get token from the header
            token = req.headers.authorization.split(' ')[1]

            //verify the token
            const deconded = jwt.verify(token , process.env.JWT_SECRET)

            //get user from the token
            req.user = await User.findById(deconded.id).select('-password')

            //get the general user type
            const userType = await UserType.findOne({user_id:req.user.id})

            //map the user with their type
            req.type = await Type.findOne({_id:userType.type_id,})

            next()
        }catch (error){

            res.status(401)
            throw new Error('Not authorized')

        }
    }else{
        res.status(401)
        throw new Error('Not authorized, no token provided')
    }
})
module.exports = { protect }
