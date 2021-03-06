const user_holder = [];
const photo_holder = []; 
const fs = require('fs'); 

for (let i=0; i<20; i++) {
    const curr_user_obj = {};
    const email = `testUser${i}@gmail.com`;
    const username = `testUser${i}`;
    const full_name = `testUser`;
    const password = `123456`;
    const date_of_birth = Date.now(); 
    curr_user_obj.email = email;
    curr_user_obj.username = username;
    curr_user_obj.full_name = full_name;
    curr_user_obj.password = password;
    curr_user_obj.date_of_birth = date_of_birth; 
    user_holder.push(curr_user_obj); 
}

for (let i=0; i<10; i++) {
    const curr_photo_obj = {};
    const dummy_post = fs.readFileSync(__dirname + '/../routes/generic_profile_pic.jpg'); 
    curr_photo_obj.data_photo = dummy_post;
    photo_holder.push(curr_photo_obj);
}


module.exports = {
    user_holder, 
    photo_holder
}