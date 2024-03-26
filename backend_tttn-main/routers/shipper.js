const {Shipper} = require('../models/shipper');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const Otp = require('../models/otp');
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/webp': 'webp'
}

const storage = multer.memoryStorage(); // Sử dụng memory storage để không lưu file lên đĩa
const uploadOptions = multer({ storage: storage });
router.get(`/`, async (req, res) => {
    try {
      const shipperList = await Shipper.find().select('-passwordHash');
  
      if (!shipperList) {
        return res.status(500).json({ success: false, error: 'Error fetching shipper list.' });
      }
      const formattedshipperList = shipperList.map(shipper => {
        return {
            id: shipper.id,
            email:shipper.email,
            name: shipper.name,
            phone: shipper.phone,
            address:shipper.address,
            description: shipper.description,
            image: shipper.image ? `/tttn/shipper/image/${shipper.id}` : null, // Đường dẫn đến route mới
            isFeatured:shipper.isFeatured
        };
    });
      res.send(formattedshipperList);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  // router.get('/:id', async (req, res) => {
  //   try {
  //     const user = await User.findById(req.params.id).select('-passwordHash');
  
  //     if (!user) {
  //       return res.status(500).json({ success: false, error: 'Error fetching user.' });
  //     }
  
  //     const formattedUser = {
  //       id: user.id,
  //       email: user.email,
  //       name: user.name,
  //       phone: user.phone,
  //       address: user.address,
  //       description: user.description,
  //       isAdmin: user.isAdmin,
  //       image: user.image ? `/tttn/user/image/${user.id}` : null,
  //       store: user.store,
  //       openAt: user.openAt,
  //       closeAt: user.closeAt
  //     };
  
  //     res.send(formattedUser);
  //   } catch (error) {
  //     res.status(500).json({ success: false, error: error.message });
  //   }
  // });
  router.get('/:id', async (req, res) => {
    try {
      const shipper = await Shipper.findById(req.params.id).select('-passwordHash');
  
      if (!shipper) {
        return res.status(500).json({ success: false, error: 'Error fetching shipper.' });
      }
  
      const formattedShipper = {
        id: shipper.id,
        email: shipper.email,
        name: shipper.name,
        phone: shipper.phone,
        address: shipper.address,
        description: shipper.description,
        isFeatured: shipper.isFeatured,
        image: shipper.image ? `/tttn/shipper/image/${shipper.id}` : null,
      };
  
      res.send(formattedShipper);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  const upload = uploadOptions.single('image');

router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid shipper Id');
        }

        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, error: err.message });
            } else if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }

            const shipperExist = await Shipper.findById(req.params.id);
            let newPassword;

            if (req.body.password) {
                newPassword = bcrypt.hashSync(req.body.password, 10);
            } else {
                newPassword = shipperExist.passwordHash;
            }

            const updatedFields = {
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                passwordHash: newPassword,
                description: req.body.description,
                isFeatured:req.body.isFeatured
            
            };

            // Cập nhật hình ảnh nếu có
            if (req.file) {
                const isValid = FILE_TYPE_MAP[req.file.mimetype];
                if (!isValid) {
                    return res.status(400).send('Invalid image type');
                }

                updatedFields.image = {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                };
            }

            // Sử dụng findByIdAndUpdate để cập nhật các trường đã kiểm tra
            const updatedshipper = await Shipper.findByIdAndUpdate(
                req.params.id,
                updatedFields,
                { new: true } // Trả về bản ghi đã được cập nhật
            );

            if (!updatedshipper) {
                return res.status(404).send('shipper not found');
            }

            res.send("updatedshipper");
        });
    } catch (error) {
        console.error('Error updating shipper:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/login', async (req, res) => {
    try {
      const shipper = await Shipper.findOne({ email: req.body.email });
      const secret = process.env.secret;
  
      if (!shipper) {
        return res.status(400).send('The shipper not found');
      }
  
      if (shipper && bcrypt.compareSync(req.body.password, shipper.passwordHash)) {
        const token = jwt.sign(
          {
            shipperId: shipper.id,
            email: shipper.email,
            name:shipper.name,
            isFeatured: shipper.isFeatured
          },
          secret,
          { expiresIn: '7d' }
        );
       
        res.status(200).send({ shipperId:shipper.id,email: shipper.email,name:shipper.name,isFeatured: shipper.isFeatured, token: token });
      } else {
        res.status(400).send('Password is wrong!');
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.post(`/register`, uploadOptions.single('image'), async (req, res) => {
    try {
              // Kiểm tra xem email đã tồn tại hay chưa
      const existingshipper = await Shipper.findOne({ email: req.body.email });
      if (existingshipper) {
        return res.status(400).send('Email already exists. Please use a different email.');
      }
      console.log(req.body.email)
      // Kiểm tra xem password đã được cung cấp không
        if (!req.body.password) {
            return res.status(400).send('Yêu cầu nhập mật khẩu.');
        }
      // Nếu email chưa tồn tại, tiếp tục tạo người dùng mới
      let shipperData = new Shipper({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        description: req.body.description,
        isFeatured:req.body.isFeatured
      });
  
        if (req.file) {
            // Nếu có file ảnh được gửi lên
            const isValid = FILE_TYPE_MAP[req.file.mimetype];
            if (!isValid) {
                return res.status(400).send('Invalid image type');
            }
  
            shipperData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
  
        const shipper = new Shipper(shipperData);
  
        await shipper.save();
        if (!shipper) {
        return res.status(400).send('The shipper cannot be created!');
      }
        res.send("added shipper");
    } catch (error) {
        console.error('Error creating shipper:', error);
        res.status(500).send('Internal Server Error');
    }
  });    
  router.post(`/startRegistration`, async (req, res) => {
    try {
      const { email, name, password } = req.body;
  
      // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu Shipper hay không
      const existingShipper = await Shipper.findOne({ email });
      if (existingShipper) {
        return res.status(400).send('Email already exists. Please use a different email.');
      }
  
      // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu OTP hay không
      let otpDocument = await Otp.findOne({ email });
  
      if (otpDocument) {
        // Nếu email đã tồn tại trong OTP, cập nhật OTP mới và thời gian hết hạn
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        const otpExpiration = 9999; // Thời gian hết hạn của OTP, tính bằng giây
  
        otpDocument.otp = otp;
        otpDocument.expiresIn = otpExpiration;
      } else {
        // Nếu email không tồn tại trong OTP, tạo một bản ghi mới
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        const otpExpiration = 9999; // Thời gian hết hạn của OTP, tính bằng giây
  
        otpDocument = new Otp({ email, name, password, otp, expiresIn: otpExpiration });
      }
  
      // Lưu hoặc cập nhật OTP vào cơ sở dữ liệu
      await otpDocument.save();
  
      // Gửi OTP qua email
      const senderEmail = '6food2412@gmail.com';
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: senderEmail,
          pass: 'osww wxqs dveb amob',
        },
      });
  
      const mailOptions = {
        from: senderEmail,
        to: [email, senderEmail],
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otpDocument.otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: 'Failed to send OTP' });
        } else {
          console.log('Email sent: ' + info.response);
          return res.json({ success: true, message: 'OTP sent successfully. Proceed to complete registration.' });
        }
      });
    } catch (error) {
      console.error('Error starting registration:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.post(`/completeRegistration`, uploadOptions.fields([{ name: 'image', maxCount: 1 }, { name: 'imgStore', maxCount: 1 }]), async (req, res) => {
    try {
      const { otp } = req.body;
  
      // Kiểm tra xem OTP có tồn tại không
      if (!otp) {
        return res.status(400).send('OTP is required.');
      }
  
      // Tìm OTP trong cơ sở dữ liệu
      const otpDocument = await Otp.findOne({ otp });
  
      // Kiểm tra xem OTP có tồn tại trong cơ sở dữ liệu không
      if (!otpDocument) {
        return res.status(400).send('Invalid OTP.');
      }
  
      // Kiểm tra xem thời gian hết hạn của OTP
      if (otpDocument.expiresIn && (new Date() - otpDocument.updatedAt) / 1000 > otpDocument.expiresIn) {
        return res.status(400).send('Expired OTP.');
      }
  
      // Lưu thông tin khác từ req.body vào đối tượng người giao hàng (nếu tồn tại)
      const shipperFields = ['phone', 'address', 'password', 'description'];
      const shipperData = {
        email: otpDocument.email,
        name: otpDocument.name,
      };
  
      shipperFields.forEach((field) => {
        if (req.body[field]) {
          shipperData[field] = req.body[field];
        }
      });
  
      // Tạo hash mật khẩu và thêm vào đối tượng người giao hàng
      if (otpDocument.password) {
        shipperData.passwordHash = bcrypt.hashSync(otpDocument.password, 10);
      }
  
      // Process the 'image' field
      if (req.files && req.files.image) {
        const isValid = FILE_TYPE_MAP[req.files.image[0].mimetype];
        if (!isValid) {
          return res.status(400).send('Invalid image type for the profile picture');
        }
  
        shipperData.image = {
          data: req.files.image[0].buffer,
          contentType: req.files.image[0].mimetype,
        };
      }
  
      // Process the 'imgStore' field
      if (req.files && req.files.imgStore) {
        const isValid = FILE_TYPE_MAP[req.files.imgStore[0].mimetype];
        if (!isValid) {
          return res.status(400).send('Invalid image type for the store image');
        }
  
        shipperData.imgStore = {
          data: req.files.imgStore[0].buffer,
          contentType: req.files.imgStore[0].mimetype,
        };
      }
  
      const shipper = new Shipper(shipperData);
  
      // Lưu người giao hàng vào cơ sở dữ liệu
      await shipper.save();
  
      // Xóa thông tin về OTP khỏi cơ sở dữ liệu
      await Otp.findByIdAndRemove(otpDocument._id);
  
      return res.json({ success: true, message: 'Registration successful.' });
    } catch (error) {
      console.error('Error completing registration:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.delete('/:id', async (req, res) => {
    try {
      const shipper = await Shipper.findByIdAndRemove(req.params.id);
      
      if (shipper) {
        return res.status(200).json({ success: true, message: 'The shipper is deleted!' });
      } else {
        return res.status(404).json({ success: false, message: 'shipper not found!' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

router.get(`/get/count`, async (req, res) => {
    try {
      const shipperCount = await Shipper.countDocuments();
      
      if (shipperCount === null) {
        res.status(500).json({ success: false });
      } else {
        res.status(200).json({ success: true, shipperCount: shipperCount });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  router.get('/image/:id', async (req, res) => {
    try {
        const shipper = await Shipper.findById(req.params.id);
  
        if (!shipper || !shipper.image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
  
        // Đặt loại nội dung và gửi dữ liệu hình ảnh
        res.contentType(shipper.image.contentType);
        res.send(shipper.image.data);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).send('Internal Server Error');
    }
  });

module.exports =router;