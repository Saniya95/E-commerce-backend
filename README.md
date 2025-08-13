# E-Commerce Backend with Cloudinary Integration

This is the backend server for the E-Commerce application, now with Cloudinary integration for image storage.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3001
NODE_ENV=development
```

3. Get your Cloudinary credentials:
   - Sign up at [Cloudinary](https://cloudinary.com)
   - Navigate to your dashboard to find your cloud name, API key, and API secret
   - Add these credentials to your `.env` file

## Migrating Existing Images

If you have existing images stored locally in the `public/uploads` directory, you can migrate them to Cloudinary using the provided script:

```bash
node scripts/migrateToCloudinary.js
```

This script will:

1. Upload all local images to Cloudinary
2. Update database records with new Cloudinary URLs
3. Maintain the existing image associations with products

## Seeding Categories with Images

To populate your database with sample categories and images, you can use the provided seed script:

```bash
node scripts/seedCategories.js
```

This script will:

1. Create default categories (Electronics, Men's Fashion, Women's Fashion, etc.)
2. Upload category images to Cloudinary
3. Store the image URLs in the category documents

You can add sample images to the `sample-images` directory with filenames matching the category names (e.g., `electronics.jpg`, `men's-fashion.jpg`) for custom category images.

## Running the Server

Start the server:

```bash
npm start
```

## Features

- RESTful API for e-commerce operations
- MongoDB database integration
- Cloudinary image storage
- JWT authentication
- Product and category management

## API Endpoints

- `GET /products` - Get all products
- `GET /products/category/:slug` - Get products by category
- `POST /products/add-product` - Add a new product with image upload to Cloudinary
- `GET /categories` - Get all categories
- `POST /categories` - Create a new category with image upload to Cloudinary (admin only)
- `PUT /categories/:id` - Update a category with optional image upload (admin only)
