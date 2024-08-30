const jwt = require('jsonwebtoken');

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Error generating token');
  }
}


module.exports = generateToken;

