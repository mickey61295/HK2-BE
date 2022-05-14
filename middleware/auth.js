import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
	try {
		const token = req.header('x-auth-token')
		jwt.verify(token, process.env.SECRET)
		next()
	} catch (e) {
		res.status(401).send({ Message: e })
	}
}