import express from 'express'
import { client } from '../index.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.get('/', async (req, res) => {
	res.send(await client.db('bms').collection('movies').find(req.query))
})

export const moviesRouter = router
