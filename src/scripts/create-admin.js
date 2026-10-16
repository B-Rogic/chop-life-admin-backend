require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const readline = require("readline");
const Admin = require("../models/Admin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((r) => rl.question(q, r));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const email = (await ask("Admin email: ")).toLowerCase().trim();
  const password = await ask("Admin password: ");

  if (!email || !password) {
    console.log("Email and password are required.");
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("An admin with that email already exists.");
    await mongoose.disconnect();
    rl.close();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, passwordHash });

  console.log("✅ Admin created");
  await mongoose.disconnect();
  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});  