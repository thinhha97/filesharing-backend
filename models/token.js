const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Date,
      expires: 900,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Token', tokenSchema)
