const mongoose = require('mongoose');

const connectDatabase = () => {
  console.log(process.env.MONGO_URL);
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGO_URL).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
  });
};

module.exports = connectDatabase;
