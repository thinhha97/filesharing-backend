const router = require('express').Router()
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const authenticate = require('$middlewares/authenticate')
const User = require('$models/user')
const Token = require('$models/token')

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

router.post('/reset', async (req, res) => {
  try {
    const { email, re } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email address required' })
    }
    const user = await User.findOne({ email })
    if (user === null) {
      return res
        .status(404)
        .json({ message: 'An user with provided email does not exist' })
    }
    const existingDocument = await Token.findOne({ userId: user._id })
    if (existingDocument) {
      if (!re) {
        return res.status(425).json({
          message: `The password reset link has already been sent. Provide field re=true in req body to resent.`,
        })
      } else {
        existingDocument.createdAt = Date.now()
        await existingDocument.save()
        // TODO: send password reset link, again
        return res.status(200).json({ message: 'Password reset link resent' })
      }
    }
    const token = crypto.randomBytes(32).toString('hex')
    const tokenDoc = new Token({
      userId: user._id,
      token,
    })
    await tokenDoc.save()
    const link = `${req.protocol}://${req.hostname}/password-reset/${user._id}/${token}`
    console.log(link)
    // TODO: email reset link to user's email address
    return res.status(200).json({ message: 'Password reset link sent' })
  } catch (err) {
    console.error('Error at /api/v1/user/password/reset')
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/reset/:userId/:token', async (req, res) => {
  try {
    const { userId, token } = req.params
    const { password } = req.body
    if (!password) {
      return res.status(400).json({message: 'Password is required'})
    }
    const user = await User.findById(userId)
    if (user) {
      const tokenDocument = await Token.findOne({ userId })
      const isValidToken = tokenDocument && tokenDocument.token === token
      if (isValidToken) {
        const salt = await bcrypt.genSalt(BCRYPT_SALT)
        const hashedPassword = await bcrypt.hash(password, salt)
        user.passwords.unshift(hashedPassword)
        await user.save()
        await tokenDocument.delete()
        // TODO: email user that password has changed
        return res.status(200).json({message: 'Password changed'})
      } else {
        return res.status(401).json({message: 'Invalid or exprired token'})
      }
    } else {
      return res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    console.error('Error at /api/v1/user/password/reset/:userId/:token')
    console.error(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
