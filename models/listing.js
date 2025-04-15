const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const ListingSchema = new Schema({
    title:{
      type: String,
      required:true,
    },
    description:String,

// // here set is used to set default value based on some conditions to any field value in model
image: {
       url:String,
       filename:String,
},

    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }});

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


