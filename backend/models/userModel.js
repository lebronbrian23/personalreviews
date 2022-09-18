const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: [true ,'Name is required']
        },
        email:{
            type: String,
        },
        username:{
            type: String,
            required: [true ,'Username is required'],
            unique: true
        },
        phone:{
            type: String,
            required: [true ,'Phone is required'],
            unique: true
        },
        password:{
            type: String,
            required: [true ,'Password is required']
        },
        bio:{
            type: String,
        },
        profile_link:{
            type: String,
        },
        verified:{
            type: String,
            default :'no' //other value is yes
        },
        is_account_active:{
            type: String,
            default :'no' //other value is yes
        },
    },
    {
        timestamps: true,
    })
module.exports = mongoose.model('User' ,userSchema)
