const User = require('../models/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user) return res.status(400).json({ message: "Username is required" });
    if (!pwd) return res.status(400).json({ message: "Password is required" });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401);

    // Evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // Create access token
        const accessToken = jwt.sign(
            { 
                UserInfo: {
                    username: foundUser.username,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
        )
        // Create refresh token
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        )
        // Save refreshToken with current user
        await User.updateOne({ username: user }, {refreshToken}).exec();

        res.cookie(
            'jwt', 
            refreshToken, 
            { 
                httpOnly: true, 
                sameSite: 'None',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000 
            }
        );

        res.json({ 
            success: `User ${user} logged in !`,
            accessToken
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };