const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    comment:{
        type:String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

exports.Contact = mongoose.model('Contact', contactSchema);

