const {Ordermess} = require('../models/ordermess');
const {Order} = require('../models/order');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

// http://localhost:8080/tttn/ordermess?orders=6553cc59c46a1274e138d6d4
// http://localhost:8080/tttn/ordermess?users=6553b71403d45d46c46a9624
//http://localhost:8080/tttn/ordermess?orders=65579a0c16dc3161b86d1b56&users=65579a4216dc3161b86d1b59
router.get(`/`, async (req, res) => {
    try {
        let filter = {};

        if (req.query.orders) {
            filter = { order: req.query.orders.split(',') };
        }

        if (req.query.users) {
            filter = { ...filter, user: req.query.users.split(',') };
        }

        const ordermessList = await Ordermess.find(filter)
            .populate({
                path: 'user',
                select: '-passwordHash -image -imgStore', // Loại bỏ các trường không mong muốn
            });

        if (!ordermessList || ordermessList.length === 0) {
            return res.status(404).json({ success: false, message: 'No ordermesss found' });
        }

        res.status(200).send(ordermessList);
    } catch (error) {
        console.error('Error fetching ordermesss:', error);
        res.status(500).json({ success: false, message: error });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const ordermess = await Ordermess.findById(req.params.id);
  
      if (!ordermess) {
        res.status(404).json({ message: 'The ordermess with the given ID was not found.' });
      } else {
        res.status(200).send(ordermess);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  });


router.post('/', async (req, res) => {
    try {
        const order = await Order.findById(req.body.order);
        if (!order) {
            return res.status(400).send('Invalid order');
        }

        const user = await User.findById(req.body.user);
        if (!user) {
            return res.status(400).send('Invalid User');
        }

            // Nếu chưa tồn tại, tạo mới ordermess
            let ordermess = new Ordermess({
                order: req.body.order,
                user: req.body.user,
                comment: req.body.comment,
            });

            ordermess = await ordermess.save();

            if (!ordermess) {
                return res.status(400).send('The ordermess cannot be created!');
            }


            res.send(ordermess);
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const order = await order.findById(req.body.order);

        if (!order) {
            return res.status(400).send('Invalid order');
        }
      const rate1= await ordermess.findById( req.params.id)
      if (!rate1) {
        return res.status(400).send('The ordermess cannot be updated!');
    }
        const ordermess = await ordermess.findByIdAndUpdate(
            req.params.id,
            {
                comment: req.body.comment,
            },
            { new: true }
        );      

 
        //  console.log('After save:', order.numordermess, order.ratings);
 
         res.send(ordermess);
       
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


router.get(`/get/count`, async (req, res) => {
    try {
        let filter = {};

        if (req.query.orders) {
            filter.order = { $in: req.query.orders.split(',') };
        }

        if (req.query.users) {
            filter.user = { $in: req.query.users.split(',') };
        }

        const ordermessCount = await ordermess.countDocuments(filter);

        if (!ordermessCount) {
            return res.status(404).json({ success: false, message: 'No ordermesss found' });
        }

        res.send({
            ordermessCount: ordermessCount
        });
    } catch (error) {
        console.error("Error getting order item count:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.delete('/:id', (req, res)=>{
    Ordermess.findByIdAndRemove(req.params.id).then(ordermess =>{
        if(ordermess) {
            return res.status(200).json({success: true, message: 'the ordermess is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "ordermess not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})
module.exports =router;