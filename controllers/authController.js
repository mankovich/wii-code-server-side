const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User"); 
require('dotenv').config(); 

const validateToken = (token) => {
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        return tokenData;
    } catch (error) {
        console.log('error validating token: ', token);
        console.log('error', token);
        throw error;   
    }
};

const createNewUser = async (userJson) => {
    userJson.password = bcrypt.hashSync(userJson.password, 4)
    const newUser = await User.create(userJson);
    const token = newToken(newUser);
    return {
        token,
        user: newUser,
    };
}

const newToken = ({ id, email }) => {
    return jwt.sign(
        {
            id,
            email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h",
        }
    );
}

const findUserByEmail = async (email) => {
    console.log("Reading user by email: " + email);
    const foundUser = await User.findOne({
        where: {
            email: email,
        },
    });
    console.log("found user: " + JSON.stringify(foundUser));
    return foundUser;
};

const validateRequest = async (req, res) => {
    const token = req.headers.authorization;
    try {
        const tokenData = validateToken(token);
        const email = tokenData.email;
        const user = await findUserByEmail(email);
        return user;
    } catch {
        console.log("Could not validate token!");
        throw new Error("Failed validation")
    }
}
module.exports = {
    validateToken,
    createNewUser,
    newToken,
    findUserByEmail,
    validateRequest
}
