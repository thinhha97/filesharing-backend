const { S3Client } = require('@aws-sdk/client-s3')
const aws = require('aws-sdk')

const s3 = new aws.S3()
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME

module.exports = (key, next) => {
  const deleteParams = {
    Key: key,
    Bucket: AWS_BUCKET_NAME,
  }
  s3.deleteObject(deleteParams, (err, data) => {
    next(err, data)
  })
}
