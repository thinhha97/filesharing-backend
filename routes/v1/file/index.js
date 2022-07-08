const router = require('express').Router()
const File = require('$models/file')
const User = require('$models/user')
const authenticate = require('$middlewares/authenticate')
const upload = require('$dtoMulterS3/upload')
const https = require('https')
const deleteFile = require('../../../functions/file/delete')

router.post(
  '/upload',
  authenticate,
  upload.array('files'),
  async (req, res) => {
    try {
      let results
      const user = await User.findById(req.userId)
      const saveFilesInfo = new Promise((resolve, reject) => {
        req.files.forEach(async (f) => {
          let file = new File({
            originalName: f.originalname,
            key: f.key,
            location: f.location,
            size: f.size,
            type: f.type,
            uploader: user._id,
          })
          await file.save()
          results[f.originalname] = file._id
        })
        return resolve(true)
      })
      await saveFilesInfo
      return res.status(200).json({ message: 'File(s) uploaded', results })
    } catch (err) {
      console.error('Error at /api/v1/file/upload')
      console.error(err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
)

router.get('/download/:id', async (req, res) => {
  try {
    // TODO: Implement file restriction.
    const { id } = req.params
    const file = await File.findById(id)
    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }
    res.header(
      'Content-Disposition',
      `attachment; filename="${file.originalName}"`
    )
    https.get(file.location, (f) => {
      f.pipe(res)
    })
  } catch (err) {
    console.error('Error at /api/v1/file/download/:id')
    console.error(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const file = await File.findById(id)
    if (!file || file.deletedAt) {
      return res.status(404).json({ message: 'File not found' })
    }
    if (req.userId.toString() !== file.uploader.toString()) {
      return res.status(401).json({ message: 'Not the file owner' })
    }
    deleteFile(file.key)
    file.deletedAt = Date.now()
    await file.save()
    return res.status(200).json({ message: 'File deleted' })
  } catch (err) {
    console.error('Error at /api/v1/file/delete/:id')
    console.error(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
