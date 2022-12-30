const app = require('./app');
const connectDatabase = require('./config/database');
let environment = 'production';
// Config
if (environment === 'production') {
  require('dotenv').config({path : '.env'});
} else {
  require('dotenv').config({path : 'config/config.env'});
}
// require('dotenv').config({ path: 'config/config.env' });
console.log(environment);

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => { process.exit(1); });
});
