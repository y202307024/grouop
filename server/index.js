const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { AccessToken } = require('livekit-server-sdk')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/livekit-token', async (req, res) => {
  try {
    const { roomName, userName } = req.body
    console.log('토큰 발급 요청:', roomName, userName)

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: userName }
    )
    token.addGrant({ roomJoin: true, room: roomName })

    const jwt = await token.toJwt()
    console.log('토큰 발급 성공!')
    res.json({ token: jwt })
  } catch (err) {
    console.error('토큰 발급 실패:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => {
  console.log('서버 실행중: http://localhost:3001')
})