require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION 
// Set MONGO_URI in your Render Environment Variables
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://NmesomaU:Cosmas58@outfitgenerator.5rdjb05.mongodb.net/myCloset?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ SUCCESS: Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ DATABASE ERROR:", err.message));

// 2. DATABASE MODELS
const User = mongoose.model('User', {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Cloth = mongoose.model('Cloth', { 
    image: String, 
    category: String 
});

// 3. STORAGE SETUP (Note: Render clears these files on every restart)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) { 
    fs.mkdirSync(uploadDir); 
}
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- AUTHENTICATION ROUTES ---

app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Missing fields" });

        const newUser = new User({ email, password });
        await newUser.save();
        res.json({ message: "User created", user: newUser });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(400).json({ error: "Email already exists or invalid data" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: "Logged in", user });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// --- CLOSET ROUTES ---

app.post('/add-item', upload.single('image'), async (req, res) => {
    try {
        let imageUrl = req.body.image; 
        if (req.file) {
            const host = req.get('host');
            const protocol = req.protocol;
            imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        }
        const newItem = new Cloth({ image: imageUrl, category: req.body.category.toLowerCase() });
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ error: "Failed to save item" });
    }
});

app.get('/shuffle', async (req, res) => {
    const categories = ['coat', 'top', 'bottom', 'shoes', 'bag', 'accessory'];
    const outfit = {};
    try {
        for (const cat of categories) {
            const items = await Cloth.find({ category: cat });
            outfit[cat] = items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
        }
        res.json(outfit);
    } catch (err) {
        res.status(500).json({ error: "Shuffle failed" });
    }
});

app.get('/all-items', async (req, res) => {
    try {
        const allItems = await Cloth.find({});
        res.json(allItems);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch inventory" });
    }
});

app.delete('/delete-item/:id', async (req, res) => {
    try {
        await Cloth.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// 4. START SERVER (ONLY ONE LISTENER AT THE BOTTOM)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is officially live on port ${PORT}`);
});
