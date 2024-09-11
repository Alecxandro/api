import User from '../../models/User.model.js'
import bcrypt from 'bcryptjs'
import { hashPassword } from '../../utils/helpers.js'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const registerUser = async (req, res) => {
    const { username, password, email, role } = req.body

    const hashedPassword = await hashPassword(password)

    const validRoles = ['admin', 'principal', 'instructor', 'student']
    if (!validRoles.includes(role))
        return res.status(400).json({ message: 'Invalid role' })

    try {
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            role,
        })
        await newUser.save()
        res.status(201).json({
            message: `User registered successfully: ${newUser.username}`,
        })
    } catch (error) {
        res.status(500).json({
            message: `User registration failed: ${error.message}`,
        })
    }
}

export const loginUser = async (req,res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch || !user) return res.status(401).json({ message: 'Invalid credentials.' })
        
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })  

        return res.status(200).json({ user, token })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
