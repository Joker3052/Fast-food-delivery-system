const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const authRouter = express.Router();
authRouter.use(bodyParser.json());

// Middleware xác thực
const authenticateMiddleware = (req, res, next) => {
  const token = req.header('Authorization').split(" ")[1];
  const secret = process.env.secret;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Gán thông tin người dùng vào req.user
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Route yêu cầu xác thực
authRouter.get('/', authenticateMiddleware, (req, res) => {
  // Nếu middleware authenticateMiddleware chạy mà không gặp lỗi, tức là token hợp lệ
  // Thông tin người dùng sẽ được lưu trong req.user và có thể được sử dụng ở đây
  res.json({ user: req.user });
});


module.exports = authRouter;
