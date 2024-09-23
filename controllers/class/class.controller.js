import Class from '../../models/Class.model.js'
import * as dotenv from 'dotenv'
import { authorizationAction, handleResponse } from '../../middlewares/authorization.js'

dotenv.config()

export const registerClass = async (req, res) => {
    const document = await authorizationAction(req, res, Class, 'register')
    if (!document) return

    return handleResponse(
        res,
        201,
        `User registration successful: ${document.title}`,
        document
    )
}

