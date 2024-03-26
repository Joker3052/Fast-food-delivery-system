const { OrderItem } = require('../models/order-item');
const { Product } = require('../models/product');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

// http://localhost:8080/tttn/orderItem?products=6553cc59c46a1274e138d6d4
// http://localhost:8080/tttn/orderItem?users=6553b71403d45d46c46a9624
router.get(`/`, async (req, res) => {
    try {
        let filter = {};

        if (req.query.products) {
            filter = { product: req.query.products.split(',') };
        }

        if (req.query.users) {
            filter = { ...filter, user: req.query.users.split(',') };
        }

        const orderItemList = await OrderItem.find(filter)
            .populate({
                path: 'product',
                select: '-image',
                populate: {
                    path: 'user',
                    select: '-passwordHash -image -imgStore',
                }
            })
            .populate({
                path: 'user',
                select: '-passwordHash -image -imgStore', // Loại bỏ các trường không mong muốn
            });

        if (!orderItemList || orderItemList.length === 0) {
            return res.status(404).json({ success: false, message: 'No orderItems found' });
        }

        // Chuyển đổi thông tin sản phẩm để thêm đường dẫn hình ảnh mới
        const formattedOrderItems = orderItemList.map(orderItem => {
            const product = orderItem.product;
            return {
                _id: orderItem._id,
                quantity: orderItem.quantity,
                product: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: product.image ? `/tttn/product/image/${product.id}` : null, // Đường dẫn đến route mới
                    images: product.images.map(image => `/tttn/product//gallery/${product.id}/images/${image.id}`),
                    price: product.price,
                    priceUsd: product.priceUsd,
                    ratings: product.ratings,
                    numRated: product.numRated,
                    isFeatured: product.isFeatured,
                    user: product.user,
                    category: product.category,
                },
                user: orderItem.user,
            };
        });

        res.status(200).send(formattedOrderItems);
    } catch (error) {
        console.error('Error fetching orderItems:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
});

// router.get(`/`, async (req, res) => {
//     try {
//         let filter = {};

//         if (req.query.products) {
//             filter = { product: req.query.products.split(',') };
//         }

//         if (req.query.users) {
//             filter = { ...filter, user: req.query.users.split(',') };
//         }
//         const orderItemList = await OrderItem.find(filter)
//             .populate({
//                 path: 'product',
//                 select: ' images: product.images.map(image => `/tttn/product//gallery/${product.id}/images/${image.id}`),',
//             })
//             .populate({
//                 path: 'user',
//                 select: '-passwordHash -image', // Loại bỏ các trường không mong muốn
//             });

//         if (!orderItemList || orderItemList.length === 0) {
//             return res.status(404).json({ success: false, message: 'No orderItems found' });
//         }

//         res.status(200).send(orderItemList);
//     } catch (error) {
//         console.error('Error fetching orderItems:', error);
//         res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
//     }
// });

router.get('/:id', async (req, res) => {
    try {

        const orderItem = await OrderItem.findOne()
            .populate({
                path: 'product',
                select: '-image',
            })
            .populate({
                path: 'user',
                select: '-passwordHash -image -imgStore',
            });

        if (!orderItem) {
            res.status(404).json({ message: 'The orderItem with the given ID was not found.' });
        } else {
            res.status(200).send(orderItem);
        }
    } catch (error) {
        console.error('Error fetching orderItem by ID:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

// router.post('/', async (req, res) => {
//     try {
//       const product = await Product.findById(req.body.product);
//       if (!product) {
//         return res.status(400).send('Invalid product');
//       }

//       const user = await User.findById(req.body.user);
//       if (!user) {
//         return res.status(400).send('Invalid User');
//       }

//       // Kiểm tra xem đã có OrderItem cho user và product chưa
//       let existingOrderItem = await OrderItem.findOne({ user: req.body.user, product: req.body.product });

//       if (existingOrderItem) {
//         // Nếu đã tồn tại, tăng quantity lên 1
//         existingOrderItem.quantity += 1;
//         orderItem = await existingOrderItem.save();
//         res.send(orderItem);
//       } else {
//         // Nếu chưa tồn tại, tạo mới OrderItem
//         let orderItem = new OrderItem({
//           product: req.body.product,
//           quantity: req.body.quantity,
//           user: req.body.user,
//         });

//         orderItem = await orderItem.save();

//         if (!orderItem) {
//           return res.status(400).send('The orderItem cannot be created!');
//         }

//         res.send(orderItem);
//       }
//     } catch (error) {
//     //   res.status(500).json({ success: false, error: error.message });
//     console.log( "error:", error.message)
//     }
//   });

router.post('/', async (req, res) => {
    try {
        const product = await Product.findById(req.body.product)
        .populate({
            path: 'user',
            select: '-passwordHash -image -imgStore',
        });
        const user = await User.findById(req.body.user);

        if (!product) {
            return res.status(400).json({ success: false, error: 'Invalid product' });
        }
    //  console.log('name : ',product.user.id);
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid User' });
        }

        // Kiểm tra xem đã có OrderItem cho user và product chưa
        let existingOrderItem = await OrderItem.findOne({ user: req.body.user, product: req.body.product });

        if (existingOrderItem) {
            // Nếu đã tồn tại, tăng quantity lên 1
            existingOrderItem.quantity += 1;
            orderItem = await existingOrderItem.save();
            return res.status(200).json({ success: true, orderItem });
        } else {
            let existingUser = await OrderItem.findOne({ user: req.body.user });
            if (existingUser) {
                console.log('1')
                const orderItemList = await OrderItem.find()
                    .populate({
                        path: 'product',
                        select: '-image',
                        populate: {
                            path: 'user',
                            select: '-passwordHash -image -imgStore',
                        },
                    })
                    .populate({
                        path: 'user',
                        select: '-passwordHash -image -imgStore',
                    });

                const formattedOrderItems = orderItemList.map(orderItem => {
                    const product = orderItem.product;
                    return {
                        _id: orderItem._id,
                        quantity: orderItem.quantity,
                        product: {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            priceUsd: product.priceUsd,
                            ratings: product.ratings,
                            numRated: product.numRated,
                            isFeatured: product.isFeatured,
                            user: product.user,
                            category: product.category,
                        },
                        user: orderItem.user,
                    };
                });
                // Kiểm tra xem product.user của mỗi formattedOrderItem có trùng với existingUser không
                const isProductUserMatch = formattedOrderItems.some(item => item.product.user.id === product.user.id
                    && item.user.id===req.body.user);

                if (isProductUserMatch) {
                    let orderItem = new OrderItem({
                        product: req.body.product,
                        quantity: req.body.quantity,
                        user: req.body.user,
                    });
        
                    orderItem = await orderItem.save();
        
                    if (!orderItem) {
                        return res.status(400).json({ success: false, error: 'The orderItem cannot be created!' });
                    }
        
                    return res.status(200).json({ success: true, orderItem });
                } else {                  
                    return res.status(400).send('Invalid product');
                }
            }
            else {
                 // Nếu chưa tồn tại, tạo mới OrderItem
            let orderItem = new OrderItem({
                product: req.body.product,
                quantity: req.body.quantity,
                user: req.body.user,
            });

            orderItem = await orderItem.save();

            if (!orderItem) {
                return res.status(400).json({ success: false, error: 'The orderItem cannot be created!' });
            }

            return res.status(200).json({ success: true, orderItem });
            }
           
        }
    } catch (error) {
        console.log("error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
});


router.put('/asc/:id', async (req, res) => {
    try {
        const orderItemToUpdate = await OrderItem.findById(req.params.id);

        if (!orderItemToUpdate) {
            return res.status(404).json({ message: 'The orderItem with the given ID was not found.' });
        }
        if (orderItemToUpdate.quantity < 40) {
            orderItemToUpdate.quantity += 1;

            // Lưu thay đổi vào cơ sở dữ liệu
            const updatedOrderItem = await orderItemToUpdate.save();

            return res.status(200).send(updatedOrderItem);
        } else {
            return res.status(400).json({ message: 'Quantity cannot be less than 0.' });
        }
    } catch (error) {
        console.error('Error updating orderItem:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});


router.put('/desc/:id', async (req, res) => {
    try {
        const orderItemToUpdate = await OrderItem.findById(req.params.id);

        if (!orderItemToUpdate) {
            return res.status(404).json({ message: 'The orderItem with the given ID was not found.' });
        }

        // Đảm bảo quantity không nhỏ hơn 0
        if (orderItemToUpdate.quantity > 1) {
            orderItemToUpdate.quantity -= 1;

            // Lưu thay đổi vào cơ sở dữ liệu
            const updatedOrderItem = await orderItemToUpdate.save();

            return res.status(200).send(updatedOrderItem);
        } else {
            return res.status(400).json({ message: 'Quantity cannot be less than 0.' });
        }
    } catch (error) {
        console.error('Error updating orderItem:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

router.delete('/:id', (req, res) => {
    OrderItem.findByIdAndRemove(req.params.id).then(orderItem => {
        if (orderItem) {
            return res.status(200).json({ success: true, message: 'the orderItem is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "orderItem not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})
router.delete('/delAll/:userId', (req, res) => {
    const userId = req.params.userId;

    OrderItem.deleteMany({ user: userId })
        .then(result => {
            if (result.deletedCount > 0) {
                return res.status(200).json({ success: true, message: `All orderItems for user ${userId} are deleted!` });
            } else {
                return res.status(404).json({ success: false, message: `No orderItems found for user ${userId}` });
            }
        })
        .catch(err => {
            return res.status(500).json({ success: false, error: err });
        });
});

// http://localhost:8080/tttn/orderItem/get/count?products=6553cc59c46a1274e138d6d4
// http://localhost:8080/tttn/orderItem/get/count?users=6553b71403d45d46c46a9624
router.get(`/get/count`, async (req, res) => {
    try {
        let filter = {};

        if (req.query.products) {
            filter.product = { $in: req.query.products.split(',') };
        }

        if (req.query.users) {
            filter.user = { $in: req.query.users.split(',') };
        }

        const orderItemCount = await OrderItem.countDocuments(filter);

        if (!orderItemCount) {
            return res.status(404).json({ success: false, message: 'No orderItems found' });
        }

        res.send({
            orderItemCount: orderItemCount
        });
    } catch (error) {
        console.error("Error getting order item count:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
// router.get('/image/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);

//         if (!product || !product.image) {
//             return res.status(404).json({ success: false, message: 'Image not found' });
//         }

//         // Đặt loại nội dung và gửi dữ liệu hình ảnh
//         res.contentType(product.image.contentType);
//         res.send(product.image.data);
//     } catch (error) {
//         console.error('Error retrieving image:', error);
//         res.status(500).send('Internal Server Error');
//     }
//   });
//   router.get('/gallery/:productId/images/:imageId', async (req, res) => {
//     try {
//         const productId = req.params.productId;
//         const imageId = req.params.imageId;

//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         const image = product.images.id(imageId);

//         if (!image) {
//             return res.status(404).send('Image not found');
//         }

//         res.set('Content-Type', image.contentType);
//         res.send(image.data);
//     } catch (error) {
//         console.error('Error getting image:', error);
//         res.status(500).send('Internal Server Error');
//     }
//   });
module.exports = router;