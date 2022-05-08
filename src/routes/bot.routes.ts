import { Router, Request } from 'express'
import fetch from 'node-fetch'

const router = Router()

interface BotRequest extends Request {
	body: {
		name: string
		email: string
		message: string
	}
}

router.post('/feedback', async (req: BotRequest, res) => {
	try {
		const { name, email, message } = req.body

		const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_API}/sendMessage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: process.env.MYTGID,
				text: `Feedback from ${name} \nemail: ${email} \n${message}`
			})
		})
		const data = await response.json()

		res.status(200).json({ message: 'Сообщение отправлено' })
	} catch (e) {
		console.log((e as Error).message)
		res.status(400).json({ message: 'Ошибка при отправке сообщения' })
	}
})

export default router
