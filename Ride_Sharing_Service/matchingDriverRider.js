const schedule = require('node-schedule')
const Drivers = require('./data_set/Drivers')
const Riders = require('./data_set/Riders')
const http = require('http')

let location = process.env.LOCATION

let drivers = []
let riders = []

async function getDriverRider(){
    try{
        drivers = await Drivers.splice(0, Drivers.length)
        riders = await Riders.splice(0, Riders.length)
    }catch(err){
        console.log(err)
    }
}

async function filterDriverRider(){
    drivers = drivers.filter((driver)=> driver.status === false)
    riders = riders.filter((rider)=> rider.status === false)
}

async function calculateFare(selectRider){
    
    const fare = Math.sqrt((selectRider.x_coordinates - selectRider.x_destination)*
    (selectRider.x_coordinates - selectRider.x_destination)+
    (selectRider.y_coordinates - selectRider.y_destination)*
    (selectRider.y_coordinates - selectRider.y_destination))*2

    return fare
}


async function createRating(driverName, riderName, fare){
    let rating = JSON.stringify({
        driver_name: driverName,
        rider_name: riderName,
        fare: fare,
        status: false
    })

    return rating;

}

async function createOptionsRating(rating) {
    let optionsRating = {
        hostname: `communication-service-${location}`,
        port: 7000,
        path: '/rating/add',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': rating.length
        }
    };
    
    return optionsRating;
}


const job = schedule.scheduleJob('*/5 * * * * *', async function(){
    console.log(`scheduler ${location}!!!`)
    await getDriverRider()

    console.log('number of drivers: ' + drivers.length)
    console.log('number of riders: ' + riders.length)
    console.log('\n')
    
    for (const d of drivers) {
        let minimumDist = 1000000000
        let array = []
        let selectRider = null
        for(const r of riders){
            let dist = Math.sqrt((r.x_coordinates - d.x_coordinates)*(r.x_coordinates - d.x_coordinates)+
            (r.y_coordinates - d.y_coordinates)*(r.y_coordinates - d.y_coordinates))
            
            if(dist < minimumDist){
                minimumDist = dist
                selectRider = r
            }

        }
        
        if(selectRider !== null){
            d.status = true   
            selectRider.status = true
        }else{continue}

        let fare = await calculateFare(selectRider)
        // console.log('driver_name: ' + d.name)
        // console.log('rider_name: ' + selectRider.name)

        const rating = await createRating(d.name, selectRider.name, fare)
        const optionsRating = await createOptionsRating(rating)
        

        req = http.request(optionsRating, (res)=>{
            //console.log(`statusCode: ${res.statusCode}`)
        }).write(rating)
        
        await filterDriverRider()
        
    }
});

module.exports = {
    job
}




