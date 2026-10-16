require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB\n');

  const products = await Product.find();
  console.log(`Found ${products.length} products\n`);

  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    if (!p.image) {
      skipped++;
      continue;
    }

    // Skip if already migrated
    if (p.image.startsWith('choplife/')) {
      skipped++;
      continue;
    }

    // "/images/bbqBlaze.jpg" → "bbqBlaze.jpg"
    const filename = p.image.replace(/^\/?images\//, '');

    // "bbqBlaze.jpg" → "bbqBlaze"
    const withoutExt = filename.replace(/\.[^.]+$/, '');

    // → "choplife/bbqBlaze"
    const publicId = `choplife/${withoutExt}`;

    console.log(`  ${p.name}`);
    console.log(`    ${p.image}  →  ${publicId}`);

    p.image = publicId;
    await p.save();
    updated++;
  }

  console.log(`\n✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`\nDone.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});