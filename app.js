require('dotenv').config()
require('colors')
const express = require('express')
const morgan = require('morgan')
const dbconnect = require('./config')
const { notFound, errHandler } = require('./middleware/errMiddleware')
const { protect } = require('./middleware/authMiddleware')

const app = express()
const ENV = process.env.NODE_ENV
const PORT = process.env.PORT || 5000

// LAUNCH BOT
require('./telegrambot/bot')

// SERVER CONFIG
dbconnect()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
if (ENV === 'dev') app.use(morgan('dev'))

// ROUTES
app.use('/ping', (req, res) => res.status(200).json({ message: 'PING' }))
app.use(protect)
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/review', require('./routes/reviewRoutes'))
app.use('/api/link', require('./routes/linkRoutes'))
app.use('/api/statistic', require('./routes/statisticRoutes'))
app.use('/api/vip', require('./routes/vipRoutes'))

app.get('/favicon.ico', (req, res) => res.status(204))
app.use(notFound)
app.use(errHandler)

// SERVER
app.listen(PORT, () => console.log(`Server run on port: ${PORT}`.yellow.bold))
