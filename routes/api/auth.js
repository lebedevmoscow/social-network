// Dependences
const express = require('express')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

const router = express.Router()

// @route POST api/auth
// @desc Authenticate user and get token
// @access Public
router.post(
	'/',
	[
		check('email', 'Please include a valid email!').isEmail(),
		check('password', 'Password is required').exists(),
	],

	async (req, res) => {
		const validationErrors = validationResult(req)

		// If users fill sent incorrect data or miss some fields
		if (!validationErrors.isEmpty()) {
			return res.status(200).json({ errors: validationErrors.array() })
		}

		try {
			const { email, password } = req.body

			// See if users exists
			let user = await User.findOne({ email })

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User is not found.' }] })
			}

			// Compare entered password and hashed one
			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid password.' }] })
			}

			// Return JSONWebToken
			const payload = {
				user: {
					id: user._id,
				},
			}

			const secretKey = config.get('JWT_SECRET')
			jwt.sign(
				payload,
				secretKey,
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err
					return res.json({ token })
				}
			)
		} catch (e) {
			console.log(e)
			return res.status(500).send('Server Error')
		}
	}
)
module.exports = router
