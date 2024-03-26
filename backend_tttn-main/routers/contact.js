const {Contact} = require('../models/contact');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

// http://localhost:8080/tttn/contact?orders=6553cc59c46a1274e138d6d4
// http://localhost:8080/tttn/contact?users=6553b71403d45d46c46a9624
//http://localhost:8080/tttn/contact?orders=65579a0c16dc3161b86d1b56&users=65579a4216dc3161b86d1b59
router.get(`/`, async (req, res) => {
    try {
        let filter = {};
        if (req.query.users) {
            filter = { user: req.query.users.split(',') };
        }

        const contactList = await Contact.find(filter)
            .populate({
                path: 'user',
                select: '-passwordHash -image -imgStore', // Loại bỏ các trường không mong muốn
            });

        if (!contactList || contactList.length === 0) {
            return res.status(404).json({ success: false, message: 'No contacts found' });
        }

        res.status(200).send(contactList);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ success: false, message: error });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
  
      if (!contact) {
        res.status(404).json({ message: 'The contact with the given ID was not found.' });
      } else {
        res.status(200).send(contact);
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  });


router.post('/', async (req, res) => {
    try {

        const user = await User.findById(req.body.user);
        if (!user) {
            return res.status(400).send('Invalid User');
        }
            // Nếu chưa tồn tại, tạo mới contact
            let contact = new Contact({
                user: req.body.user,
                comment: req.body.comment,
            });

            contact = await contact.save();

            if (!contact) {
                return res.status(400).send('The contact cannot be created!');
            }

           

            res.send(contact);
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get(`/get/count`, async (req, res) => {
    try {
        let filter = {};

       

        if (req.query.users) {
            filter.user = { $in: req.query.users.split(',') };
        }

        const contactCount = await Contact.countDocuments(filter);

        if (!contactCount) {
            return res.status(404).json({ success: false, message: 'No contacts found' });
        }

        res.send({
            contactCount: contactCount
        });
    } catch (error) {
        console.error("Error getting order item count:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.delete('/:id', (req, res)=>{
    Contact.findByIdAndRemove(req.params.id).then(contact =>{
        if(contact) {
            return res.status(200).json({success: true, message: 'the contact is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "contact not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})
module.exports =router;