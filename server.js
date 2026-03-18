const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config.env' });
}

const app = require('./app');

// Check required environment variables
if (!process.env.DATABASE) {
  console.error('DATABASE environment variable is missing');
  process.exit(1);
}

const databasePassword = process.env.DATABASE_PASSWORD || process.env.PASSWORD;

if (!databasePassword) {
  console.error('DATABASE_PASSWORD or PASSWORD environment variable is missing');
  process.exit(1);
}

// Build DB connection string using DATABASE_PASSWORD
const encodedPassword = encodeURIComponent(databasePassword);
let DB = process.env.DATABASE;

if (DB.includes('<PASSWORD>')) {
  DB = DB.replace('<PASSWORD>', encodedPassword);
} else {
  DB = DB.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]*)(@.*)/, `$1${encodedPassword}$3`);
}

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!!');
    console.log('CONNECTED TO DB →', mongoose.connection.name);

    // Start server only after DB connects
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('DB CONNECTION ERROR:', err.message);
    process.exit(1);
  });

// Handle unexpected errors
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.name, err.message);
  process.exit(1);
});