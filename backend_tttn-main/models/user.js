const mongoose = require('mongoose');
function convertBase64 (buffer) {

    return Buffer.from(buffer, 'base64')

}
const userSchema = new mongoose.Schema({
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
        required: null,
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
    isAdmin: {
        type: Boolean,
        default: false,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    imgStore: {
        data: Buffer,
        contentType: String,
    },
    store: {
        type: String,
        default: null,
    },
    openAt: {
        type: String,
        default: null,
    },
    closeAt: {
        type: String,
        default: null,
    },
    isStore: {
        type: Boolean,
        default: false,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numRated: {
        type: Number,
        default: 0,
    },
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
