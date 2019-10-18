const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    description: {
        type:String,
        firstname: String,
        lastname: String,
        age: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    admin:{
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Users', usersSchema);