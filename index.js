const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./model/user')
const Buynow = require('./model/buynow') // Fix model import
const ContactUs = require('./model/contactus') // Fix model import
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const review = require('./model/review')
require('dotenv').config();
const Connection = require('./database/db');
const { log } = require('console');
const client = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "carlelo264@gmail.com",
    pass: "nqpvxvrordlfjvkw"
  }
});


app.use(cors());

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(bodyParser.json());

app.post('/buynow', async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Find and delete all bookings with exitTime less than current date
    const result = await Buynow.deleteMany({ exitTime: { $lt: currentDate } });
    console.log(`${result.deletedCount} records deleted`);

    console.log(`${result.deletedCount} records deleted`);
  
 
    const slots = await Buynow.findOne({ slotName: req.body.slotName });
    if (slots) {
      return res.status(401).json({ message: 'SLot is not available now' });
    }
    console.log(slots)




    const buynows = new Buynow(req.body);
    await buynows.save();
    const email = buynows.email;
    client.sendMail({
      from: "carlelo264@gmail.com",
      to: email,
      subject: "Your Parking Details",
      text: `Hello ${buynows.ownerName} Your Parking Slot is Booked. Details are: Its slot number is ${buynows.slotName} entry time is ${buynows.entryTime} and its exit time is ${buynows.exitTime} you booked parking slot for location ${buynows.place} and its parking fees is ${buynows.parkingFee}


      Thanks For Choosing us!!!.
        
 `
    });

    res.status(201).json({ message: 'Booking created successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});


app.post('/signup', async (req, res) => {
  try {
    const duplicateemail = await User.findOne({ email: req.body.email });
    if (duplicateemail) {
      return res.status(500).json({ message: 'Email id already exists' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password with a salt of 10 rounds
    const user = new User({
      email: req.body.email,
      password: hashedPassword, // Store the hashed password in the database
      name: req.body.name,
      phoneno: req.body.phoneno,
      address: req.body.address
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to create user / Email id already exists' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password); // Compare the entered password with the hashed password in the database
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to authenticate user' });
  }
});


app.post('/review', async (req, res) => {
  try {
    // const reviews = await Rentreview.find();
    // res.json(reviews);
    const rreview = new review(req.body);
    await rreview.save();
    res.status(201).json({ message: 'Review is subbmited succesfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to Give reviews' });
  }
});
app.post('/review', async (req, res) => {
  try {
    const reviews = await review.find();
    res.json(reviews);

    res.status(201).json({ message: 'Review is Fetch Successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to Ftcj Review' });
  }
});


app.get('/review', async (req, res) => {
  try {
    const reviews = await review.find();
    res.json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get reviews' });
  }
});


app.post('/contacts', async (req, res) => {
  try {
    const contc = new ContactUs(req.body);
    await contc.save();
    const email = contc.email;
    client.sendMail({
      from: "carlelo264@gmail.com",
      to: email,
      subject: "Your Parking details",
      text: `Hello ${contc.names} . We got your these message "${contc.msg}" . Kindly provide us more proof or clarify your message in more detail by attaching neccasary deatils to give us more idea `
    });
    res.status(201).json({ message: 'Message is subbmited succesfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

app.use(function (req, res, next) {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});




