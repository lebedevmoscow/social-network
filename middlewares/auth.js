// Dependences
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
	// Get token from header
	const token = req.header('x-auth-token')

	// If token is not exist or not valid
	if (!token) {
		return res.status(401).json({ msg: 'No token, auth denied.' })
	}

	try {
		const decodedJwt = jwt.verify(token, config.get('JWT_SECRET'))

		req.user = decodedJwt.user
		next()
	} catch (e) {
		return res.status(401).json({ msg: 'Token is not valid' })
	}
}
