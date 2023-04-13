const mongoose = require('mongoose');


const buySchema = new mongoose.Schema({

    ownerName:String,
    slotName:Number,
    vehicleType: String,
    vehicleModel: String,
    vehicleNumber:String,
    email:String,
    entryTime: Date,
    exitTime: Date,
    parkingFee: String,
    place:String
  });






const buynow = mongoose.model('BookingData', buySchema);

module.exports= buynow