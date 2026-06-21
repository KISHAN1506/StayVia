const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const search = req.query.search ? req.query.search.trim().toLowerCase() : "";
  const allListings = await Listing.find({});

  const filteredListings = search
    ? allListings.filter((listing) => {
        return [listing.title, listing.location, listing.country].some((field) => {
          return field && field.toLowerCase().includes(search);
        });
      })
    : allListings;

  res.render("listings/index.ejs", { allListings: filteredListings, search });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  try {
    const query = encodeURIComponent(req.body.listing.location);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "StayviaApp/1.0"
        }
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
      };
    } else {
      newListing.geometry = {
        type: "Point",
        coordinates: [77.209, 28.6139] // Default coordinates (New Delhi)
      };
    }
  } catch (err) {
    console.error("Geocoding error:", err);
    newListing.geometry = {
      type: "Point",
      coordinates: [77.209, 28.6139] // Default coordinates
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created successfully!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let id = req.params.id;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted successfully!");
  res.redirect("/listings");
};
