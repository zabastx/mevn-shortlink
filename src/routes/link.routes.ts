import { Router, Request, Response, NextFunction } from 'express'
import Link from '../models/Link'
import jwt from 'jsonwebtoken'
import sanitize from 'mongo-sanitize'
import { generate } from 'shortid'

const router = Router()

type User = {
	userId: string
}

type ReqBody = {
	to: string
	user: User
}

interface LinkRequest extends Request<{ code: string }, {}, ReqBody> { }

router.post('/new', authMiddle, async (req: LinkRequest, res: Response) => {
	try {
		let { to } = req.body
		to = sanitize<string>(to)
		const code = generate()
		const linkReady = await Link.findOne({ to })

		if (linkReady) return res.json({ link: linkReady })

		const from = `${process.env.BASE_URL}/t/${code}`
		const link = new Link({
			to, from, code, owner: req.body.user.userId
		})

		await link.save()

		res.status(201).json({ link, message: 'Ссылка создана' })
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
	}
})

router.patch('/del/:code', authMiddle, async (req, res) => {
	try {
		const clean = sanitize<string>(req.params.code)

		await Link.findOneAndDelete({ code: clean })

		res.status(200).json({ message: 'Ссылка удалена' })
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
		console.log(e)
	}
})

router.get('/', authMiddle, async (req, res) => {
	try {
		const clean = sanitize<string>(req.body.user.userId)
		const links = await Link.find({ owner: clean })
		res.status(200).json(links)
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
	}
})

router.get('/:code', authMiddle, async (req, res) => {
	try {
		const clean = sanitize<string>(req.params.code)
		const link = await Link.findOne({ code: clean })
		res.status(200).json(link)
	} catch (e) {
		res.status(500).json({ message: 'Server error' })
	}
})

function authMiddle(req: LinkRequest, res: Response, next: NextFunction) {
	if (req.method === 'OPTIONS') return next()
	try {
		if (!req.headers.authorization) throw new Error('Unauthorized')
		const token = req.headers.authorization.split(' ')[1]
		if (!token) return res.status(401)

		const tokenDecode = jwt.verify(token, process.env.JWTS!)

		req.body.user = tokenDecode as User

		next()
	} catch (e) {
		const err = e as Error
		res.status(401).json({ message: err.message })
		console.log(err.message)
	}
}

export default router
