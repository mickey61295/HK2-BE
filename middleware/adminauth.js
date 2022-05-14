import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'

export const adminauth = (req, res, next) => {
	try {
		const token = req.header('x-auth-token')
		const decoded = jwtDecode(token)
		if (decoded.role === 'admin') {
			try {
				jwt.verify(token, process.env.SECRET)
				next()
			} catch (e) {
				res.status(401).send({ Message: e })
				next()
			}
		} else {
			res.status(401).send({ Message: 'You are not an admin' })
			next()
		}
	} catch (e) {
		res.status(401).send({ Message: e })
		next()
	}
}
