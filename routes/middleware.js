const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my_jwt_secret_key';

const middleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Access token required' });
    }

    const jwtToken = token.replace('Bearer ', '');  // Remove 'Bearer ' prefix if present

    jwt.verify(jwtToken, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user; // Store user information in the request object
        next(); // Continue to the next middleware or route handler
    });
};

module.exports = middleware;
