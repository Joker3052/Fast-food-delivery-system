const mongoose = require('mongoose');

const ordermessSchema = mongoose.Schema({
    comment:{
        type:String,
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

exports.Ordermess = mongoose.model('Ordermess', ordermessSchema);

