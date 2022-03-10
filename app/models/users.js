const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone_number:{
        type: String,
        required: true
    },
    roles:{
        type: String,
        required: false
    },
    join_date:{
        type: String,
        default: Date.now
    }

})

module.exports = mongoose.model('User',userSchema)