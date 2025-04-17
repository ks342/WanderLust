
// const Listing = require("../models/listing");
// const Review = require("../models/review");

// module.exports.createReview = async (req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     req.flash("success","New review Created!");
//      res.redirect(`/listings/${listing._id}`);

// };


// module.exports.destroyReview = async(req,res)=>{
//     let {id,reviewId} =req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success","Review deleted!");
//     res.redirect(`/listings/${id}`);
// };


const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!req.body.review || !req.body.review.comment || !req.body.review.rating) {
        req.flash("error", "Invalid review data.");
        return res.redirect(`/listings/${req.params.id}`);
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    await newReview.save();

    // ✅ Use $push to avoid revalidating the full listing (which includes required fields like geometry)
    await Listing.updateOne(
        { _id: req.params.id },
        { $push: { reviews: newReview._id } }
    );

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};
