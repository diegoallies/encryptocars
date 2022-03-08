const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postText:{
        type: String,
        required: true
    },

    img:{
        type: String,
        required: true
    },

    created_by: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Post',postSchema)