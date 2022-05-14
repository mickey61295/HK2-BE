import { client } from '../index.js'
import bcrypt from 'bcrypt'

export async function genPassword(password) {
	const NO_OF_ROUNDS = 10
	const salt = await bcrypt.genSalt(NO_OF_ROUNDS)
	const hashedPassword = await bcrypt.hash(password, salt)
	return hashedPassword
}

export async function getUserbyName(username) {
	return await client
		.db('bms')
		.collection('users')
		.find({ username: username })
		.toArray()
}

export async function verifyPassword(password, userPassword) {
	return await bcrypt.compare(password, userPassword)
}
