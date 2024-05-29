// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://Aryan:DTkca_HZ5i7yCQw@cluster0.gpsnwep.mongodb.net/La-Bella-Italia?retryWrites=true')
    .then(() => console.log('DB connection successful'))
    .catch(error => console.error('DB connection error:', error));

// Define schema for user
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

// Create model for user
const User = mongoose.model('User', userSchema);

// Define schema for booking
const bookingSchema = new mongoose.Schema({
    persons: String,
    date: String,
    time: String,
});

// Create model for booking
const Booking = mongoose.model('Booking', bookingSchema);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Route to handle form submission from signup.html
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
    });

    try {
        // Save the user to the database
        await newUser.save();
        console.log('User saved successfully');

        // Redirect to /index after successful signup
        res.redirect('/index');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle form submission from BookTable.html
app.post('/BookTable', async (req, res) => {
    const { persons, date, time } = req.body;

    // Create a new booking instance
    const newBooking = new Booking({
        persons: persons,
        date: date,
        time: time,
    });

    try {
        // Save the booking to the database
        await newBooking.save();
        console.log('Booking saved successfully');

        // Redirect to /index after successful booking
        res.redirect('/index');
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle GET requests for index.html
app.get('/index', (req, res) => {
    // Send the index.html file
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const port = 3002;
app.listen(port, '0.0.0.0', () => {
    console.log(`App running on port ${port}...`);
});
