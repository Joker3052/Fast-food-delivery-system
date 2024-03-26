const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Thêm TTL index cho trường createdAt với thời gian hết hạn (expireAfterSeconds) là expiresIn
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: '$expiresIn' });

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
