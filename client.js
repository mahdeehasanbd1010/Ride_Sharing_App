const schedule = require('node-schedule');
const http = require('http');
const io = require ('socket.io-client');

const socket = io.connect('http://localhost:5001/communication');

function createDriver() {
    let driver = JSON.stringify({
        name: 'Driver_'+parseInt(Math.random()*100).toString(),
        car_number: 'C_'+parseInt(Math.random()*100).toString(),
        x_coordinates: Math.random()*100,
        y_coordinates: Math.random()*100,
        status: false
    });
    return driver;
}

function createRider() {
    let rider = JSON.stringify({
        name: 'Rider_'+parseInt(Math.random()*100).toString(),
        x_coordinates: Math.random()*100,
        y_coordinates: Math.random()*100,
        x_destination: Math.random()*100,
        y_destination: Math.random()*100,
        status: false 
    });

    return rider;
}

function createRating(name){
    let rating = JSON.stringify({
        name: name,
        rating: parseInt(Math.random()*5)
    });
    return rating;
}

function createOptionsDriver(driver) {
    let optionsDriver = {
        hostname: 'localhost',
        port: 5000,
        path: '/driver/add',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': driver.length
        }   
    };

    return optionsDriver;
}

function createOptionsRider(rider) {
    let optionsRider = {
        hostname: 'localhost',
        port: 5000,
        path: '/rider/add',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': rider.length
        }   
    };
    
    return optionsRider;
}

function createOptionsRating(rating) {
    let optionsRating = {
        hostname: 'localhost',
        port: 5000,
        path: '/rating/add',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': rating.length
        }
    };
    
    return optionsRating;
}


const jobDriver = schedule.scheduleJob('*/1 * * * * *', async()=>{
    const driver = createDriver();
    const optionsDriver = createOptionsDriver(driver);
    http.request(optionsDriver).write(driver);
});


const jobRider = schedule.scheduleJob('*/1 * * * * *', async()=>{
    const rider = createRider();
    const optionsRider = createOptionsRider(rider);
    http.request(optionsRider).write(rider);
});


socket.on('msg1', (data)=>{
    console.log(data[0] + ' --> ' + data[1] + ' || ride fare = ' + data[2] + '\n');
    
    const rating = createRating(data[0]);
    const optionsRating = createOptionsRating(rating);
    http.request(optionsRating).write(rating);

});

