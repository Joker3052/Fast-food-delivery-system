const { Order } = require('../models/order');
const express = require('express');
const { OrderList } = require('../models/order-list');
const { User } = require('../models/user');
const { Shipper } = require('../models/shipper');
const { OrderItem } = require('../models/order-item');
const { Product } = require('../models/product');
const router = express.Router();


// router.get(`/`, async (req, res) => {
//     let filter = {};

//     if (req.query.shippers) {
//         filter.shipper = { $in: req.query.shippers.split(',') };
//     }

//     if (req.query.users) {
//         filter.user = { $in: req.query.users.split(',') };
//     }


//     try {
//         const orderList = await Order.find(filter).populate('user', 'email name').sort({ 'dateOrdered': -1 })
//         .populate({
//             path: 'orderLists',
//             populate: {
//                 path: 'product',
//                 select: 'name price priceUsd',  
//                 populate: {
//                     path: 'category',
//                     select: '-icon'  
//                 }
//             }
//         });

//         if (!orderList || orderList.length === 0) {
//             return res.status(404).json({ success: false, message: 'No orders found' });
//         }

//         res.send(orderList);
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).send('Internal Server Error');
//     }
// });
router.get(`/`, async (req, res) => {
    try {
        let filter = {};

        if (req.query.shippers) {
            filter.shipper = { $in: req.query.shippers.split(',') };
        }

        if (req.query.users) {
            filter.user = { $in: req.query.users.split(',') };
        }
        if (req.query.IdStore) {
            filter.IdStore = { $in: req.query.IdStore.split(',') };
        }

        const orderList = await Order.find(filter)
            .populate('user', 'email name')
            .sort({ 'dateOrdered': -1 })
            .populate({
                path: 'orderLists',
                populate: {
                    path: 'product',
                    select: '-image',
                    populate: {
                        path: 'user',
                        select: '-passwordHash -image -isAdmin -description -openAt -closeAt -isStore -imgStore',
                        path: 'category'
                    }
                }
            }).populate({
                path: 'shipper',
                select: '-image -passwordHash'
            });

        if (!orderList || orderList.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found' });
        }

        // Format the orderList to include the image field
        const formattedOrderList = orderList.map(order => {
            const orderLists = order.orderLists.map(orderItem => {
                const product = orderItem.product;
                return {
                    _id: orderItem._id,
                    quantity: orderItem.quantity,
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        image: product.image ? `/tttn/product/image/${product.id}` : null,
                        images: product.images.map(image => `/tttn/product/gallery/${product.id}/images/${image.id}`),
                        price: product.price,
                        priceUsd: product.priceUsd,
                        ratings: product.ratings,
                        numRated: product.numRated,
                        isFeatured: product.isFeatured,
                        user: product.user,
                        category: product.category,
                    },
                };
            });

            return {
                _id: order._id,
                orderLists: orderLists,
                shippingAddress1: order.shippingAddress1,
                shippingAddress2: order.shippingAddress2,
                status: order.status,
                totalPrice: order.totalPrice,
                user: order.user,
                phone: order.phone,
                shipper: order.shipper,
                isPay: order.isPay,
                dateOrdered: order.dateOrdered,
                isRate: order.isRate,
                ratings: order.ratings,
                payed: order.payed,
                mess: order.mess,
                store: order.store,
                IdStore:order.IdStore,
                id: order.id
            };
        });

        res.status(200).send(formattedOrderList);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }
});



router.get(`/:id`, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({
                path: 'user',
                select: 'email name'
            })
            .populate({
                path: 'orderLists',
                populate: {
                    path: 'product',
                    select: 'name price priceUsd',
                    populate: {
                        path: 'category',
                        select: '-icon'
                    }
                }
            }).populate({
                path: 'shipper',
                select: '-image -passwordHash'
            });

        if (!order) {
            return res.status(500).json({ success: false });
        }

        res.send(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).send('Internal Server Error');
    }
});
// router.post('/', async (req, res) => {
//     try {
//         const user = await User.findById(req.body.user);
//          if (!user) {
//              return res.status(400).send('Invalid User');
//          }
//         const orderListsIds = await Promise.all(req.body.orderLists.map(async (orderList) => {
//             try {
//                 let newOrderList = new OrderList({
//                     quantity: orderList.quantity,
//                     product: orderList.product
//                 });

//                 newOrderList = await newOrderList.save();

