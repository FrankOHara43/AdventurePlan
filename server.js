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

if (!process.env.DATABASE_PASSWORD) {
  console.error('DATABASE_PASSWORD environment variable is missing');
  process.exit(1);
}

// Replace password in DB connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

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