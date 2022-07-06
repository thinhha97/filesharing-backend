const router = require('express').Router()
const bcrypt = require('bcrypt')
const authenticate = require('$middlewares/authenticate')
const User = require('$models/user')

const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT)

router.put('/change', authenticate, async (req, res) => {
  try {
    const userId = req.userId
    const { oldPassword, password } = req.body
    let user = await User.findById(userId)
    const validOldPassword = await bcrypt.compare(
      oldPassword,
      user.passwords[0]
    )
    if (validOldPassword === true) {
      const checkPassword = new Promise((resolve, reject) => {
        user.passwords.forEach(async (pw) => {
          let matched = await bcrypt.compare(password, pw)
          if (matched === true) {
            return resolve(true)
          } else {
            resolve(false)
          }
        })
      })
      checkPassword.then(async (used) => {
        if (used === true) {
          res.status(409).json({ message: 'Password used' })
        } else {
          const salt = await bcrypt.genSalt(BCRYPT_SALT)
          const hashedPassword = await bcrypt.hash(password, salt)
          user.passwords.unshift(hashedPassword)
          await user.save()
          // TODO: email user that password has changed
          res.status(200).json({ message: 'Password changed successfully' })
        }
      })
    } else {
      res.status(401).json({ message: 'Invalid old password.' })
    }
  } catch (err) {
    console.error('Error changing password at /api/v1/user/password/change')
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
