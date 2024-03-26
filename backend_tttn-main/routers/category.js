const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();

        if (!categoryList) {
            return res.status(500).json({ success: false, error: "Error fetching categories" });
        }

        res.status(200).json(categoryList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/limit10', async (req, res) => {
    try {
        const categoryList = await Category.find().limit(10);

        if (!categoryList) {
            return res.status(500).json({ success: false, error: "Error fetching categories" });
        }

        res.status(200).json(categoryList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
  
      if (!category) {
        res.status(404).json({ message: 'The category with the given ID was not found.' });
      } else {
        res.status(200).send(category);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  });
  
router.post('/', async (req,res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon
    })
    category = await category.save();

    if(!category)
    return res.status(400).send('the category cannot be created!')

    res.send(category);
})


router.put('/:id',async (req, res)=> {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon
        },
        { new: true}
    )

    if(!category)
    return res.status(400).send('the category cannot be created!')

    res.send(category);
})

router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category) {
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "category not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})
router.get(`/get/count`, async (req, res) => {
    const categoryCount = await Category.countDocuments();

    if (!categoryCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        categoryCount: categoryCount
    });
})
module.exports =router;