require('dotenv').config()
const router = require('express').Router()
const Link = require('../models/Link')
const jwt = require('jsonwebtoken')
const sanitize = require('mongo-sanitize')

router.post('/new', authMiddle, async (req, res) => {
	try {
		let { to } = req.body
		to = sanitize(to)
		const code = require('shortid').generate()
		const linkReady = await Link.findOne({ to })

		if (linkReady) return res.json({ link: linkReady })

		const from = `${process.env.BASE_URL}/${code}`
		const link = new Link({
			to, from, code, owner: req.user.userId
		})

		await link.save()

		res.status(201).json({ link, message: 'Ссылка создана' })
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
	}
})

router.patch('/del/:code', authMiddle, async (req, res) => {
	try {
		const clean = sanitize(req.params.code)

		await Link.findOneAndDelete({ code: clean })

		res.status(200).json({ message: 'Ссылка удалена' })
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
		console.log(e)
	}
})

router.get('/', authMiddle, async (req, res) => {
	try {
		const clean = sanitize(req.user.userId)
		const links = await Link.find({ owner: clean })
		res.status(200).json(links)
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
	}
})

router.get('/:code', authMiddle, async (req, res) => {
	try {
		const clean = sanitize(req.params.code)
		const link = await Link.findOne({ code: clean })
		res.status(200).json(link)
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
	}
})

function authMiddle(req, res, next) {
	if (req.method === 'OPTIONS') return next()

	try {
		const token = req.headers.authorization.split(' ')[1]
		if (!token) return res.status(401)

		const tokenDecode = jwt.verify(token, process.env.JWTS)
		req.user = tokenDecode

		next()
	} catch (e) {
		res.status(401).json({ message: e.message })
		console.log(e.message)
	}
}

module.exports = router
