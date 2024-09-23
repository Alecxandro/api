import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ignoredFiles = ['setup.js']

const routesPath = path.join(__dirname)

export const setupRoutes = async (app) => {
    try {
        const files = await fs.readdir(routesPath)
        const routePromises = files
            .filter(
                (file) => file.endsWith('.js') && !ignoredFiles.includes(file)
            )
            .map(async (file) => {
                const filePath = path.join(routesPath, file)

                const fileUrl = pathToFileURL(filePath).href
                const route = await import(fileUrl)

                const routeName = file.split('.')[0]
                app.use(`/${routeName}`, route.default)
            })

        await Promise.all(routePromises)
        console.log('Routes loaded successfully')
    } catch (error) {
        console.error('Error loading routes:', error)
    }
}
