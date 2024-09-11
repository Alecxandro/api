import bcrypt from 'bcryptjs'
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}


export const authorizationAction = async (req, res, model) => {
    const { isAdmin } = req.user
    const { id } = req.params
    try {
        if (id === String(req.user._id)) {
            const user = await model.findById(req.user._id)
            return user
        }

        const query = isAdmin ? { _id: id } : { _id: id, user: String(req.user._id) }

        const document = await model.findOne(query)

        if (!document) return null

        return document
    } catch (error) {
        res.status(404).json({ message: 'Document not found' })
        return null
    }
}

export const handleResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json(data ? { message, data } : { message });
};