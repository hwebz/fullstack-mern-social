import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import multer from 'multer'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import { register } from './controllers/auth.js'

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// FILE STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

// ROUTES WITH FILES
app.use('/auth/register', upload.single('avatar'), register)

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
  })
}).catch((error) => {
  console.log(error.message)
})