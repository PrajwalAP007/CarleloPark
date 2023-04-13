const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,

});





// Create a new model based on the schema
const user = mongoose.model('UserData', userSchema);

module.exports = user