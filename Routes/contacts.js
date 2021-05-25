const express = require('express');
const router = express.Router();

//@route  GET  /api/contacts
//@desc   Get the all user's contacts
//@access Private

router.get('/' , (req,res) => {
    res.send('Get all Contacts')
} );


//@route  POST  /api/contacts
//@desc   Add new Contact
//@access Private

router.post('/' , (req,res) => {
    res.send('Add new Contact')
} );


//@route  PUT  /api/contacts:id
//@desc   Update the Contact
//@access Private

router.put('/:id' , (req,res) => {
    res.send('Update the Contact')
} );


//@route  Delete  /api/contacts
//@desc   Delete the Contacts
//@access Private

router.delete('/:id' , (req,res) => {
    res.send('Delete the Contacts')
} );

module.exports = router; 