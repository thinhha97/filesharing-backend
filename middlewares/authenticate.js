const jwt = require('jsonwebtoken')
const User = require('$models/user')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) {
      res.status(401).json({ message: 'Access token required' })
    } else {
      jwt.verify(token, JWT_SECRET, async (err, data) => {
        if (err) {
          console.error(err)
        }
        const user = await User.findById(data)
        if (user === null) {
          res.status(401).json({ message: 'Invalid token provided' })
        } else {
          req.userId = user._id
          next()
        }
      })
    }
  } catch (err) {
    console.error('Error authenticating in "middlewares/authenticate.js"')
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error', err: `${err}` })
  }
}
