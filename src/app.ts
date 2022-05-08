import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import sanitize from 'mongo-sanitize'
import Link from './models/Link'
import dotenv from 'dotenv'
import { authRoutes, botRoutes, linkRoutes } from './routes'

dotenv.config()

const app = express()

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/link', linkRoutes)
app.use('/api/bot', botRoutes)

app.get('/t/:code', async (req, res) => {
	try {
		const clean = sanitize(req.params.code)

		const link = await Link.findOne({ code: clean })
		if (link) {
			link.clicks++
			await link.save()
			return res.redirect(link.to)
		}
		res.status(404).json({ message: 'Invalid link' })
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
	}
})

if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.resolve('./client/dist')))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve('./client/dist/index.html'))
	})
}

async function start() {
	if (!process.env.MONGOURI) return console.log('No mongouri string')
	mongoose.connect(process.env.MONGOURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	app.listen(process.env.PORT, () => {
		console.log(`port: ${process.env.PORT}`)
	})
}


start()
