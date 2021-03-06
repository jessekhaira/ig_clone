const mongoose = require('mongoose');
const user_seed = require('./testDBSeed').user_holder;
const photo_seed = require('./testDBSeed').photo_holder;
const User = require('../models/users').userModel; 
const Photo = require('../models/photos').photosModel; 

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
    for (let userObj of user_seed) {
        let new_user = new User(userObj);
        for (let buffer_data_photo of photo_seed) {
            let new_photo = new Photo({data_photo: buffer_data_photo, photo_posted_by: new_user});
            new_user.photos.push(new_photo);
            await new_user.save(); 
            await new_photo.save(); 
        }
    }
}

async function deleteCollectionsFromDatabase() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const objDrop of collections) {
        try {
            await mongoose.connection.collections[objDrop].drop(); 
        }
        catch(error) {
            if (error.message === "ns not found") return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (error.message.includes("a background operation is currently running"))
                return;
            console.log(error.message);
        }
    }
}


module.exports = {
    setupLocalDatabase(localDatabaseName) {
        beforeAll(async (done) => {
            await setupDatabaseConnection(localDatabaseName); 
            await seedDatabaseUsingModel(); 
            done();
        });

        afterAll(async (done) => {
            await deleteCollectionsFromDatabase(); 
            await mongoose.connection.close();
            done();
        });          
    }
}