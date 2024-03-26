const mongoose = require('mongoose');

const orderListSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
})

exports.OrderList = mongoose.model('OrderList', orderListSchema);

