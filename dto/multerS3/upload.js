const multer = require('multer')
const multerS3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_REGION = process.env.AWS_REGION
const AWS_SIGNATURE_VERSION = process.env.AWS_SIGNATURE_VERSION

const s3 = new S3Client()

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString()+file.originalname)
    },
  }),
})

module.exports = upload
