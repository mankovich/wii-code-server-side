const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models"); 


exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ msg: "User with that email already exists" });
    }

    
    const hashedPassword = bcrypt.hashSync(password, 5); 

    
    const newUser = await User.create({ email, password: hashedPassword });

    
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: { id: newUser.id, email: newUser.email }, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred during signup", err });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    
    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
      return res.status(401).json({ msg: "No user with that email" });
    }

   
    const isMatch = bcrypt.compareSync(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    
    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: { id: foundUser.id, email: foundUser.email }, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred during login", err });
  }
};

// Profile
exports.profile = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ msg: "No token provided" });
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: tokenData });
  } catch (error) {
    console.error(error);
    res.status(403).json({ msg: "Invalid token", error });
  }
};
