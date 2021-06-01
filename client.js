const express = require('express')
const app = express()
const io = require('socket.io-client')
const schedule = require('node-schedule')
const http = require('http')

const socket = io.connect('http://localhost:7001/communication')


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
        driver_name: name,
        rating: parseInt(Math.random()*5)
    });
    return rating;
}


function createOptionsDriver(driver) {
    let optionsDriver = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/driver/add',
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
        port: 8080,
        path: '/api/rider/add',
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
        port: 8080,
        path: '/api/rating/add',
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


socket.on('msg', (data)=>{
    const rating = createRating(data)
    const optionsRating = createOptionsRating(rating)
    console.log('driver_name: '+data)

    http.request(optionsRating).write(rating)
})


