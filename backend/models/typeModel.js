const mongoose = require('mongoose')

const typeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true
        },
        level: {
            type: Number,
            required: true,
            min:1,
            max:5
        },
    }, {
        timestamps: true
    }
)
module.exports = mongoose.model('Type', typeSchema)
