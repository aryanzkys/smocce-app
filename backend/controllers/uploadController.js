const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: 'dpluklncp',
  api_key: '722696836139561',
  api_secret: 'D3IgdRgvHZw_O0_tVDueslk_h4Q',
});

// Fungsi upload gambar ke Cloudinary
const streamifier = require('streamifier');
exports.uploadPhoto = async (req, res) => {
  // Cek ENV terbaca/tidak
  console.log('[CLOUDINARY ENV]', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : undefined
  });
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Upload ke Cloudinary dengan streamifier
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder: 'smocce-candidates',
          resource_type: 'image',
        }, (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload();
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message || err });
  }
};
