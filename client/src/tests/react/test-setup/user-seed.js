import {readFileSync} from 'fs';

function createArrayUserObjects() {
    const return_array = [];
    for (let i =0 ; i<5; i++) {
        const object = {};
        object.username = `testing${i}`;
        object.full_name = `testing${i+50}`;
        object._id = `123123123`;
        object.profile_picture = readFileSync(__dirname + '/generic_profile_pic.jpg', {encoding: 'base64'}); 
        return_array.push(object);
    }
    return return_array;
}

export {createArrayUserObjects}; 