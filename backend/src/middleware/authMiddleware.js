import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export const protect = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    // Verify token using crypto
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');

    const [header, payload, signature] = parts;
    
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    
    if (decoded.exp && Math.floor(Date.now() / 1000) > decoded.exp) {
      throw new Error('Token expired');
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
