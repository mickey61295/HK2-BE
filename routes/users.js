import express from 'express'
import { genPassword, getUserbyName, verifyPassword } from './helper.js'
import { client } from '../index.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.post('/signup', async (req, res) => {
	const { username, password } = req.body
	const hashedPassword = await genPassword(password)
	const user = await getUserbyName(username)
	console.log(user)
	if (user.length < 1) {
		client.db('bms').collection('users').insertOne({
			username: username,
			password: hashedPassword,
			role: 'genpop',
		})
		res.send('User created')
	} else {
		res.status(400).send('User already exists')
	}
})

router.post('/login', async (req, res) => {
	const { username, password } = req.body
	const user = await getUserbyName(username)

	if (user) {
		const valid = await verifyPassword(password, user[0].password)
		if (valid) {
			const token = jwt.sign(
				{ _id: user[0]._id, role: user[0].role },
				process.env.SECRET
			)
			res
				.header('x-auth-token', token)
				.send({ token: token, role: user[0].role })
		} else {
			res.status(400).send('Invalid password')
		}
	} else {
		res.status(400).send('User does not exist')
	}
})

router.post('/resetpassword', async (req, res) => {
	const { username } = req.body

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL,
			pass: process.env.GMAIL_PASSWORD,
		},
	})

	const user = await getUserbyName(username)
	if (user) {
		const hashedPassword = await genPassword(username)
		client
			.db('bms')
			.collection('users')
			.updateOne(
				{
					username: username,
				},
				{
					$set: {
						password: hashedPassword,
					},
				}
			)
		var mailOptions = {
			from: process.env.GMAIL,
			to: username,
			subject: 'Reset Password',
			text: `Click on the link below to reset your password:
				http://hk2.netlify.com/resetpassword?username=${username}?string=${hashedPassword}`,
		}
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error)
			} else {
				console.log('Email sent: ' + info.response)
			}
		})
	}

	res.send('Password reset email sent')
})

router.post('/setnewpassword', async (req, res) => {
	const { username, string } = req.query

	const { newPassword } = req.body
	const user = await getUserbyName(username)
	if (user) {
		if (user[0].password === string) {
			const hashedPassword = await genPassword(newPassword)
			client
				.db('bms')
				.collection('users')
				.updateOne(
					{ username: username },
					{ $set: { password: hashedPassword } }
				)
		}
		res.send('Password reset successful')
	} else {
		res.status(400).send('User does not exist')
	}
})

export const usersRouter = router
