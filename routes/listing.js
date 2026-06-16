const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router();
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')

const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

// New Route
router.get("/new",isLoggedIn , listingController.renderNewForm)

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn ,validateListing,upload.single('listing[image]'), wrapAsync(listingController.createListing))


router.route("/:id")
.get(validateListing, wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner ,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner , wrapAsync(listingController.destroyListing))


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner , wrapAsync(listingController.renderEditForm))


module.exports = router;