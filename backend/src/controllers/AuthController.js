import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // 1. Compare username against process.env.ADMIN_USERNAME
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // 2. Compare password using bcrypt.compare()
    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // 3. Generate JWT on success
    const token = jwt.sign(
      { username: process.env.ADMIN_USERNAME },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Return authentication result
    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (req, res, next) => {
  try {
    // 5. Return active admin profile info (decoded by authMiddleware)
    res.status(200).json({
      username: req.user.username
    });
  } catch (error) {
    next(error);
  }
};
