// Dependences
const express = require('express')
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

// User Model
const User = require('./../../models/User')
const { has } = require('config')

const router = express.Router()

// @route GET api/users
// @desc Test Route
// @access Public
router.get('/', (req, res) => res.send('User Router [GET]'))

// @route POST api/users
// @desc Register users
// @access Public
router.post(
	'/',
	[
		check('name', 'Name is required!').not().isEmpty(),
		check('email', 'Please include a valid email!').isEmail(),
		check(
			'password',
			'Your password is must have at least 3 or more characters!'
		).isLength({ min: 3 }),
	],

	async (req, res) => {
		const validationErrors = validationResult(req)

		// If users fill sent incorrect data or miss some fields
		if (!validationErrors.isEmpty()) {
			return res.status(400).json({ errors: validationErrors.array() })
		}

		try {
			const { name, email, password } = req.body

			// See if users exists
			let user = await User.findOne({ email })

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'User already exists' }] })
			}

			// Get users gravatar
			const avatar = gravatar.url(email, {
				s: '200',
				pg: 'pg',
				d: 'mm',
			})

			// Encrypt password
			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(password, salt)

			// Register new user
			user = new User({
				name,
				password: hashedPassword,
				avatar,
				email,
			})

			await user.save()

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
