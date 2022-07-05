const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI

module.exports = async () => {
  await mongoose
    .connect(MONGO_URI, { keepAlive: true })
    .then(() => {
      console.log(`Connected to MongoDB`)
    })
    .catch((err) => {
      console.error(`Error connecting to MongoDB`)
      console.log(err)
      process.exit(1)
    })
}
