// require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database Successfully'))

app.get('/',(req,res)=>{
     res.send({message:`Welcome to Encryptocars Backend - created, managed and owned by Diego`})
 })
app.use(express.json())
app.use(cors())

const usersRouter = require('./app/routes/user.routes')
app.use('/users', usersRouter)

const postsRouter = require('./app/routes/posts.routes.js')
app.use('/posts', postsRouter)

app.listen(process.env.PORT || 8999, () => console.log('Server Started'))
