const User = require('../models/User');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    // Is refreshToken in DB ?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    
    // Delete refreshToken in DB
    foundUser.refreshToken = foundUser.refreshToken.filter(token => token !== refreshToken);
    await foundUser.save();

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