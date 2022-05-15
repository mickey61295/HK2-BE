import express from 'express'
import { getUserbyName, genPassword } from './helper.js'
import { client } from '../index.js'
import { adminauth } from '../middleware/adminauth.js'
import { ObjectId } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

router.get('/', adminauth, async (req, res) => {
	const user = await getUserbyName(req.body.username)
	if (user.role == 'admin') {
		res.send('You are an admin')
	} else {
		res.send('You are not an admin')
	}
})

router.post('/createadmin', adminauth, async (req, res) => {
	const { username, password } = req.body
	const hashedPassword = await genPassword(password)
	console.log(username, hashedPassword)
	res.send(
		await client
			.db('bms')
			.collection('users')
			.insertOne({ username, password: hashedPassword, role: 'admin' })
	)
})

router.post('/createtheatre', adminauth, async (req, res) => {
	const { theatreName, theatreLocation } = req.body
	const theatre = await client
		.db('bms')
		.collection('theatres')
		.findOne({ theatreName: theatreName })
	if (theatre) {
		res.status(400).send('Theatre already exists')
	} else {
		res.send(
			await client
				.db('bms')
				.collection('theatres')
				.insertOne({
					theatreName: theatreName,
					theatreLocation: theatreLocation,
					movies: null,
					showTimes: ['12:00', '15:00', '18:00', '21:00'],
				})
		)
	}
})

router.put('/updatetheatre/:id', adminauth, async (req, res) => {
	const id = ObjectId(req.params.id)
	const theatre = await client
		.db('bms')
		.collection('theatres')
		.findOne({ _id: id })
	if (theatre) {
		res.send(
			await client.db('bms').collection('theatres').updateOne(
				{ _id: id },
				{
					$set: req.body,
				}
			)
		)
	} else {
		res.status(400).send('Theatre does not exist')
	}
})

router.put('/addmovie', adminauth, async (req, res) => {
	const {
		movieName,
		movieDescription,
		moviePoster,
		movieTrailer,
		movieTheatre,
	} = req.body
	const movie = await client
		.db('bms')
		.collection('movies')
		.findOne({ movieName: movieName })
	if (movie) {
		res.status(400).send('Movie already exists')
	} else {
		res.send(
			await client.db('bms').collection('movies').insertOne({
				movieName: movieName,
				movieDescription: movieDescription,
				moviePoster: moviePoster,
				movieTrailer: movieTrailer,
				movieTheatre: movieTheatre,
			})
		)
	}
})


router.delete('/deletetheatre/:id', adminauth, async (req, res) => {
	const id = ObjectId(req.params.id)
	res.send(await client.db('bms').collection('theatres').deleteOne({ _id: id }))
})

export const adminRouter = router
