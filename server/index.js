const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION
// Replace with your MongoDB Atlas string if not using local
mongoose.connect('mongodb://localhost:27017/mycloset')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("DB Connection Error:", err));

// 2. USER MODEL
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String }
});
const User = mongoose.model('User', UserSchema);

// 3. EMAIL CONFIGURATION (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_GMAIL@gmail.com', 
    pass: 'YOUR_APP_PASSWORD' // NOT your login password. Generate an "App Password" in Google settings.
  }
});

// 4. REGISTER ROUTE (Sign Up)
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      email,
      password: hashedPassword,
      verificationCode: code,
      isVerified: false
    });

    await newUser.save();

    // Send the email
    const mailOptions = {
      from: 'YOUR_GMAIL@gmail.com',
      to: email,
      subject: 'Your Closet Verification Code',
      text: `Your verification code is: ${code}`
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: "Verification code sent to email!" });

  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// 5. VERIFY ROUTE
app.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });

  if (user && user.verificationCode === code) {
    user.isVerified = true;
    user.verificationCode = null; // Clear code after use
    await user.save();
    res.status(200).json({ message: "Account verified! You can now login." });
  } else {
    res.status(400).json({ message: "Invalid verification code." });
  }
});

// 6. LOGIN ROUTE (The "Gatekeeper")
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // CHECK 1: Is the password correct?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // This 401 status stops the Frontend from logging in
      return res.status(401).json({ message: "Invalid password" });
    }

    // CHECK 2: Is the email verified?
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    // SUCCESS
    res.status(200).json({ 
      user: { id: user._id, email: user.email },
      message: "Login successful" 
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
