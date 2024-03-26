const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

router.post('/', (req, res) => {
  // Lấy địa chỉ email từ yêu cầu
  const recipientEmail = req.body.email;
  console.log(recipientEmail);

  // Kiểm tra xem email có được cung cấp không
  if (!recipientEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Tạo mã OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

  // Địa chỉ email gốc (địa chỉ sử dụng để đăng nhập vào ứng dụng)
  const senderEmail = '6food2412@gmail.com';

  // Thiết lập thông tin tài khoản email để gửi OTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: 'osww wxqs dveb amob'
    }
  });

  // Nội dung email
  const mailOptions = {
    from: senderEmail,
    to: [senderEmail, recipientEmail], // Gửi cho cả email gốc và email đích
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  };

  // Gửi email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.json({ success: true, message: 'OTP sent successfully' });
    }
  });
});

module.exports = router;
