import express from 'express'
import { ObjectId } from 'mongodb'
import { client } from '../index.js'

const router = express.Router()

router.get('/', async (req, res) => {
	res.send(await client.db('bms').collection('theatres').findOne())
})

router.get('/:id', async (req, res) => {
	res.send(
		await client
			.db('bms')
			.collection('theatres')
			.findOne({ _id: ObjectId(req.params.id) })
	)
})

export const theatreRouter = router
