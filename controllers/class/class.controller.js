import Class from '../../models/Class.model.js'
import * as dotenv from 'dotenv'

dotenv.config()

export const registerClass = async (req, res) => {
    const { title, description } = req.body

    try {
        const newClass = new Class({ title, description, user: req.user._id })
        await newClass.save()
        res.status(201).json(newClass)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
}
