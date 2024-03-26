const { User } = require('../models/user');
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
const { Product } = require('../models/product');
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
    const userList = await User.find().select('-passwordHash -image -imgStore');

    if (!userList) {
      return res.status(500).json({ success: false, error: 'Error fetching user list.' });
    }
    const formatteduserList = userList.map(user => {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        description: user.description,
        isAdmin: user.isAdmin,
        image: user.image ? `/tttn/user/imgUser/${user.id}` : null, // Đường dẫn đến route mới
        imgStore: user.imgStore ? `/tttn/user/imgStore/${user.id}` : null, // Đường dẫn đến route mới
        store: user.store,
        isStore: user.isStore,
        openAt: user.openAt,
        closeAt: user.closeAt,
        ratings: user.ratings,
        numRated: user.numRated
      };
    });
    res.send(formatteduserList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get(`/store`, async (req, res) => {
  try {
    let filter = {};
    filter.isStore = true;
    const userList = await User.find(filter).select('-passwordHash -image -imgStore');

    if (!userList) {
      return res.status(500).json({ success: false, error: 'Error fetching user list.' });
    }

    const formatteduserList = await Promise.all(userList.map(async (user) => {
      // Tính trung bình ratings của cửa hàng (loại bỏ các ratings bằng 0)
      const storeAggregate = await Product.aggregate([
        { $match: { user: user._id, ratings: { $ne: 0 } } },
        {
          $group: {
            _id: null,
            avgRatings: { $avg: '$ratings' },
            totalNumRated: { $sum: '$numRated' },
          },
        },
      ]);

      const storeStats = storeAggregate.length > 0 ? storeAggregate[0] : { avgRatings: 0, totalNumRated: 0 };

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        description: user.description,
        isAdmin: user.isAdmin,
        image: user.image ? `/tttn/user/imgUser/${user.id}` : null,
        imgStore: user.imgStore ? `/tttn/user/imgStore/${user.id}` : null,
        store: user.store,
        isStore: user.isStore,
        openAt: user.openAt,
        closeAt: user.closeAt,
        ratings: storeStats.avgRatings,
        numRated: storeStats.totalNumRated,
      };
    }));

    res.send(formatteduserList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// router.get(`/store`, async (req, res) => {
//   try {
//     let filter = {};
//     filter.isStore = true;
//     const userList = await User.find(filter).select('-passwordHash -image -imgStore');

//     if (!userList) {
//       return res.status(500).json({ success: false, error: 'Error fetching user list.' });
//     }
//     const formatteduserList = userList.map(user => {
//       return {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         phone: user.phone,
//         address: user.address,
//         description: user.description,
//         isAdmin: user.isAdmin,
//         image: user.image ? `/tttn/user/imgUser/${user.id}` : null, // Đường dẫn đến route mới
//         imgStore: user.imgStore ? `/tttn/user/imgStore/${user.id}` : null, // Đường dẫn đến route mới
//         store: user.store,
//         isStore: user.isStore,
//         openAt: user.openAt,
//         closeAt: user.closeAt,
//         ratings: user.ratings,
//         numRated: user.numRated
//       };
//     });
//     res.send(formatteduserList);
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash -image -imgStore');

    if (!user) {
      return res.status(500).json({ success: false, error: 'Error fetching user.' });
    }
// Tính trung bình ratings của cửa hàng (loại bỏ các ratings bằng 0)
const storeAggregate = await Product.aggregate([
  { $match: { user: user._id, ratings: { $ne: 0 } } },
  {
    $group: {
      _id: null,
      avgRatings: { $avg: '$ratings' },
      totalNumRated: { $sum: '$numRated' },
    },
  },
]);

const storeStats = storeAggregate.length > 0 ? storeAggregate[0] : { avgRatings: 0, totalNumRated: 0 };
    const formattedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      description: user.description,
      isAdmin: user.isAdmin,
      image: user.image ? `/tttn/user/imgUser/${user.id}` : null,
      imgStore: user.imgStore ? `/tttn/user/imgStore/${user.id}` : null, // Đường dẫn đến route mới
      store: user.store,
      isStore: user.isStore,
      openAt: user.openAt,
      closeAt: user.closeAt,
      ratings: storeStats.avgRatings,
      numRated: storeStats.totalNumRated,
    };

    res.send(formattedUser);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/storeAllInvalid/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Lấy userId từ tham số đường dẫn

    // Tìm người dùng theo id
    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Cập nhật tất cả sản phẩm của người dùng thành isValid = false
    const result = await Product.updateMany({ user: userId }, { isValid: false });

    console.log(`${result.nModified} products updated successfully`);
    return res.status(200).json({ message: `${result.nModified} products updated successfully` });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const upload = uploadOptions.fields([{ name: 'image', maxCount: 1 }, { name: 'imgStore', maxCount: 1 }]);

router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid user Id');
    }

    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, error: err.message });
      } else if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      const userExist = await User.findById(req.params.id);
      let newPassword;

      if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
      } else {
        newPassword = userExist.passwordHash;
      }

      const updatedFields = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        passwordHash: newPassword,
        description: req.body.description,
        isAdmin: req.body.isAdmin,
        store: req.body.store,
        isStore: req.body.isStore,
        openAt: req.body.openAt,
        closeAt: req.body.closeAt,
        ratings: req.body.ratings,
        numRated: req.body.numRated
      };

      // Cập nhật hình ảnh nếu có
      if (req.files && req.files.image) {
        const isValid = FILE_TYPE_MAP[req.files.image[0].mimetype];
        if (!isValid) {
          return res.status(400).send('Invalid image type');
        }

        updatedFields.image = {
          data: req.files.image[0].buffer,
          contentType: req.files.image[0].mimetype
        };
      }

      // Cập nhật imgStore nếu có
      if (req.files && req.files.imgStore) {
        const isValid = FILE_TYPE_MAP[req.files.imgStore[0].mimetype];
        if (!isValid) {
          return res.status(400).send('Invalid image type for imgStore');
        }

        updatedFields.imgStore = {
          data: req.files.imgStore[0].buffer,
          contentType: req.files.imgStore[0].mimetype
        };
      }

      // Sử dụng findByIdAndUpdate để cập nhật các trường đã kiểm tra
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true } // Trả về bản ghi đã được cập nhật
      );

      if (!updatedUser) {
        return res.status(404).send('User not found');
      }

      res.send("updatedUser");
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});
// PUT route to start password change and send OTP
router.post(`/put/startPass`, async (req, res) => {
  try {
    const { email, name, password } = req.body;
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu hay không
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).send('Email not exists.');
    }
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu OTP hay không
    let otpDocument = await Otp.findOne({ email });

    if (otpDocument) {
      // Nếu email đã tồn tại trong OTP, cập nhật OTP mới và thời gian hết hạn
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      const otpExpiration = 60; // Thời gian hết hạn của OTP, tính bằng giây

      otpDocument.otp = otp;
      otpDocument.expiresIn = otpExpiration;
    } else {
      // Nếu email không tồn tại trong OTP, tạo một bản ghi mới
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      const otpExpiration = 60; // Thời gian hết hạn của OTP, tính bằng giây

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


// PUT route to complete password change with a valid OTP
router.put('/put/completePass', async (req, res) => {
  try {
    const { otp } = req.body;

    // Kiểm tra xem OTP có hợp lệ không
    const otpDocument = await Otp.findOne({ otp });

    if (!otpDocument) {
      return res.status(400).send('Invalid OTP');
    }

    // Kiểm tra xem thời gian hết hạn của OTP
    if (otpDocument.expiresIn && (new Date() - otpDocument.updatedAt) / 1000 > otpDocument.expiresIn) {
      return res.status(400).send('Expired OTP');
    }

    // Hash mật khẩu mới
    const newPassword = bcrypt.hashSync(otpDocument.password, 10);

    // Cập nhật mật khẩu của người dùng
    const updatedUser = await User.findOneAndUpdate(
      { email: otpDocument.email }, // Use the email stored in the OTP document
      { passwordHash: newPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    // Xóa thông tin về OTP khỏi cơ sở dữ liệu
    await Otp.findByIdAndRemove(otpDocument._id);

    res.send('Password updated');
  } catch (error) {
    console.error('Error completing password change:', error);
    res.status(500).send('Internal Server Error');
  }
});



//   const upload = uploadOptions.single('image');
// router.put('/:id', async (req, res) => {
//     try {
//         if (!mongoose.isValidObjectId(req.params.id)) {
//             return res.status(400).send('Invalid user Id');
//         }

//         upload(req, res, async (err) => {
//             if (err instanceof multer.MulterError) {
//                 return res.status(400).json({ success: false, error: err.message });
//             } else if (err) {
//                 return res.status(500).json({ success: false, error: err.message });
//             }

//             const userExist = await User.findById(req.params.id);
//             let newPassword;

//             if (req.body.password) {
//                 newPassword = bcrypt.hashSync(req.body.password, 10);
//             } else {
//                 newPassword = userExist.passwordHash;
//             }

//             const updatedFields = {
//                 name: req.body.name,
//                 phone: req.body.phone,
//                 address: req.body.address,
//                 passwordHash: newPassword,
//                 description: req.body.description,
//                 isAdmin: req.body.isAdmin,
//                 store: req.body.store,
//                 isStore:req.body.isStore,
//                 openAt: req.body.openAt,
//                 closeAt: req.body.closeAt
//             };

//             // Cập nhật hình ảnh nếu có
//             if (req.file) {
//                 const isValid = FILE_TYPE_MAP[req.file.mimetype];
//                 if (!isValid) {
//                     return res.status(400).send('Invalid image type');
//                 }

//                 updatedFields.image = {
//                     data: req.file.buffer,
//                     contentType: req.file.mimetype
//                 };
//             }

//             // Sử dụng findByIdAndUpdate để cập nhật các trường đã kiểm tra
//             const updatedUser = await User.findByIdAndUpdate(
//                 req.params.id,
//                 updatedFields,
//                 { new: true } // Trả về bản ghi đã được cập nhật
//             );

//             if (!updatedUser) {
//                 return res.status(404).send('User not found');
//             }

//             res.send("updatedUser");
//         });
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });


router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;

    if (!user) {
      return res.status(400).send('The user not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          isStore: user.isStore,
          store: user.store,
          address: user.address,
          phone: user.phone
        },
        secret,
        { expiresIn: '7d' }
      );
      // res.status(200).send({ userId:user.id,email: user.email,name:user.name,isAdmin: user.isAdmin, token: token });
      res.status(200).send({ token: token, jk1: 'additional_text'});
    } else {
      res.status(400).send('Password is wrong!');
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post(`/register`, uploadOptions.fields([{ name: 'image', maxCount: 1 }, { name: 'imgStore', maxCount: 1 }]), async (req, res) => {
  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send('Email already exists. Please use a different email.');
    }

    // Kiểm tra xem password đã được cung cấp không
    if (!req.body.password) {
      return res.status(400).send('Yêu cầu nhập mật khẩu.');
    }

    // Nếu email chưa tồn tại, tiếp tục tạo người dùng mới
    let userData = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      description: req.body.description,
      isAdmin: req.body.isAdmin,
      store: req.body.store,
      isStore: req.body.isStore,
      openAt: req.body.openAt,
      closeAt: req.body.closeAt
    });

    // Process the 'image' field
    if (req.files && req.files.image) {
      const isValid = FILE_TYPE_MAP[req.files.image[0].mimetype];
      if (!isValid) {
        return res.status(400).send('Invalid image type for the profile picture');
      }

      userData.image = {
        data: req.files.image[0].buffer,
        contentType: req.files.image[0].mimetype
      };
    }

    // Process the 'imgStore' field
    if (req.files && req.files.imgStore) {
      const isValid = FILE_TYPE_MAP[req.files.imgStore[0].mimetype];
      if (!isValid) {
        return res.status(400).send('Invalid image type for the store image');
      }

      userData.imgStore = {
        data: req.files.imgStore[0].buffer,
        contentType: req.files.imgStore[0].mimetype
      };
    }

    const user = new User(userData);

    await user.save();
    if (!user) {
      return res.status(400).send('The user cannot be created!');
    }
    res.send("added user");
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.post(`/startRegistration`, async (req, res) => {
  try {
    const { email, name, password } = req.body;
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu hay không
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already exists. Please use a different email.');
    }
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu OTP hay không
    let otpDocument = await Otp.findOne({ email });

    if (otpDocument) {
      // Nếu email đã tồn tại trong OTP, cập nhật OTP mới và thời gian hết hạn
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      const otpExpiration = 60; // Thời gian hết hạn của OTP, tính bằng giây

      otpDocument.otp = otp;
      otpDocument.expiresIn = otpExpiration;
    } else {
      // Nếu email không tồn tại trong OTP, tạo một bản ghi mới
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      const otpExpiration = 60; // Thời gian hết hạn của OTP, tính bằng giây

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
        pass: 'lnml waav jbgy vvkg',
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

    // Lưu thông tin khác từ req.body vào đối tượng người dùng (nếu tồn tại)
    const userFields = ['phone', 'address', 'password', 'description', 'isAdmin', 'store', 'isStore', 'openAt', 'closeAt'];
    const userData = {
      email: otpDocument.email,
      name: otpDocument.name,
    };

    userFields.forEach((field) => {
      if (req.body[field]) {
        userData[field] = req.body[field];
      }
    });

    // Tạo hash mật khẩu và thêm vào đối tượng người dùng
    if (otpDocument.password) {
      userData.passwordHash = bcrypt.hashSync(otpDocument.password, 10);
    }

    // Process the 'image' field
    if (req.files && req.files.image) {
      const isValid = FILE_TYPE_MAP[req.files.image[0].mimetype];
      if (!isValid) {
        return res.status(400).send('Invalid image type for the profile picture');
      }

      userData.image = {
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

      userData.imgStore = {
        data: req.files.imgStore[0].buffer,
        contentType: req.files.imgStore[0].mimetype,
      };
    }

    const user = new User(userData);

    // Lưu người dùng vào cơ sở dữ liệu
    await user.save();

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
    const user = await User.findByIdAndRemove(req.params.id);

    if (user) {
      return res.status(200).json({ success: true, message: 'The user is deleted!' });
    } else {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get(`/get/count`, async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    if (userCount === null) {
      res.status(500).json({ success: false });
    } else {
      res.status(200).json({ success: true, userCount: userCount });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/imgUser/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Đặt loại nội dung và gửi dữ liệu hình ảnh
    res.contentType(user.image.contentType);
    res.send(user.image.data);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/imgStore/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.imgStore) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Đặt loại nội dung và gửi dữ liệu hình ảnh
    res.contentType(user.imgStore.contentType);
    res.send(user.imgStore.data);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;