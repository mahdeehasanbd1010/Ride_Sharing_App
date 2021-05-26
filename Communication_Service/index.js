const express = require('express')
const tempApp = express()
const app = express()
const schedule = require('node-schedule')
const cors = require('cors')
const server = require('http').createServer(tempApp)
const io = require('socket.io')(server)
const Ratings = require('./data_set/Ratings')

app.use(cors())
app.use(express.json())

app.use('/rating', require('./routes/rating'))

let ratings = []


async function getRating() {
    try{
        ratings = await Ratings.splice(0, Ratings.length)
    }catch(err){
        console.log(err)
    }
}

async function filterRating(){
    ratings =  ratings.filter(rating => rating.status === false)   
}

io.of('communication').on('connection', (socket)=>{
    
    const job = schedule.scheduleJob('*/5 * * * * *', async () => {
        //console.log('socket on...')
        await getRating()
        console.log('number of rating: '+ratings.length)    
        for(const r of ratings){
            console.log(r.driver_name + ' --> ' + r.rider_name + ' fare = ' + r.fare)
            let driverName = r.driver_name
            socket.emit('msg', driverName)
        }
        console.log('\n')
        await filterRating()
        
    })
    
})

const PORT1 = process.env.PORT || 7003

const PORT2 = process.env.PORT || 7004

app.listen(PORT1, () => console.log(`Server started on port ${PORT1}`))

server.listen(PORT2, () => console.log(`Server started on port ${PORT2}`))




