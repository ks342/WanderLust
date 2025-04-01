const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title:{
      type: String,
      required:true,
    },
    description:String,
    image:{
     type:String,
     default:"https://unsplnoash.com/photos/a-person-swimming-in-the-ocean-with-a-camera-NhWxAIs61MM" ,
     set: (v) => v === ""
     ? "https://unsplash.com/photos/a-person-swimming-in-the-ocean-with-a-camera-NhWxAIs61MM" 
     : v,
// here set is used to set default value based on some conditions to any field value in model
    },
    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;



// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const ListingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     type: String, // This will store the URL as a string
//     default: "https://unsplash.com/photos/a-person-swimming-in-the-ocean-with-a-camera-NhWxAIs61MM", // Default image URL
//     set: (v) => v === "" 
//       ? "https://unsplash.com/photos/a-person-swimming-in-the-ocean-with-a-camera-NhWxAIs61MM" // If no value provided, use the default URL
//       : v, 
//   },
//   price: Number,
//   location: String,
//   country: String,
// });

// const Listing = mongoose.model("Listing", ListingSchema);
// module.exports = Listing;


