require('dotenv').config()
require('module-alias/register')
require('$dtoMongoose/connect')()
const server = require('./server')

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
