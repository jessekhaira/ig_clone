const mongoose = require('mongoose');
const user_seed = require('./seeds/userSeed'); 
const User = require('../models/users').userModel; 

async function setupDatabaseConnection(localDatabaseName) {
    await mongoose.connect(`mongodb://127.0.0.1/${localDatabaseName}`, {
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

async function seedDatabaseUsingModel(objects_to_add, Model) {
    for (const object of objects_to_add) {
        const objectInModel = new Model(object);
        await objectInModel.save(); 
    }

    console.log(await Model.find({})); 
}

async function deleteCollectionsFromDatabase() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const objDrop of collections) {
        await mongoose.connection.collections[objDrop].drop(); 
    }
}


module.exports = {
    setupLocalDatabase(localDatabaseName) {
        beforeAll(async () => {
            await setupDatabaseConnection(localDatabaseName); 
        }); 
    }
}