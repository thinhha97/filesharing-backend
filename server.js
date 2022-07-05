const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.urlencoded())
app.use(express.json())
app.use(cookieParser())

module.exports = app