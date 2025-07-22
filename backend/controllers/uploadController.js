const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fungsi upload gambar ke Cloudinary
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Upload ke Cloudinary
    const result = await cloudinary.uploader.upload_stream({
      folder: 'smocce-candidates',
      resource_type: 'image',
    }, (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Upload error', error });
      }
      return res.json({ url: result.secure_url });
    });
    // Pipe file buffer ke upload_stream
    req.file.stream.pipe(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
