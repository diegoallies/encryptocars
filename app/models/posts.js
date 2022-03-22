const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postText:{
        type: String,
        required: true
    },

    img:{
        type: String,
        required: false
    },

    created_by: {
        type: String,
        required: true
    },

    fullname: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Post',postSchema)