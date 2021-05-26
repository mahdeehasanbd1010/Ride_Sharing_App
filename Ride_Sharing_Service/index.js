const express = require('express')
const app = express()
const cors = require('cors')
const matchingDriverRider = require('./matchingDriverRider')


app.use(cors())
app.use(express.json())
app.use('/api/driver', require('./routes/api/driver'));
app.use('/api/rider', require('./routes/api/rider'));


const PORT = process.env.PORT || 7001

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))

matchingDriverRider.job

    