const express = require('express');
const router = express.Router();
const Auther = require('../middleware/auth');
const User = require('../config/models/user');
const Contact = require('../config/models/contact');
const { check, validationResult  } = require('express-validator');

//@route  GET  /api/contacts
//@desc   Get the all user's contacts
//@access Private

router.get('/',Auther, 
async (req,res) => {
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({
            date: -1
        })
        res.json(contacts);

    } catch (err) {
        console.error(err.message);
        res.status(400).send("SERVER_ERROR")
    }
} );


//@route  POST  /api/contacts
//@desc   Add new Contact
//@access Private

router.post('/',[Auther,[
    check('name','Name is required').not().isEmpty()
]], 
async (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()})
    }
    
    const {name, email, phone, type} = req.body;

    try {
           const newContacts = new Contact({
               name,
               email,
               phone,
               type,
               user: req.user.id
           })

        const contact = await newContacts.save();
        res.json(contact);  

    } catch (err) {
        console.error(err.message);
        res.status(400).send('SERVER_ERROR')
    }
} );


//@route  PUT  /api/contacts:id
//@desc   Update the Contact
//@access Private

router.put('/:id', Auther,
async (req,res) => {

    const { name, email, phone, type} = req.body;

    const ContactFields= {};

    if(name) ContactFields.name = name;
    if(email) ContactFields.email = email;
    if(phone) ContactFields.phone = phone;
    if(type) ContactFields.type = type;

    try {
        
        let contact = await Contact.findById(req.params.id)
       
        //CHECK IF THE CONTACT EXISTS
        if(!contact) return res.status(404).json({msg: "The contact Does not Exists"});

        //CHECK IF THE CONTACT IS VERIFY
        if(contact.user.toString() !== req.user.id) return res.status(404).json({msg: "This contact does not able to update the contact"});


        //THEN UPFATE THE CONTACT
        contact = await Contact.findByIdAndUpdate(req.params.id,
         { $set: ContactFields },
         { new: true }   
            ) 

        //RETURN THE UPDATE CONTACT
        
        res.json(contact);

    } catch (err) {
        console.error(err.message);
        res.status(400).send('SERVER_ERROR')
    }
} );


//@route  Delete  /api/contacts
//@desc   Delete the Contacts
//@access Private

router.delete('/:id' , Auther,
async (req,res) => {
    
    try {
        
        let contact = await Contact.findById(req.params.id)
       
        //CHECK IF THE CONTACT EXISTS
        if(!contact) return res.status(404).json({msg: "The contact Does not Exists"});

        //CHECK IF THE CONTACT IS VERIFY
        if(contact.user.toString() !== req.user.id) return res.status(404).json({msg: "This contact does not able to update the contact"});

        //FIND AND DELETE THE CONTACT
         await Contact.findByIdAndDelete(req.params.id);

        //RETURN A CONFIRMATION MESSAGE 
        res.json({msg: "Contact Deleted"});

    } catch (err) {
        console.error(err.message);
        res.status(400).send('SERVER_ERROR')
    }
} );

module.exports = router; 