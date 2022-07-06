const mongoose = require('mongoose')

const PASSWORD_RESET_TOKEN_EXPIRACY_DURATION = parseInt(
  process.env.PASSWORD_RESET_TOKEN_EXPIRACY_DURATION
)

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: PASSWORD_RESET_TOKEN_EXPIRACY_DURATION,
  },
})

module.exports = mongoose.model('Token', tokenSchema)
