const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring('Bearer '.length);
  try {
    const secret = process.env.ADMIN_JWT_SECRET || 'supersecret_admin';
    const payload = jwt.verify(token, secret);
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { verifyAdmin };
