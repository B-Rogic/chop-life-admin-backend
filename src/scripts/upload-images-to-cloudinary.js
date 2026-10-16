require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Where the images currently live (adjust if needed)
const imagesDir = path.join(
  __dirname,
  '..',       // → backend/src
  '..',       // → backend
  '..',       // → chop-life_admin-dashboard
  'frontend', // → frontend
  'public',
  'images'
);

async function main() {
  const files = fs.readdirSync(imagesDir).filter((f) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
  );

  console.log(`Found ${files.length} images to upload\n`);

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const publicId = `choplife/${path.parse(file).name}`; // e.g. choplife/bbqBlaze

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });
      console.log(`✅ ${file} → ${result.public_id}`);
    } catch (err) {
      console.error(`❌ ${file}:`, err.message);
    }
  }

  console.log('\nDone.');
}

main();