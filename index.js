const express = require('express');
const app = express();
const tempApp = express();
const mongoose = require('mongoose');
const cors = require('cors');
const server = require('http').createServer(tempApp);
const schedule = require('node-schedule');
const url = 'mongodb://localhost/MyDB';
const Drivers = require('./data_set/Drivers');
const Riders = require('./data_set/Riders');

const io = require('socket.io')(server);

app.use(cors());
app.use(express.json());

app.use('/driver', require('./routes/driver'));
app.use('/rider', require('./routes/rider'));
app.use('/rating', require('./routes/rating'));

let drivers = [];
let riders = [];
async function getDriverRider(){
    try{
        drivers = await Drivers.splice(0, Drivers.length);
        riders = await Riders.splice(0, Riders.length);
    }catch(err){
        console.log(err);
    }
}

async function filterDriverRider(){
    drivers = drivers.filter((driver)=> driver.name === false);
    riders = riders.filter((rider)=> rider.status === false);
}

async function calculateFare(selectRider){
    
    const fare = Math.sqrt((selectRider.x_coordinates - selectRider.x_destination)*
    (selectRider.x_coordinates - selectRider.x_destination)+
    (selectRider.y_coordinates - selectRider.y_destination)*
    (selectRider.y_coordinates - selectRider.y_destination))*2;

    return fare;
}

io.of('communication').on('connection', (socket) => {
    console.log('Enter the schedule function');
    const job = schedule.scheduleJob('*/5 * * * * *', async function(){
        console.log('scheduler!!!');
        
        await getDriverRider();
	
        console.log('number of drivers: ' + drivers.length);
        console.log('number of riders: ' + riders.length);

        for (const d of drivers) {
            let minimumDist = 1000000000;
            let array = [];
            let selectRider = null;
            for(const r of riders){
                let dist = Math.sqrt((r.x_coordinates - d.x_coordinates)*(r.x_coordinates - d.x_coordinates)+
                (r.y_coordinates - d.y_coordinates)*(r.y_coordinates - d.y_coordinates));
                
                if(dist < minimumDist){
                    minimumDist = dist;
                    selectRider = r;
                }

            }
            d.status = true;
            
            if(selectRider == null){
                selectRider.status = true;
            }

            array.push(d.name);
            array.push(selectRider.name);
            const fare = await calculateFare(selectRider);
            array.push(fare);
            
            socket.emit('msg1', array);
            await filterDriverRider();
            
        }
    });
});


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true});
const connection = mongoose.connection;
connection.on('open', () => console.log('mongodb connected...'));

const PORT1 = process.env.PORT || 5000;
const PORT2 = process.env.PORT || 5001;

app.listen(PORT1, ()=>console.log(`Server started on port ${PORT1}`));
server.listen(PORT2, ()=>console.log(`Server started on port ${PORT2}`));






