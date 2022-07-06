const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_REGION = process.env.AWS_REGION
const AWS_SIGNATURE_VERSION = process.env.AWS_SIGNATURE_VERSION


aws.config.update({
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  accessKeyId: AWS_ACCESS_KEY_ID,
  region: AWS_REGION,
  signatureVersion: AWS_SIGNATURE_VERSION,
})

const s3 = new aws.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, file.originalname)
    },
  }),
})

module.exports = upload
