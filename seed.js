// Seed database with test data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./models/tourModel');
const User = require('./models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.error('DB CONNECTION ERROR', err);
  });

// Read data from JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8'));

// Function to import data
async function importData() {
  try {
    // Clear existing data
    await Tour.deleteMany({});
    await User.deleteMany({});
    
    console.log('Deleted existing data');

    // Import tours
    const createdTours = await Tour.create(tours);
    console.log(`${createdTours.length} tours created`);

    // Create demo users
    const demoUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      }
    ];

    const createdUsers = await User.create(demoUsers);
    console.log(`${createdUsers.length} users created`);

    console.log('Data imported successfully!');
  } catch (error) {
    console.error('ERROR importing data:', error);
  }

  process.exit();
}

// Function to delete data
async function deleteData() {
  try {
    await Tour.deleteMany({});
    await User.deleteMany({});
    console.log('Data deleted successfully');
  } catch (error) {
    console.error('ERROR deleting data:', error);
  }

  process.exit();
}

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
