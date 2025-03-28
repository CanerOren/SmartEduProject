import User from '../models/User.js';

export default async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userID);

        if (!user) {
            return res.redirect('/login');  
        };

        next();  
    } catch (error) {
        console.error(`Auth Middleware Error: ${error.message}`);
        return res.redirect('/login');
    };
};