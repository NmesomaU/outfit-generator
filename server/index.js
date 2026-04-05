const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Your User model
const app = express();

app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Return 401 so the frontend knows the login failed
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // Return 401 if password is wrong
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Success! Send user data back
    res.status(200).json({ 
      user: { id: user._id, email: user.email },
      message: "Login successful" 
    });

  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});
