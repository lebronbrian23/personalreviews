const mongoose = require('mongoose')

const otpSchema = mongoose.Schema(
    {
        model_id: {
            type: String,
            required: true,
        },
        verification_type: {
            type: String,
            required: true,
        },
        code : {
            type: Number,
            required: true
        },
        status:{
            type: String,
            default: 'new' //other values are used and expired
        },
        expiresAt:{
            type: String,
        },

    }, {
        timestamps: true
    }
)
module.exports = mongoose.model('Otp', otpSchema)
