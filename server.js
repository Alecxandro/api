import './services/passport.js'
import express from 'express'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser';
import passport from 'passport';
import router from './Routes.js';
import DBConnection from './services/db.js';

dotenv.config();
DBConnection();
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use('/', router)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});