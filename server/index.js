const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use('/uploads', express.static(uploadDir));

mongoose.connect('mongodb://127.0.0.1:27017/wardrobe')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Error", err));

const Cloth = mongoose.model('Cloth', { 
    image: String, 
    category: String 
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ROUTES
app.post('/add-item', upload.single('image'), async (req, res) => {
    try {
        let imageUrl = req.body.image; 
        if (req.file) imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        const newItem = new Cloth({ image: imageUrl, category: req.body.category.toLowerCase() });
        await newItem.save();
        res.json(newItem);
    } catch (err) { res.status(500).json({ error: "Save failed" }); }
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
    } catch (err) { res.status(500).json({ error: "Shuffle failed" }); }
});

app.get('/random/:category', async (req, res) => {
    try {
        const cat = req.params.category.toLowerCase();
        const items = await Cloth.find({ category: cat });
        res.json(items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null);
    } catch (err) { res.status(500).json({ error: "Randomize failed" }); }
});

app.get('/all-items', async (req, res) => {
    try { res.json(await Cloth.find({})); } 
    catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});

app.delete('/delete-item/:id', async (req, res) => {
    try {
        const item = await Cloth.findById(req.params.id);
        if (item && item.image.includes('localhost')) {
            const filename = item.image.split('/').pop();
            const filePath = path.join(__dirname, 'uploads', filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await Cloth.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

app.listen(5000, () => console.log(`🚀 Server on http://localhost:5000`));