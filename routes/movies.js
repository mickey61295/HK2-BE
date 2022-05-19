import express from 'express'
import { ObjectId } from 'mongodb'
import { client } from '../index.js'

const router = express.Router()

router.get('/', async (req, res) => {
	res.send(await client.db('bms').collection('movies').find({}).toArray())
})

router.get('/:id', async (req, res) => {
	res.send(
		await client
			.db('bms')
			.collection('movies')
			.findOne({ _id: ObjectId(req.params.id) }.toArray())
	)
})

export const moviesRouter = router
