const mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/inotebook?directConnection=true"


const connectToMongo = () => {

    mongoose.connect(mongoURL, () => {
        console.log("Connected to Mongo Successfully")
    })
}
module.exports = connectToMongo