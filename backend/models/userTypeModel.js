const mongoose = require('mongoose')

const userTypeSchema = mongoose.Schema(
    {
        type_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Type'
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
    }, {
        timestamps: true
    }
)
module.exports = mongoose.model('UserType', userTypeSchema)