//                 return newOrderList._id;
//             } catch (error) {
//                 console.error("Error creating order List:", error);
//                 throw error; // Rethrow the error to be caught by the outer catch block
//             }
//         }));

//         const orderListsIdsResolved = await orderListsIds;

//         const totalPrices = await Promise.all(orderListsIdsResolved.map(async (orderListId) => {
//             try {
//                 const orderList = await OrderList.findById(orderListId).populate('product', 'price');
//                 const totalPrice = orderList.product.price * orderList.quantity;
//                 return totalPrice;
//             } catch (error) {
//                 console.error("Error fetching order List:", error);
//                 throw error; // Rethrow the error to be caught by the outer catch block
//             }
//         }));

//         const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

//         let order = new Order({
//             orderLists: orderListsIdsResolved,
//             shippingAddress1: req.body.shippingAddress1,
//             shippingAddress2: req.body.shippingAddress2,
//             city: req.body.city,
//             zip: req.body.zip,
//             country: req.body.country,
//             phone: req.body.phone,
//             status: req.body.status,
//             totalPrice: totalPrice,
//             user: req.body.user,
//         });

//         order = await order.save();

//         if (!order)
//             return res.status(400).send('The order cannot be created!');

//         res.send(order);
//     } catch (error) {
//         console.error("Error creating order:", error);
//         res.status(500).send('Internal Server Error');
//     }
// });
// router.post('/', async (req, res) => {
//     try {
//         const user = await User.findById(req.body.user);
//         if (!user) {
//             return res.status(400).send('Invalid User');
//         }

//         const orderLists = await Promise.all(req.body.orderLists.map(async (orderList) => {
//             try {
//                 // Kiểm tra xem user có tồn tại trong orderItem hay không
//                 const orderItem = await OrderItem.findOne({ user: req.body.user });

//                 // Nếu orderItem tồn tại, thì lưu thông tin vào orderList
//                 if (orderItem) {
//                     orderList.quantity = orderItem.quantity;
//                     orderList.product = orderItem.product;

//                     // Tạo mới orderList và lưu vào cơ sở dữ liệu
//                     let newOrderList = new OrderList({
//                         quantity: orderList.quantity,
//                         product: orderList.product
//                     });

//                     newOrderList = await newOrderList.save();

//                     return newOrderList._id;
//                 } else {
//                     console.error("OrderItem not found for user:", req.body.user, "and product:", orderList.product);
//                     // Xử lý tùy thuộc vào logic của bạn khi không tìm thấy orderItem
//                     return null; // hoặc throw một lỗi để sử lý ở catch block
//                 }
//             } catch (error) {
//                 console.error("Error creating order List:", error);
//                 throw error;
//             }
//         }));

//         // Loại bỏ các giá trị null từ mảng orderLists
//         const validOrderLists = orderLists.filter(orderListId => orderListId !== null);

//         // Kiểm tra xem có orderList hợp lệ nào không
//         if (validOrderLists.length === 0) {
//             return res.status(400).send('No valid orderLists found');
//         }

//         // Tính tổng giá trị của orderLists
//         const totalPrices = await Promise.all(validOrderLists.map(async (orderListId) => {
//             try {
//                 const orderList = await OrderList.findById(orderListId).populate('product', 'price');
//                 const totalPrice = orderList.product.price * orderList.quantity;
//                 return totalPrice;
//             } catch (error) {
//                 console.error("Error fetching order List:", error);
//                 throw error;
//             }
//         }));

//         // Tính tổng giá trị của đơn hàng
//         const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

//         // Tạo mới đơn hàng
//         let order = new Order({
//             orderLists: validOrderLists,
//             shippingAddress1: req.body.shippingAddress1,
//             shippingAddress2: req.body.shippingAddress2,
//             city: req.body.city,
//             zip: req.body.zip,
//             country: req.body.country,
//             phone: req.body.phone,
//             status: req.body.status,
//             totalPrice: totalPrice,
//             user: req.body.user,
//         });

//         // Lưu đơn hàng vào cơ sở dữ liệu
//         order = await order.save();

//         // Kiểm tra xem đơn hàng có được lưu thành công hay không
//         if (!order) {
//             return res.status(400).send('The order cannot be created!');
//         }

//         // Trả về đơn hàng đã tạo
//         res.send(order);

