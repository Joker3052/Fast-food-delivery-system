const {Shipper} = require('../models/shipper');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    try {
      const shipperList = await Shipper.find().select('-passwordHash');
  
      if (!shipperList) {
        return res.status(500).json({ success: false, error: 'Error fetching shipper list.' });
      }
      
      res.send(shipperList);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  router.get(`/isT`, async (req, res) => {
    let filter = {};
    // Thêm điều kiện chỉ lấy sản phẩm khi isFeatured là true
    filter.isFeatured = true;
    try {
      const shipperList = await Shipper.find(filter).select('-passwordHash');
  
      if (!shipperList) {
        return res.status(500).json({ success: false, error: 'Error fetching shipper list.' });
      }
      
      res.send(shipperList);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  router.get(`/isF`, async (req, res) => {
    let filter = {};
    // Thêm điều kiện chỉ lấy shipper khi isFeatured là false
    filter.isFeatured = false;
    try {
      const shipperList = await Shipper.find(filter).select('-passwordHash');
  
      if (!shipperList) {
        return res.status(500).json({ success: false, error: 'Error fetching shipper list.' });
      }
      
      res.send(shipperList);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  router.get('/:id', async (req, res) => {
    try {
      const shipper = await Shipper.findById(req.params.id).select('-passwordHash');
  
      if (!shipper) {
        return res.status(404).json({ success: false, message: 'The shipper with the given ID was not found.' });
      }
  
      res.status(200).send(shipper);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  
  router.put('/:id', async (req, res) => {
    try {
      const shipperExist = await Shipper.findById(req.params.id);
      let newPassword;
      
      if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
      } else {
        newPassword = shipperExist.passwordHash;
      }
  
      const shipper = await Shipper.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          phone: req.body.phone,
          address:req.body.address,
          passwordHash: newPassword,
          description: req.body.description,
          image:req.body.image,
          isFeatured:req.body.isFeatured
        },
        { new: true }
      );
  
      if (!shipper) {
        return res.status(400).send('The shipper cannot be created!');
      }
  
      res.send(shipper);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
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
            isAdmin: shipper.isAdmin
          },
          secret,
          { expiresIn: '1d' }
        );
       
        res.status(200).send({ shipper: shipper.email, token: token });
      } else {
        res.status(400).send('Password is wrong!');
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  router.post('/register', async (req, res) => {
    try {
      // Kiểm tra xem email đã tồn tại hay chưa
      const existingshipper = await Shipper.findOne({ email: req.body.email });
      if (existingshipper) {
        return res.status(400).send('Email already exists. Please use a different email.');
      }

      // Nếu email chưa tồn tại, tiếp tục tạo người dùng mới
      let shipper = new Shipper({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        description: req.body.description,
        image:req.body.image,
        isFeatured:req.body.isFeatured
      });
  
      shipper = await shipper.save();
  
      if (!shipper) {
        return res.status(400).send('The shipper cannot be created!');
      }
  
      res.send("registered");
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
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


module.exports =router;