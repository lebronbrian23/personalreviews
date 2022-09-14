const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema(
    {
        reviewer_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        reviewee_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        description : {
            type: String,
            required: [true , 'Please add a description']
        },
        status:{
            type: String,
            default: 'live'
        },
        rating:{
            type: Number,
            default: 0,
            max:5
        }
    }, {
        timestamps: true
    }
)
module.exports = mongoose.model('Review', reviewSchema)
