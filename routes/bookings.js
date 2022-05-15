import express from 'express'
import { client } from '../index.js'
import { adminauth } from '../middleware/adminauth.js'
import { auth } from '../middleware/auth.js'
import { ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

router.get('/', adminauth, async (req, res) => {
	const books = await client.db('bms').collection('bookings').find(req.query)
	res.send(books)
})

router.post('/createbooking', auth, async (req, res) => {
	const { userId, movieId, showTime, seats } = req.body
	const booking = await client.db('bms').collection('bookings').insertOne({
		userId: userId,
		movieId: movieId,
		showTime: showTime,
		seats: seats,
	})
	await client
		.db('bms')
		.collection('users')
		.updateOne(
			{ _id: ObjectId(userId) },
			{ $push: { bookings: booking.insertedId } }
		)
	await client
		.db('bms')
		.collection('theatres')
		.updateOne(
			{ _id: ObjectId(movieId) },
			{ $push: { bookings: booking.insertedId, seatsBooked: seats } }
		)
	res.send('Booking successful')
})

router.get('/gettheatres', async (req, res) => {
	res.send(await client.db('bms').collection('theatres').find())
})

export const bookingsRouter = router
