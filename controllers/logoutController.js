const User = require('../models/User');
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    // Is refreshToken in DB ?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }
    
    // Delete refreshToken in DB
    await User.updateOne({ refreshToken }, { refreshToken: '' }).exec();

    // Clear cookies
    res.clearCookie(
        'jwt', 
        { 
            httpOnly: true, 
            sameSite: 'None',
            secure: true,
        }
    );
    
    res.sendStatus(204);
}

module.exports = { handleLogout };