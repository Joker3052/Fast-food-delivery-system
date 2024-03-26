const mongoose = require('mongoose');
function convertBase64 (buffer) {

        return Buffer.from(buffer, 'base64')
    
}
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        // required: true
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    images: [{
        data: Buffer,
        contentType: String
    }],
    price : {
        type: Number,
        default:0
    },
    priceUsd : {
        type: Number,
        default:0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numRated: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isValid: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    // user: {
    //     type: String,
    //     default:null,
    // },
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


exports.Product = mongoose.model('Product', productSchema);
