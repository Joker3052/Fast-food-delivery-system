const mongoose = require('mongoose');
function convertBase64 (buffer) {

    return Buffer.from(buffer, 'base64')

}
const shipperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: null
    },
    address:{
        type: String,
        default: null
    },
    passwordHash: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        default: null
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
});

shipperSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

shipperSchema.set('toJSON', {
    virtuals: true,
});

exports.Shipper = mongoose.model('Shipper', shipperSchema);
exports.shipperSchema = shipperSchema;
