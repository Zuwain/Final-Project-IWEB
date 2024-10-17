const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/food_delivery', { useNewUrlParser: true, useUnifiedTopology: true });

// User Model
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  address: String
});

// Registration Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, address });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
      res.json({ token });
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send('Error logging in');
  }
});

// Middleware to check if user is authenticated
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send('Please authenticate');
  }
};

// Order submission route (protected)
app.post('/submit-order', auth, async (req, res) => {
  try {
    const { items, total, driverMessage } = req.body;
    const user = await User.findById(req.userId);
    // Here you would typically save the order to a database
    res.status(200).send('Order submitted successfully');
  } catch (error) {
    res.status(400).send('Error submitting order');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));