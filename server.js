import './services/passport.js'
import express from 'express'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import passport from 'passport'
import DBConnection from './services/db.js'
import { setupRoutes } from './routes/setup.js'

dotenv.config()
DBConnection()

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())

setupRoutes(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
