const mongoose = require('mongoose');


const ConatactSchema = new mongoose.Schema({

    names: String,
    email: String,
    msg: String,
    subject: String


});
const contact = mongoose.model('ContactData', ConatactSchema);


module.exports = contact