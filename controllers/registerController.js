const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc Handle the registration
// @route POST /register
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user) return res.status(400).json({ message: "Username is required" });
  if (!pwd) return res.status(400).json({ message: "Password is required" });

  // Check for duplicate usernames
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate)
    return res.status(409).json({ message: "User already exists!" });

  try {
    // Encrypt password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // Store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log("New user created : ", result);
    res.status(201).json({ success: `New user ${user} created !` });
  } catch (error) {
    console.error("Erreur : ", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
