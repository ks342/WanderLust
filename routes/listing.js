
  const express = require("express");
  const router = express.Router();
  const wrapAsync = require("../utils/wrapAsync.js");
  const ExpressError = require("../utils/ExpressError.js");
  const {listingSchema} = require("../schema.js");
  const Listing = require("../models/listing.js");


  const validateListing=(req,res,next)=>{
      let {error}= listingSchema.validate(req.body);
      
      if(error){
          let errMsg = error.details.map((el)=> el.message).join(",");
          throw new ExpressError(400,error);
      }else{
          next();
      }
  };

  //INDEX ROUTE
  router.get("/",wrapAsync(async (req,res)=>{
        const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
  }));
  
  
  //NEW ROUTE
  router.get("/new",wrapAsync((req,res)=>{
      res.render("listings/new.ejs");
  }));
  
  //SHOW ROUTE
  router.get("/:id",wrapAsync(async(req,res)=>{
      let {id} = req.params;
    const listing =   await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs",{listing});
  }));
  //populate method is used when we want to show data along with it's object id

  // CREATE ROUTE
  router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
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
 router.get("/:id/edit",wrapAsync(async (req,res)=>{
      let {id} = req.params;
    const listing =   await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
  }));
  
  //UPDATE ROUTE
  
  router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
      let {id} = req.params;
     await  Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listings/${id}`);
  }));
  
  
  //DELETE ROUTE
  
  router.delete("/:id",wrapAsync(async(req,res)=>{
      let {id} = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");
  }));

   module.exports = router; 