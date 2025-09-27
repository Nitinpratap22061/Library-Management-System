// seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Book = require("./models/Book");
const User = require("./models/User");

// ✅ Direct MongoDB connection string (no .env)
mongoose
  .connect(
    "mongodb+srv://nitin_profile:u0fsQiDwbpN5jcN1@cluster0.cubeffp.mongodb.net/nitin_profile?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB connected for seeding"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Sample data
const books = [
  { title: "To Kill a Mockingbird", author: "Harper Lee", description: "A classic novel about racial injustice in the American South", quantity: 5 },
  { title: "1984", author: "George Orwell", description: "A dystopian social science fiction novel", quantity: 3 },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", description: "A novel about the Jazz Age in America", quantity: 2 },
  { title: "Pride and Prejudice", author: "Jane Austen", description: "A romantic novel of manners", quantity: 4 },
  { title: "The Hobbit", author: "J.R.R. Tolkien", description: "A fantasy novel and children's book", quantity: 3 },
];

// ✅ Users
const users = [
  {
    name: "Admin User",
    email: "pratap@gmail.com",                    // <= admin email
    password: bcrypt.hashSync("1234567", 10),     // <= admin password
    role: "admin",
  },
  {
    name: "Student User",
    email: "student@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "student",
  },
];

// Seed function
const seedData = async () => {
  try {
    // ⚠️ Clear existing data (don't run in production)
    await Book.deleteMany();
    await User.deleteMany();

    // Insert new data
    const createdBooks = await Book.insertMany(books);
    const createdUsers = await User.insertMany(users);

    console.log(`${createdBooks.length} books created`);
    console.log(`${createdUsers.length} users created`);

    console.log("\n✅ Sample User Credentials:");
    console.log(`Admin: ${users[0].email} / 1234567`);
    console.log(`Student: ${users[1].email} / password123`);

    console.log("\nInserted user emails:", createdUsers.map((u) => u.email).join(", "));

    await mongoose.disconnect();
    console.log("🌱 Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
