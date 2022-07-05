const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('$models/user')

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user !== null) {
      res.status(409).json({
        message: 'An user is already existed with provided email address.',
      })
    } else {
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(password, salt)
      const newUser = new User({
        email,
        passwords: [hashedPassword],
      })
      await newUser.save()
      console.log(newUser)
      res.status(201).json({ id: newUser._id, email })
      
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', err: `${err}` })
  }
})

module.exports = router