//     } catch (error) {
//         console.error("Error creating order:", error);
//         res.status(500).send(error.message);
//     }
// });
////////////////////
router.post('/', async (req, res) => {
    try {
        // Kiểm tra xem user có tồn tại hay không
        const user = await User.findById(req.body.user);
        if (!user) {
            return res.status(400).send('Invalid User');
        }

        // Tìm tất cả các OrderItem có user có id trùng với req.body.user
        const orderItems = await OrderItem.find({ user: req.body.user });

        // Kiểm tra xem có OrderItem nào tồn tại không
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).send('No OrderItems found for the user');
        }

        // Tạo một mảng orderLists từ orderItems
        const orderLists = await Promise.all(orderItems.map(async (orderItem) => {
            try {
                // Tạo mới OrderList từ thông tin OrderItem
                let newOrderList = new OrderList({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                });

                // Lưu OrderList vào cơ sở dữ liệu
                newOrderList = await newOrderList.save();

                return newOrderList._id; // Trả về ID của OrderList vừa tạo
            } catch (error) {
                console.error("Error creating OrderList:", error);
                throw error;
            }
        }));

        // Kiểm tra xem có OrderList hợp lệ nào không
        if (orderLists.length === 0) {
            return res.status(400).send('No valid OrderLists found');
        }

        // Tính tổng giá trị của orderLists
        // const totalPrices = await Promise.all(orderLists.map(async (orderListId) => {
        //     try {
        //         const orderList = await OrderList.findById(orderListId).populate('product', 'price');
        //         const totalPrice = orderList.product.price * orderList.quantity;
        //         return totalPrice;
        //     } catch (error) {
        //         console.error("Error fetching OrderList:", error);
        //         throw error;
        //     }
        // }));

        // // Tính tổng giá trị của đơn hàng
        // const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        // Tạo mới đơn hàng
        let order = new Order({
            orderLists: orderLists,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.user,
            isPay: req.body.isPay,
            isRate: req.body.isRate,
            payed: req.body.payed,
            mess: req.body.mess,
            store: req.body.store,
            IdStore:req.body.IdStore,
            ratings: req.body.ratings
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        order = await order.save();

        // Kiểm tra xem đơn hàng có được lưu thành công hay không
        if (!order) {
            return res.status(400).send('The order cannot be created!');
        }

        // Trả về đơn hàng đã tạo
        res.send(order);

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send(error.message);
    }
});
router.post('/orderPaypal', async (req, res) => {
    try {
        // Kiểm tra xem user có tồn tại hay không
        const user = await User.findById(req.body.user);
        if (!user) {
            return res.status(400).send('Invalid User');
        }

        // Tìm tất cả các OrderItem có user có id trùng với req.body.user
        const orderItems = await OrderItem.find({ user: req.body.user });

        // Kiểm tra xem có OrderItem nào tồn tại không
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).send('No OrderItems found for the user');
        }

        // Tạo một mảng orderLists từ orderItems
        const orderLists = await Promise.all(orderItems.map(async (orderItem) => {
            try {
                // Tạo mới OrderList từ thông tin OrderItem
                let newOrderList = new OrderList({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                });

                // Lưu OrderList vào cơ sở dữ liệu
                newOrderList = await newOrderList.save();

                return newOrderList._id; // Trả về ID của OrderList vừa tạo
            } catch (error) {
                console.error("Error creating OrderList:", error);
                throw error;
            }
        }));

        // Kiểm tra xem có OrderList hợp lệ nào không
        if (orderLists.length === 0) {
            return res.status(400).send('No valid OrderLists found');
        }


        // Tạo mới đơn hàng
        let order = new Order({
            orderLists: orderLists,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.user,
            isPay: true,
            isRate: req.body.isRate,
            payed: req.body.payed,
            mess: req.body.mess,
            ratings: req.body.ratings
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        order = await order.save();

        // Kiểm tra xem đơn hàng có được lưu thành công hay không
        if (!order) {
            return res.status(400).send('The order cannot be created!');
        }

        // Trả về đơn hàng đã tạo
        res.send(order);

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send(error.message);
    }
});
router.put('/:id', async (req, res) => {
    try {
        // Kiểm tra xem shipper có tồn tại hay không
        // const existingShipper = await Shipper.findById(req.body.shipper);
        // if (!existingShipper) {
        //     return res.status(400).send('Invalid Shipper');
        // }

        // Cập nhật order
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
                shipper: req.body.shipper,
                isPay: req.body.isPay,
                isRate: req.body.isRate,
                ratings: req.body.ratings,
                payed: req.body.payed,
                mess: req.body.mess
            },
            { new: true }
        );

        if (!order) {
            return res.status(400).send('The order cannot be updated!');
        }

        res.send('The order updated!');
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).send('Internal Server Error');
    }
});

