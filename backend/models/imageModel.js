const mongoose = require('mongoose')

const imageSchema = mongoose.Schema(
    {
        model_id: {
            type: String,
            required: true,
        },
        imageable_type: {
            type: String,
            required: true,
        },
        path : {
            type: String,
            required: true
        },
        caption : {
            type: String,
        },

    }, {
        timestamps: true
    }
)
module.exports = mongoose.model('Image', imageSchema)
