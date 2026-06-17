# StayVia

Deployed at: https://stayvia-kishanagarwal.onrender.com/

StayVia is a full-stack property listing platform built with Node.js, Express, MongoDB, and EJS. It lets users browse listings, view detailed property pages with reviews and a map, create their own listings, upload images to Cloudinary, and manage reviews with authentication and ownership checks.

## Features

- Browse all available property listings on the homepage.
- View a dedicated listing page with title, description, price, host, reviews, and map location.
- Create new listings with image upload support.
- Edit and delete listings when you own them.
- Register, log in, and log out with Passport-based local authentication.
- Leave reviews on listings after logging in.
- Delete only your own reviews.
- Flash messages for success and error feedback.
- Form validation on both the client and server.
- Cloudinary image storage.
- MongoDB session storage.
- Leaflet + OpenStreetMap map display for listing locations.

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: Passport, passport-local, passport-local-mongoose
- Sessions: express-session, connect-mongo, connect-flash
- Views: EJS, ejs-mate
- File Uploads: Multer, multer-storage-cloudinary, Cloudinary
- Validation: Joi
- UI: Bootstrap 5, Font Awesome, custom CSS
- Maps: Leaflet, OpenStreetMap

## Project Structure

```text
app.js                Express app entry point and server startup
cloudConfig.js        Cloudinary configuration and multer storage setup
middleware.js         Auth, authorization, and validation middleware
schema.js             Joi validation schemas
controllers/          Route handlers for listings, reviews, and users
models/               Mongoose models for listings, reviews, and users
routes/               Express routers for listings, reviews, and auth
init/                 Sample data seeding script
public/               Static assets, custom JS, and CSS
views/                EJS templates and shared layout partials
utils/                Shared helpers such as ExpressError and wrapAsync
```

## Prerequisites

- Node.js 25.x or compatible
- npm
- MongoDB Atlas account or another MongoDB deployment
- Cloudinary account for image uploads

## Environment Variables

Create a `.env` file in the project root and define these values:

```bash
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

`ATLASDB_URL` is used by the main app in `app.js` for the live database connection. The seeding script in `init/index.js` currently connects to a local MongoDB instance at `mongodb://127.0.0.1:27017/stayvia`.

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Add the `.env` file described above.
4. Make sure your MongoDB database is reachable.
5. Make sure your Cloudinary credentials are valid.

## Running the App

Start the server with:

```bash
node app.js
```

The app listens on port `8080`.

After the server starts, open:

```text
http://localhost:8080
```

## Seeding Sample Data

The `init/index.js` script clears the `Listing` collection and inserts sample listings.

Before running it, make sure the hard-coded owner id in `init/index.js` matches an existing user in your database. If it does not, the seeded listings may point to a missing owner reference.

Run the seed script with:

```bash
node init/index.js
```

## Usage

### Visitors

- Browse listings from the homepage or `/listings`.
- Open a listing to inspect its details, reviews, and map location.
- Sign up or log in from the navigation bar.

### Logged-In Users

- Create a new listing from `/listings/new`.
- Edit or delete listings that you own.
- Leave reviews on listing detail pages.
- Delete reviews that you authored.

### Authentication Flow

- Unauthorized actions redirect to the login page.
- After a successful login, users are redirected back to the page they originally requested when applicable.

## Data Model Summary

### Listing

- `title` - required string
- `description` - string
- `image.url` and `image.filename` - Cloudinary image metadata
- `price` - number
- `location` - string
- `country` - string
- `reviews` - array of `Review` references
- `owner` - `User` reference
- `geometry` - GeoJSON point used for the map

### Review

- `comment` - string
- `rating` - number from 1 to 5
- `createdAt` - timestamp
- `author` - `User` reference

### User

- `email` - required string
- Authentication credentials are handled by `passport-local-mongoose`.

## Key Behavior

- Listing creation and updates support image uploads.
- When geocoding a listing location fails, the app falls back to default coordinates for New Delhi.
- Listing detail pages show a Leaflet map centered on the stored geometry.
- Joi validation protects listing and review forms on the server.
- Flash messages communicate success and failure states throughout the app.

## Available Routes

- `GET /` - Redirects to `/listings`
- `GET /listings` - List all listings
- `GET /listings/new` - Render new listing form
- `POST /listings` - Create a listing
- `GET /listings/:id` - Show listing details
- `GET /listings/:id/edit` - Render edit form
- `PUT /listings/:id` - Update a listing
- `DELETE /listings/:id` - Delete a listing
- `POST /listings/:id/reviews` - Create a review
- `DELETE /listings/:id/reviews/:reviewId` - Delete a review
- `GET /signup` - Render signup form
- `POST /signup` - Register a new user
- `GET /login` - Render login form
- `POST /login` - Log in a user
- `GET /logout` - Log out the current user

## Notes

- The project currently does not define an `npm start` script, so `node app.js` is the direct startup command.
- Some links in the footer point to `/privacy` and `/terms`, but those routes are not implemented in the current codebase.
- The app expects Cloudinary credentials and a valid MongoDB connection before it can run correctly.

## Troubleshooting

- If the server fails to start, confirm `ATLASDB_URL` is set and reachable.
- If image uploads fail, verify your Cloudinary environment variables.
- If login sessions are not persisting, confirm `SECRET` is defined and Mongo session storage is available.
- If seed data inserts but hosts do not appear correctly, update the owner id inside `init/index.js`.

## License

This project is currently licensed under ISC as defined in `package.json`.