// router.put('/update-ratings/:orderId', async (req, res) => {
//     const orderId = req.params.orderId;
//     const ratings = req.body.ratings;

//     try {
//         // Find the order by orderId
//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         // Update ratings of products in orderLists
//         order.orderLists.forEach(async (orderItem) => {
//             try {
//                 OrderList.findById(orderItem)
//                     .populate('product') // Populate the 'product' field
//                     .then(orderList => {
//                         if (!orderList) {
//                             console.log('orderList not found')
//                             // Handle order list not found scenario
//                         } else {
//                             const product = orderList.product; // Access the populated product data
//                             console.log("Product details:", product.id);
//                             // const product = await Product.findById(orderItem.product);
//                 // console.log('pr: ', orderItem);
//                 // product.numRated += 1;
//                 // product.ratings = ((product.numRated - 1) * product.ratings + ratings) / product.numRated;
//                 // // Save updated product
//                 // await product.save();
//                         }
//                     })
//                     .catch(error => {
//                         console.error("Error fetching order list or product:", error);
//                     });
//                 // Update ratings of product
//                 // const product = orderItem.product;
               
//             } catch (error) {
//                 console.error("Error updating product ratings:", error);
//             }
//         });

//         res.status(200).json({ message: "Ratings updated successfully" });
//     } catch (error) {
//         console.error("Error updating ratings:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

router.put('/update-ratings/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const ratings = req.body.ratings;

    try {
        // Find the order by orderId
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update ratings of products in orderLists
        for (const orderItem of order.orderLists) {
            try {
                const orderList = await OrderList.findById(orderItem).populate('product');
                if (!orderList) {
                    console.log('Order list not found');
                    // Handle order list not found scenario
                    continue;
                }
                
                const product = orderList.product;
                console.log("Product details:", product.id);
                product.numRated += 1;
                product.ratings = ((Number(product.numRated) - 1) * Number(product.ratings) + Number(ratings)) / Number(product.numRated);
                // Save updated product
                await product.save();
            } catch (error) {
                console.error("Error updating product ratings:", error);
            }
        }

        res.status(200).json({ message: "Ratings updated successfully" });
    } catch (error) {
        console.error("Error updating ratings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderLists.map(async orderList => {
                await OrderList.findByIdAndRemove(orderList)
            })
            return res.status(200).json({ success: true, message: 'the order is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({ totalsales: totalSales.pop().totalsales })
})



router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userid }).populate({
        path: 'orderLists', populate: {
            path: 'product', populate: 'category'
        }
    }).sort({ 'dateOrdered': -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false })
    }
    res.send(userOrderList);
})
router.get('/get/count', async (req, res) => {
    try {
        // Lấy giá trị của tham số status và shipper từ query string
        const { status, shipper } = req.query;

        // Tạo một đối tượng truy vấn để sử dụng tùy thuộc vào sự tồn tại của tham số status và shipper
        const query = {};
        if (status) {
            query.status = status;
        }
        if (shipper) {
            query.shipper = shipper; // Đảm bảo shipper là ID của shipper
        }

        // Sử dụng đối tượng truy vấn để lấy số lượng đơn hàng
        const orderCount = await Order.countDocuments(query);

        if (!orderCount) {
            return res.status(500).json({ success: false });
        }

        res.send({
            orderCount: orderCount
        });
    } catch (error) {
        console.error("Error fetching order count:", error);
        res.status(500).send('Internal Server Error');
    }
});
// router.get('/get/count', async (req, res) => {
//     try {
//         // Lấy giá trị của tham số status từ query string
//         const status = req.query.status;

//         // Tạo một đối tượng truy vấn để sử dụng tùy thuộc vào sự tồn tại của tham số status
//         const query = status ? { status: status } : {};

//         // Sử dụng đối tượng truy vấn để lấy số lượng đơn hàng
//         const orderCount = await Order.countDocuments(query);

//         if (!orderCount) {
//             return res.status(500).json({ success: false });
//         }

//         res.send({
//             orderCount: orderCount
//         });
//     } catch (error) {
//         console.error("Error fetching order count:", error);
//         res.status(500).send('Internal Server Error');
//     }
// });



module.exports = router;