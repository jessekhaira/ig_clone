const mongoose = require('mongoose');
const user_seed = require('./seeds/userSeed'); 
const User = require('../models/users').userModel; 
// const photos = require('../models/photos').photosModel; 

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


async function seedDatabaseUsingModel() {
    const objects_to_add = [user_seed];
    const models = [User]; 
    for (let i=0; i<objects_to_add.length; i++) {
        const list_objects_add = objects_to_add[i];
        const Model = models[i];
        Model.create(list_objects_add); 
    }
}

async function deleteCollectionsFromDatabase() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const objDrop of collections) {
        console.log(objDrop);
        await mongoose.connection.collections[objDrop].drop(); 
    }
    console.log(await User.find({}));
}


module.exports = {
    setupLocalDatabase(localDatabaseName) {
        beforeAll(async () => {
            await setupDatabaseConnection(localDatabaseName); 
            await seedDatabaseUsingModel(); 
        });

        afterAll(() => {
            await deleteCollectionsFromDatabase(); 
            mongoose.connection.close();
        });          
    }
}