const mongoose = require('mongoose');
const initialisedata = require('./data.js');
const Listing = require('../models/listing.js');

main()
  .then(() => {
    console.log("connected successfully!!");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/heaven');
}

const initDB = async () => { 
  await Listing.deleteMany({});   // delete old data

  // add owner field to each listing
  initialisedata.data = initialisedata.data.map((obj) => ({
    ...obj,
    owner: "65f0b8a1c4d2e5f3a4b5c6d7" // user ObjectId
  }));

  await Listing.insertMany(initialisedata.data);

  console.log("data was initialised");
};

initDB();
