// scripts/seed.js

const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Please set MONGODB_URI in your .env.local file");
  process.exit(1);
}

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();

    const dbAccounts = client.db("accounts");
    const dbEvents = client.db("events");
    const dbUsers = client.db("users");

    // Sample data

    const sampleEvents = Array.from({ length: 40 }, (_, i) => ({
        _id: `ObjectId(${i + 1})`,
        title: `Sample Event ${i + 1}`,
      date: new Date(2025, 5, i + 1),
      endDate: new Date(2025, 5, i + 2),
      featured: false,
      location: `Location ${i + 1}`,
      attendees: Array(0),
      topic: ["Tech", "Business", "Health", "Sport"][i % 4],
      description: `This is a sample description for Event ${i + 1}.`,
    }));

    const sampleUsers = [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "user",
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        role: "staff",
      },
      {
        name: "Charlie Lee",
        email: "charlie@example.com",
        role: "staff",
      },
      {
        name: "Daisy Green",
        email: "daisy@example.com",
        role: "user",
      },
      {
        name: "Ethan Stone",
        email: "ethan@example.com",
        role: "user",
      },
      {
        name: "Fiona Black",
        email: "fiona@example.com",
        role: "staff",
      },
    ];

    // Clear old data
    await dbAccounts.collection("accounts").deleteMany({});
    await dbEvents.collection("events").deleteMany({});
    await dbUsers.collection("users").deleteMany({});

    // Insert new data
    await dbAccounts.collection("accounts").insertMany(sampleAccounts);
    await dbEvents.collection("events").insertMany(sampleEvents);
    await dbUsers.collection("users").insertMany(sampleUsers);

    console.log("✅ Database seeded successfully.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();
