const {Rated} = require('../models/rated');
const {Product} = require('../models/product');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

// http://localhost:8080/tttn/rated?products=6553cc59c46a1274e138d6d4
// http://localhost:8080/tttn/rated?users=6553b71403d45d46c46a9624
//http://localhost:8080/tttn/rated?products=65579a0c16dc3161b86d1b56&users=65579a4216dc3161b86d1b59
router.get(`/`, async (req, res) => {
    try {
        let filter = {};

        if (req.query.products) {
            filter = { product: req.query.products.split(',') };
        }

        if (req.query.users) {
            filter = { ...filter, user: req.query.users.split(',') };
        }

        const ratedList = await Rated.find(filter)
            .populate({
                path: 'product',
                select: '-image -images -isFeatured',
            })
            .populate({
                path: 'user',
                select: '-passwordHash -image -imgStore', // Loại bỏ các trường không mong muốn
            });

        if (!ratedList || ratedList.length === 0) {
            return res.status(404).json({ success: false, message: 'No rateds found' });
        }

        res.status(200).send(ratedList);
    } catch (error) {
        console.error('Error fetching rateds:', error);
        res.status(500).json({ success: false, message: error });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const rated = await Rated.findById(req.params.id);
  
      if (!rated) {
        res.status(404).json({ message: 'The rated with the given ID was not found.' });
      } else {
        res.status(200).send(rated);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  });

//   router.post('/', async (req, res) => {
//     try {
//         const product = await Product.findById(req.body.product);
//         if (!product) {
//             return res.status(400).send('Invalid product');
//         }

//         const user = await User.findById(req.body.user);
//         if (!user) {
//             return res.status(400).send('Invalid User');
//         }

//         // Kiểm tra xem đã có rated cho user và product chưa
//         let existingRated = await Rated.findOne({ user: req.body.user, product: req.body.product });

//         if (existingRated) {
//             return res.send("Has been rated!");
//         } else {
//             // Nếu chưa tồn tại, tạo mới rated
//             let rated = new Rated({
//                 product: req.body.product,
//                 quantity: req.body.quantity,
//                 user: req.body.user,
//                 comment: req.body.comment,
//             });

//             rated = await rated.save();

//             if (!rated) {
//                 return res.status(400).send('The rated cannot be created!');
//             }

//             // Cập nhật trường numRated và rating trong product
//             product.numRated += 1;
//             product.ratings = ((Number(product.numRated) - 1) * Number(product.ratings) + Number(req.body.quantity)) / Number(product.numRated);
//             // product.numRated += 1;
//             // product.ratings = Number(product.ratings) + Number(req.body.quantity);
//             // Lưu lại product sau khi cập nhật
//             await product.save();

//             res.send(rated);
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });
router.post('/', async (req, res) => {
    try {
        const product = await Product.findById(req.body.product);
        if (!product) {
            return res.status(400).send('Invalid product');
        }

        const user = await User.findById(req.body.user);
        if (!user) {
            return res.status(400).send('Invalid User');
        }

            // Nếu chưa tồn tại, tạo mới rated
            let rated = new Rated({
                product: req.body.product,
                quantity: req.body.quantity,
                user: req.body.user,
                comment: req.body.comment,
            });

            rated = await rated.save();

            if (!rated) {
                return res.status(400).send('The rated cannot be created!');
            }

            // Cập nhật trường numRated và rating trong product
            product.numRated += 1;
            product.ratings = ((Number(product.numRated) - 1) * Number(product.ratings) + Number(req.body.quantity)) / Number(product.numRated);
            // product.numRated += 1;
            // product.ratings = Number(product.ratings) + Number(req.body.quantity);
            // Lưu lại product sau khi cập nhật
            await product.save();

            res.send(rated);
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.body.product);

        if (!product) {
            return res.status(400).send('Invalid product');
        }
      const rate1= await Rated.findById( req.params.id)
      if (!rate1) {
        return res.status(400).send('The rated cannot be updated!');
    }
      // Lấy giá trị cũ của quantity nếu có
      const oldQuantity = rate1.quantity || 0;
      console.log(oldQuantity);
        const rated = await Rated.findByIdAndUpdate(
            req.params.id,
            {
                quantity: req.body.quantity,
                comment: req.body.comment,
            },
            { new: true }
        );      
        //  console.log('Before save:', product.numRated, product.ratings);
         // Cập nhật trường numRated và ratings trong product
         console.log( product.numRated, product.ratings,Number(req.body.quantity),Number(oldQuantity));
         product.ratings = ((Number(product.numRated) * Number(product.ratings)) + 
         Number(req.body.quantity) - Number(oldQuantity)) / Number(product.numRated);
         console.log(product.ratings);
         await product.save();
 
        //  console.log('After save:', product.numRated, product.ratings);
 
         res.send(rated);
       
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// router.put('/:id', async (req, res) => {
//   // Check if the combination of user and product already exists
//   const existingRated = await Rated.findOne({
//       user: req.body.user,
//       product: req.body.product
//   });

//   if (!existingRated) {
//       return res.status(400).send('The combination of user and product not exists in Rated.');
//   }

//   // If the combination  exist, proceed with the update
//   const rated = await Rated.findByIdAndUpdate(
//       req.params.id,
//       {
//           product: req.body.product,
//           quantity: req.body.quantity,
//           user: req.body.user,
//           comment: req.body.comment,
//       },
//       { new: true }
//   );

//   if (!rated) {
//       return res.status(400).send('The rated cannot be updated!');
//   }

//   res.send(rated);
// });

// router.delete('/:id', (req, res)=>{
//     Rated.findByIdAndRemove(req.params.id).then(rated =>{
//         if(rated) {
//             return res.status(200).json({success: true, message: 'the rated is deleted!'})
//         } else {
//             return res.status(404).json({success: false , message: "rated not found!"})
//         }
//     }).catch(err=>{
//        return res.status(500).json({success: false, error: err}) 
//     })
// })
router.get(`/get/count`, async (req, res) => {
    try {
        let filter = {};

        if (req.query.products) {
            filter.product = { $in: req.query.products.split(',') };
        }

        if (req.query.users) {
            filter.user = { $in: req.query.users.split(',') };
        }

        const ratedCount = await Rated.countDocuments(filter);

        if (!ratedCount) {
            return res.status(404).json({ success: false, message: 'No rateds found' });
        }

        res.send({
            ratedCount: ratedCount
        });
    } catch (error) {
        console.error("Error getting order item count:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports =router;