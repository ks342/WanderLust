const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

app.get("/",(req,res)=>{
    res.send("working");
});


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("database conncected")
}
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
main().then(()=>{
    console.log("db working");
 })
 .catch((err)=>{
    console.log(err);
 });


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
//INDEX ROUTE
app.get("/listings",wrapAsync(async (req,res)=>{
      const allListings = await Listing.find({});
      res.render("listings/index.ejs",{allListings});
}));


//NEW ROUTE
app.get("/listings/new",wrapAsync((req,res)=>{
    res.render("listings/new.ejs");
}));

//SHOW ROUTE
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
  const listing =   await Listing.findById(id);
res.render("listings/show.ejs",{listing});
}));

// CREATE ROUTE
app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})); 

//EDIT ROUTE
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
  const listing =   await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE

app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
   await  Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));


//DELETE ROUTE

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


// app.get("/testListing",async (req,res)=>{
// let sampleListing = new Listing({
//     title: "DEEPSEA DIVING",
//     description: "once in a time ",
//     price:20000,
//     location:"Maldives",
//     country:"India",
// });
// await sampleListing.save();
// console.log("sample was saved");
// res.send("successfull testing")
// });



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});
