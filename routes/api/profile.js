const express = require('express')
const router = express.Router()
const auth = require('./../../middlewares/auth')
const Profile = require('./../../models/Profile')
const { check, validationResult } = require('express-validator')
const { compare } = require('bcryptjs')
const request = require('request')
const config = require('config')
const e = require('express')

// @route GET api/profile/me
// @desc Get current users profile
// @access Private

router.get('/me', auth, async (req, res) => {
	try {
		console.log('req.user', req.user)
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['name, avatar'])

		if (!profile) {
			return res
				.status(400)
				.json({ msg: 'There is no profile for this user.' })
		}

		return res.status(200).json(profile)
	} catch (e) {
		console.log('Error: ', e.message || e)
		res.status(500).send('Server Error')
	}
})

// @route POST api/profile/
// @desc Create or Update a user profile
// @access Private

router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required.').not().isEmpty(),
			check('skills', 'Skills is required.').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body

		const newProfile = {}

		newProfile.user = req.user.id
		if (company) newProfile.company = company
		if (website) newProfile.website = website
		if (location) newProfile.location = location
		if (bio) newProfile.bio = bio
		if (status) newProfile.status = status
		if (githubusername) newProfile.githubusername = githubusername
		if (skills) {
			newProfile.skills = skills.split(',').map((skill) => skill.trim())
		}

		newProfile.social = {}
		if (youtube) newProfile.social.youtube = youtube
		if (facebook) newProfile.social.facebook = facebook
		if (twitter) newProfile.social.twitter = twitter
		if (linkedin) newProfile.social.linkedin = linkedin

		try {
			let profile = await Profile.findOne({ user: req.user.id })

			// If there is exist a user profile
			if (profile) {
				// Updating profile
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ ...newProfile }
				)
				profile.save()
				return res.status(200).json(profile)
			}

			// Else if user only creates a new one profile
			else {
				profile = new Profile({ ...newProfile })
				await profile.save()
				res.status(200).json(profile)
			}
		} catch (e) {
			console.log('e', e.message || e)
			return res.status(500).send('Server Error')
		}
	}
)

// @route GET api/profile/
// @desc Get all profiels
// @access Public

router.get('/', async (req, res) => {
	try {
		let profiles = await Profile.find().populate('user', ['name, avatar'])
		res.json(profiles)
	} catch (e) {
		console.log('e', e.message || e)
		res.status(500).send('Server Error')
	}
})

// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
	try {
		let profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name, avatar'])

		if (!profile) {
			return res.status(400).json({ msg: 'Profile not found' })
		}

		return res.json(profile)
	} catch (e) {
		console.log('e', e.message || e)
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' })
		}
		res.status(500).send('Server Error')
	}
})

// @route DELETE api/profile
// @desc Delete profile, user & posts
// @access Private

router.delete('/', auth, async (req, res) => {
	try {
		// @TODO - remove user posts

		// Removing profile
		await Profile.findOneAndRemove({ user: req.user.id })

		// And user as well
		await User.findOneAndRemove({ _id: req.user.id })

		res.json({ msg: 'User has been deleted.' })
	} catch (e) {
		console.log('e', e.message || e)
		res.status(500).send('Server Error')
	}
})

// @route PUT api/profile/experience
// @desc Add profile experience
// @access Private

router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'Title is required').not().isEmpty(),
			check('company', 'Company is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		} = req.body

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		}

		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.experience.unshift(newExp)
			await profile.save()

			res.status(200).json(profile)
		} catch (e) {
			console.log('e', e.message || e)
			res.status(500).send('Server Error')
		}
	}
)

// @route DELETE api/profile/experience/:exp_id
// @desc Delete experience from profile by ID
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })

		// Get remove index
		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id)

		profile.experience.splice(removeIndex, 1)

		await profile.save()

		res.json(profile)
	} catch (e) {
		console.log('e', e.message || e)
		res.status(500).send('Server Error')
	}
})

// @route PUT api/profile/education
// @desc Add profile education
// @access Private

router.put(
	'/education',
	[
		auth,
		check('school', 'School is required').not().isEmpty(),
		check('degree', 'Degree is required').not().isEmpty(),
		check('fieldofstudy', 'Field of study if required').not().isEmpty(),
		check('from', 'From date is required').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(200).json({ errors: errors.array() })
		}

		const {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		}

		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.education.unshift(newEdu)

			await profile.save()
			res.status(200).json(profile)
		} catch (e) {
			console.log('e', e.message || e)
			res.status(500).send('Server Error')
		}
	}
)

// @route DELETE api/profile/education
// @desc Delete education field by ID
// @access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })

		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id)

		profile.education.splice(removeIndex, 1)

		await profile.save()
		res.json(profile)
	} catch (e) {
		console.log('e', e.message || e)
		res.status(500).send('Server Error')
	}
})

// @route GET api/profile/github/:username
// @desc Get user repos from Github
// @access Public

router.get('/github/:username', async (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'GITHUB_CLIENTID'
			)}&client_secret=${config.get('GITHUB_SECRET')}`,
			method: 'GET',
			headers: {
				'user-agent': 'node.js',
			},
		}

		request(options, (err, response, body) => {
			if (err) console.error(error)

			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: 'No Github found' })
			}

			return res.json(JSON.parse(body))
		})
	} catch (e) {
		console.log('e', e.message || e)
		res.status(500).send('Server Error')
	}
})

module.exports = router
