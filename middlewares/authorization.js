import modelPermissions from './modelPermissions.js'
import bcrypt from 'bcryptjs'

const authorizationAction = async (req, res, model, action = 'read', modelName = 'users') => {
    const { role } = req.user
    const { id } = req.params

    const permissions = modelPermissions[modelName]

    if (!permissions) {
        res.status(400).json({ message: `Invalid model: ${modelName}` })
        return null
    }

    const actionPermissions = permissions.canCRUD

    if (!actionPermissions) {
        res.status(403).json({ message: `Invalid action: ${action}` })
        return null
    }

    try {
        if (role === 'instructor' || role === 'student') {
            if (id !== String(req.user._id)) {
                res.status(403).json({
                    message: 'You are not authorized to perform this action',
                })
                return null
            }
        }

        if (id === String(req.user._id)) {
            const user = await model.findById(req.user._id)
            if (!user) {
                res.status(404).json({ message: 'User not found' })
                return null
            }
            return user
        }

        if (action === 'register') {
            if (modelName === 'users' && req.body.password) {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }

            const document = await model.create(req.body)

            return document
        }

        const targetDocument = await model.findById(id)
        if (!targetDocument) {
            res.status(404).json({ message: 'Target document not found' })
            return null
        }

        const targetRole = modelName === 'users' ? targetDocument.role : modelName
        const allowedRoles = actionPermissions[role]

        if (!allowedRoles.includes(targetRole)) {
            res.status(403).json({
                message: 'You are not authorized to perform this action',
            })
            return null
        }

        let document
        switch (action) {
            case 'read':
                document = await model.findOne({ _id: id })
                break

            case 'update':
                document = await model.findByIdAndUpdate(id, req.body, {
                    new: true,
                })
                break
            case 'delete':
                document = await model.findByIdAndDelete(id)
                break
            default:
                res.status(400).json({ message: 'Invalid action' })
                return null
        }

        if (!document && action !== 'register') {
            res.status(404).json({ message: 'Document not found' })
            return null
        }

        return document
    } catch (error) {
        res.status(500).json({
            message: `An error has occurred. Details: ${error.message}`,
        })
        return null
    }
}

const handleResponse = (res, statusCode, message, data = null) => {
    if (res.headersSent) {
        return
    }
    res.status(statusCode).json(data ? { message, data } : { message })
}

export { handleResponse, authorizationAction }
