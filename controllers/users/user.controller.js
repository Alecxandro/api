import User from '../../models/User.model.js'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { authorizationAction, handleResponse } from '../../middlewares/authorization.js'

dotenv.config()

export const registerUser = async (req, res) => {
    const document = await authorizationAction(req, res, User, 'register')
    if (!document) return

    return handleResponse(res, 201, `User registration successful: ${document.username}`, document)
}

export const getUser = async (req, res) => {
    const document = await authorizationAction(req, res, User, 'read')
    if (!document) return
    return handleResponse(res, 200, `User details:`, document)
}

export const getAllUsers = async (req, res) => {
    const document = await User.find()
    if (!document) return res.status(404).json({ message: 'Error' })

    if (req.user.role === 'admin') {
        return res.status(200).json(document)
    }

    return res.status(201).json({ message: 'Not authorized' })
}

export const deleteUser = async (req, res) => {
    const document = await authorizationAction(req, res, User, 'delete')
    if (!document) return
    return handleResponse(res, 201, `User deletion successful!`)
}

export const updateUser = async (req, res) => {
    const document = await authorizationAction(req, res, User, 'update')
    if (!document) return
    return handleResponse(res, 201, `User updated successfully!`, document)
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch || !user) return res.status(401).json({ message: 'Invalid credentials.' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })

        return res.status(200).json({ user, token })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
