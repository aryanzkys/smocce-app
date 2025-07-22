const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// Multer setup: store file in memory for direct upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload/photo
router.post('/photo', upload.single('photo'), uploadController.uploadPhoto);

module.exports = router;
