const router = require('express').Router()
const File = require('$models/file')
const User = require('$models/user')
const authenticate = require('$middlewares/authenticate')
const upload = require('$dtoMulterS3/upload')

router.post(
  '/upload',
  authenticate,
  upload.array('files'),
  async (req, res) => {
    try {
      let result = []
      const user = await User.findById(req.userId)
      console.log(req)
      const saveFilesInfo = new Promise((resolve, reject) => {
        req.files.forEach(async (f) => {
          let file = new File({
            originalName: f.originalname,
            location: f.location,
            size: f.size,
            type: f.type,
            uploader: user._id,
          })
          await file.save().then(async (savedFile) => {
            result.push(savedFile)
          })
        })
        return resolve(true)
      })
      await saveFilesInfo
      return res.status(200).json({ message: 'File(s) uploaded', result })
    } catch (err) {
      console.error('Error at /api/v1/file/upload')
      console.error(err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

module.exports = router
