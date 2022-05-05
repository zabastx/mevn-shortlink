require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const sanitize = require('mongo-sanitize')

router.post('/register', [
	check('username', 'Логин короче 3 символов').isLength({ min: 3 }),
	check('password', 'Пароль короче 6 символов').isLength({ min: 6 })
],
	async (req, res) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Неверные данные'
				})
			}
			const username = sanitize(req.body.username)
			const password = sanitize(req.body.password)

			const candidate = await User.findOne({ username })

			if (candidate) {
				return res.status(400).json({ message: 'Такой пользователь уже зарегистрирован' })
			}

			const hashedPass = await bcrypt.hash(password, 12)
			bcrypt.hashSync

			const user = new User({ username, password: hashedPass })
			await user.save()

			res.status(201).json({ message: 'Аккаунт зарегистрирован' })
		} catch (error) {
			res.status(500).json({ message: 'error in auth/register' })
			console.log(error)
		}
	})

router.post('/login', [
	check('username', 'Invalid username').exists(),
	check('password', 'Password field is empty').exists()
], async (req, res) => {
	try {
		const errors = validationResult(req)

		const username = sanitize(req.body.username)
		const password = sanitize(req.body.password)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Неверные данные'
			})
		}

		const user = await User.findOne({ username })

		if (!user) {
			return res.status(400).json({ message: 'Нет пользователя с таким именем' })
		}

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) {
			return res.status(400).json({ message: 'Неверный пароль' })
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWTS, { expiresIn: '1h' })

		res.status(200).json({ token, userId: user.id, username })
	} catch (error) {
		res.status(500).json({ message: 'error in auth/login' })
		console.log(error)
	}
})

module.exports = router
