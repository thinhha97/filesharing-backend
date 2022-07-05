const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('$models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user === null) {
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(password, salt)
      const newUser = new User({
        email,
        passwords: [hashedPassword],
      })
      await newUser.save()
      console.log(newUser)
      res.status(201).json({ id: newUser._id, email })
    } else {
      res.status(409).json({
        message: 'An user is already existed with provided email address.',
      })
    }
  } catch (err) {
    console.error('Error at /api/v1/user/signup')
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error', err: `${err}` })
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user === null) {
      res
        .status(404)
        .json({ message: 'An user with provided email not found.' })
    } else {
      const matched = await bcrypt.compare(password, user.passwords[0])
      if (!matched) {
        res.status(401).json({ message: 'Invalid password' })
      } else {
        const token = jwt.sign(user._id.toString(), JWT_SECRET)
        res.status(200).json({ message: 'Successfully signing in', token })
      }
    }
  } catch (err) {
    console.error('Error at /api/v1/user/signin')
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error', err: `${err}` })
  }
})

module.exports = router
