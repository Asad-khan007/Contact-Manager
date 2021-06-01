const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },
    name: {
       type: String,
       required: true
   },
   email: {
       type: String,
       required: true,
   },
   relationship: {
        type: String,
        default: 'Personal'
   },
   phone: {
       type: String,
       required: true
   },
   date: {
       type: Date,
       default: Date.now
   }
});  

module.exports = mongoose.model('Contact', ContactSchema);