const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URL;


async function setupDatabaseConnection(localDatabaseName) {
    const db = await mongoose.connect(`mongodb://127.0.0.1/${localDatabaseName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
          if (err) {
              console.log(err);
          }
          console.log(`connected to mongo database ${localDatabaseName}`); 
      }
    );
}

