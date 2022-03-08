require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database Successfully'))

app.get('/',(req,res)=>{
     res.send({message:"Welcome to Diego's application"})
 })
app.use(express.json())
app.use(cors())

const usersRouter = require('./app/routes/user.routes.js')
app.use('/users', usersRouter)
const productsRouter = require('./app/routes/products.routes.js')
app.use('/products', productsRouter)

app.listen(process.env.PORT || 8999, () => console.log('Server Started'))
