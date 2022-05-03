require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const Link = require('./models/Link.js')
const app = express()
const path = require('path')
const sanitize = require('mongo-sanitize')

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes.js'))
app.use('/api/link', require('./routes/link.routes.js'))
app.use('/api/bot', require('./routes/bot.routes.js'))

app.get('/:code', async (req, res) => {
	try {
		const clean = sanitize(req.params.code)
		console.log(clean)
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
	app.use('/', express.static(path.join(__dirname, 'client', 'dist')))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	})
}

async function start() {
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
