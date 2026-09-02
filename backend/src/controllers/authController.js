import crypto from 'crypto';
import db from '../database/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Basic JWT implementation using native crypto
const base64UrlEncode = (str) => {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const generateToken = (id, email) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { id, email, exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) };
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(signatureInput).digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    
  return `${signatureInput}.${signature}`;
};

// Password hashing using pbkdf2
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Please provide name, email, and password');
    }

    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return errorResponse(res, 400, 'User already exists');
    }

    const passwordHash = hashPassword(password);

    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `).run(name, email, passwordHash);

    const user = { id: result.lastInsertRowid, name, email };
    const token = generateToken(user.id, user.email);

    return successResponse(res, 201, { user, token }, 'User created successfully');
  } catch (error) {
    console.error('Signup error:', error.message);
    return errorResponse(res, 500, 'Server error during signup', error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    if (!verifyPassword(password, user.password_hash)) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const token = generateToken(user.id, user.email);

    return successResponse(res, 200, {
      user: { id: user.id, name: user.name, email: user.email },
      token
    }, 'Logged in successfully');
  } catch (error) {
    console.error('Login error:', error.message);
    return errorResponse(res, 500, 'Server error during login', error.message);
  }
};
