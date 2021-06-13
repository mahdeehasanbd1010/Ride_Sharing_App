const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const url = 'mongodb://mongodb:27017/MyDB'

app.use(cors())
app.use(express.json())

app.use('/api/rating', require('./routes/api/rating'))

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
const connection = mongoose.connection
connection.on('open', ()=>{console.log('mongodb connected...')})

const PORT = process.env.PORT || 7000

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))



