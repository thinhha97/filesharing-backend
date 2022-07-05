const { builtinModules } = require('module')
const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },
    size: Number,
    type: String,
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: String,
      required: true,
    },
    passwords: [String],
    private: {
      type: Boolean,
      default: false,
    },
    whiteList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('File', fileSchema)
