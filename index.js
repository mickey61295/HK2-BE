import express from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import cors from 'cors'
import { usersRouter } from './routes/users.js'
import { adminRouter } from './routes/admin.js'
import { bookingsRouter } from './routes/bookings.js'
import { moviesRouter } from './routes/movies.js'
import { theatreRouter } from './routes/theatres.js'

const app = express()

dotenv.config()

const PORT = process.env.PORT

const MONGO_URL = process.env.MONGO_URL

async function createConnection() {
	const client = new MongoClient(MONGO_URL)
	await client.connect()
	console.log('Connected to MongoDB')
	return client
}

export const client = await createConnection()

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello World')
})

app.use('/users', usersRouter)
app.use('/admin', adminRouter)
app.use('/bookings', bookingsRouter)
app.use('/movies', moviesRouter)
app.use('/theatres', theatreRouter)

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
})
