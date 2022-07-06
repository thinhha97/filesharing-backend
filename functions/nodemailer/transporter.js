const nodemailer = require('nodemailer')

const MAIL_USERNAME = process.env.MAIL_USERNAME
const MAIL_PASSWORD = process.env.MAIL_PASSWORD
const OAUTH_CLIENTID = process.env.OAUTH_CLIENTID
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN
const NODEMAILER_MAIL_SERVICE = process.env.NODEMAILER_MAIL_SERVICE
const NODEMAILER_AUTH_TYPE = process.env.NODEMAILER_AUTH_TYPE

const transporter = nodemailer.createTransport({
  service: NODEMAILER_MAIL_SERVICE,
  auth: {
    type: NODEMAILER_AUTH_TYPE,
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
    clientId: OAUTH_CLIENTID,
    clientSecret: OAUTH_CLIENT_SECRET,
    refreshToken: OAUTH_REFRESH_TOKEN,
  },
})

module.exports = transporter
