// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Book = require('./models/Book');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Sample data
const books = [
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', description: 'A classic novel about racial injustice in the American South', quantity: 5 },
  { title: '1984', author: 'George Orwell', description: 'A dystopian social science fiction novel', quantity: 3 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A novel about the Jazz Age in America', quantity: 2 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', description: 'A romantic novel of manners', quantity: 4 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', description: "A fantasy novel and children's book", quantity: 3 }
];

// NOTE: keep plain-text passwords here only for seeding/testing. Change in production.
const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',            // <= use this to login: admin@gmail.com
    password: bcrypt.hashSync('123456', 10), // <= password is: 123456
    role: 'admin'
  },
  {
    name: 'Student User',
    email: 'student@example.com',        // <= use this to login: student@example.com
    password: bcrypt.hashSync('password123', 10), // <= password is: password123
    role: 'student'
  }
];

// Seed function
const seedData = async () => {
  try {
    // Clear existing data (CAUTION: don't run on production DB)
    await Book.deleteMany();
    await User.deleteMany();

    // Insert new data
    const createdBooks = await Book.insertMany(books);
    const createdUsers = await User.insertMany(users);

    console.log(`${createdBooks.length} books created`);
    console.log(`${createdUsers.length} users created`);
    
    console.log('\nSample User Credentials:');
    console.log(`Admin: ${users[0].email} / 123456`);
    console.log(`Student: ${users[1].email} / password123`);
    
    // print inserted emails for verification
    console.log('\nInserted user emails:', createdUsers.map(u => u.email).join(', '));
    
    await mongoose.disconnect();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
