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
     res.send({message:`
     
     
        Welcome to EncryptoGram Backend

        {
            "name": "encryptogram-backend",
            "version": "1.0.0",
            "description": "Backend of my online social media platform EncryptoGram",
            "main": "server.js",
            "scripts": {
              "test": "echo \"Error: no test specified\" && exit 1"
            },
            "repository": {
              "type": "git",
              "url": "git+https://github.com/diegoallies/encryptoGramBackend.git"
            },
            "keywords": [
              "node.js",
              "|",
              "express",
              "|",
              "mongoose",
              "|",
              "bcrypt",
              "|",
              "jsonwebtoken",
              "|",
              "cors"
            ],
            "author": "Diego Jay Allies",
            "license": "ISC",
            "bugs": {
              "url": "https://github.com/diegoallies/encryptoGramBackend/issues"
            },
            "homepage": "https://github.com/diegoallies/encryptoGramBackend#readme",
            "dependencies": {
              "bcrypt": "^5.0.1",
              "cors": "^2.8.5",
              "dotenv": "^16.0.0",
              "express": "^4.17.3",
              "jsonwebtoken": "^8.5.1",
              "mongoose": "^6.2.4",
              "nodemon": "^2.0.15"
            }
          }
          
     
     `})
 })
app.use(express.json())
app.use(cors())

const usersRouter = require('./app/routes/user.routes')
app.use('/users', usersRouter)

const postsRouter = require('./app/routes/posts.routes.js')
app.use('/posts', postsRouter)

app.listen(process.env.PORT || 8999, () => console.log('Server Started'))
