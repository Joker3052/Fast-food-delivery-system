const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderLists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderList',
        default:null
    }],
    shippingAddress1: {
        type: String,
        required: true,
    },
    shippingAddress2: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
    zip: {
        type: String,
    },
    country: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    shipper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipper',
        default: null  // Giá trị mặc định khi shipper trống
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
    isPay: {
        type: Boolean,
        default: false,
    },
    isRate : {
        type: Boolean,
        default: false,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    payed: {
        type: Boolean,
        default: false,
    },
    mess: {
        type: String,
        default:null,
    },
    store: {
        type: String,
        required: true,
    },
    IdStore: {
        type: String,
        required: false,
    },
})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);



/**
Order Example:

{
    "orderLists" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : "Flowers Street , 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */