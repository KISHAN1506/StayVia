const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/stayvia";

main().then(() => {
    console.log("connected");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({}); // for removing any pre exisiting data
    initData.data = initData.data.map((obj) =>({...obj,owner:"6a2da826e4c2d7b77d939485"}))
    await Listing.insertMany(initData.data); // as initData is an object we just have to pass data value from that object
    console.log("Data was Initialized");
    
}

initDB();