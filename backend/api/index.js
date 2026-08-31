const app = require('../server');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error('Vercel API startup error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Database connection failed',
        });
    }
};