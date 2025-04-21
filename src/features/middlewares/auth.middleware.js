import jwt from 'jsonwebtoken';
import 'dotenv/config';

const Auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!payload || !payload.userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }

        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
    }
};

export default Auth;
