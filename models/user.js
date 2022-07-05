const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    passwords: {
      type: [String],
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    uploadedFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    lastSignin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
