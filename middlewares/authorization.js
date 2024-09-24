import modelPermissions from './modelPermissions.js'
import bcrypt from 'bcryptjs'

export const authorizationAction = async (req, res, model, action = 'read', modelName = 'users') => {
    const { role } = req.user
    const { id } = req.params

    const permissions = modelPermissions[modelName]
    console.log(`Role: ${role}, Action: ${action}, ModelName: ${modelName}`)

    if (!permissions) {
        console.log('Invalid model:', modelName)
        res.status(400).json({ message: `Invalid model: ${modelName}` })
        return null
    }

    const actionPermissions = permissions.canCRUD
    console.log('Action Permissions:', actionPermissions)
    if (!actionPermissions) {
        console.log('Invalid action:', action)
        res.status(403).json({ message: `Invalid action: ${action}` })
        return null
    }

    try {
        if (role === 'instructor' || role === 'student') {
            if (id !== String(req.user._id)) {
                console.log('Not authorized to perform this action')
                res.status(403).json({
                    message: 'You are not authorized to perform this action',
                })
                return null
            }
        }

        if (id === String(req.user._id)) {
            const user = await model.findById(req.user._id)
            if (!user) {
                console.log('User not found')
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
            console.log('Target document not found')
            res.status(404).json({ message: 'Target document not found' })
            return null
        }

        const targetRole = modelName === 'users' ? targetDocument.role : modelName
        const allowedRoles = actionPermissions[role]
        console.log('Allowed Roles:', allowedRoles) // Log allowed roles

        if (!allowedRoles.includes(targetRole)) {
            console.log('Not authorized to perform this action on target role')
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
                console.log('Invalid action')
                res.status(400).json({ message: 'Invalid action' })
                return null
        }

        if (!document && action !== 'register') {
            console.log('Document not found')
            res.status(404).json({ message: 'Document not found' })
            return null
        }

        console.log('Document successfully processed:', document) // Log the created or found document
        return document
    } catch (error) {
        console.log('Error occurred:', error.message)
        res.status(500).json({
            message: `An error has occurred. Details: ${error.message}`,
        })
        return null
    }
}

export const handleResponse = (res, statusCode, message, data = null) => {
    if (res.headersSent) {
        console.warn('Attempted to send headers after they were already sent.')
        return
    }
    res.status(statusCode).json(data ? { message, data } : { message })
}
