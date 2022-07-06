const transporter = require('./transporter')

module.export = (mailOptions) => {
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error('Error sending Email')
      console.error(err)
    }
  })
}