const {prisma} = require('../utils/prisma.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
require('dotenv').config();



const register = async (req, res) => {   
    const { username, password, email } = req.body

    // Check if the username already exists
    let user = await prisma.user.findUnique({ 
        where: {
            username: username
        }
    });

    if (user) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    user = await prisma.user.findUnique({ 
        where: {
            email: email
        }
    });

    if (user) {
        return res.status(400).json({ error: 'Email already exists' })
    }
  
    // Salt and hash the password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // Create a new user
    const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            email
        }
    });
  
    delete newUser.password
    
    // Generate a JSON web token for the new user
    const token = jwt.sign({id: newUser.id}, process.env.ACCESS_TOKEN_SECRET);
    
    res.cookie("accessToken", token, {
        httpOnly: true,
    })
    .status(200)
    .json(newUser)
}

const login = async (req, res) => {
    const { username, password }  = req.body

    // Check if the username exists
    const user = await prisma.user.findUnique({ 
        where: {
            username: username
        }
    });

    if(!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    // Check for valid password
    const checkPassword = bcrypt.compareSync(password, user.password)
    if (!checkPassword) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate a JSON web token for the new user
    const token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET);

    delete user.password

    res.cookie("accessToken", token, {
        httpOnly: true,
    })
    .status(200)
    .json(user)
} 

const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    })
    .status(200)
    .json({
        message: "User has been logged out"
    })
} 


module.exports = {
    register,
    login,
    logout
}