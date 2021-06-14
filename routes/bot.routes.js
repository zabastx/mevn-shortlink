require('dotenv').config()
const fetch = require('node-fetch')
const router = require('express').Router()

router.post('/feedback', async (req, res) => {
    try {
        const {name, email, message} = req.body
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

        res.status(200).json({message: 'Сообщение отправлено'})
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ message: 'Request error' })
    }
})

router.post(`/${process.env.BOT_API}`, async (req, res) => {
    try {
        console.log(req)
    } catch (e) {
        console.log(e)
    }
})

module.exports = router