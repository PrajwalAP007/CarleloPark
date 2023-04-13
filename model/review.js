
const mongoose = require('mongoose');

const rentreviewSchema = new mongoose.Schema({
   
    rating: String,
    name: String,
    email:String,
    review: String,

  
  
  });
  const review = mongoose.model('RentreviewData', rentreviewSchema);
  module.exports = review