const  mongoose = require('mongoose');

function connectToDb() {
    //console.log('Connected to MongoDB');
    //console.log('mongo uri', process.env.MONGO_URI);
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
}

module.exports = connectToDb;