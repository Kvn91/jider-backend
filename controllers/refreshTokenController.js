const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Handle refreshing of the access token and the refresh token
// when the access token has expired
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse : a user is attempting to 
    // refresh his token while not registered in the database
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (error, decoded) => {
                if (error) return res.sendStatus(403); // Invalid token

                // Remove all refresh tokens of the compromised user
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];
                await hackedUser.save();
            }
        )

        return res.sendStatus(403);
    }

    // Remove the old refresh token from the database
    const newRefreshTokenArray = foundUser.refreshToken.filter(token => token !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (error, decoded) => {
            // Old refresh token has expired, user will have to log in again
            if (error) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                await foundUser.save();
            }

            if (error || foundUser.username !== decoded.username) return res.sendStatus(403);

            // Refresh token is still valid
            // Create the new access token
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { 
                    UserInfo: {
                        username: decoded.username,
                        roles: roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10m" }
            )
            // Create a new refresh token
            const newRefreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            )
            // Save refreshToken for current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            res.cookie(
                'jwt', 
                newRefreshToken, 
                { 
                    httpOnly: true, 
                    sameSite: 'None',
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000 
                }
            );

            return res.json({ roles, accessToken });
        }
    )
}

module.exports = { handleRefreshToken };