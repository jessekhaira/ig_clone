const path = require('path'); 
require('dotenv').config({path: path.resolve(".env")}); 
const jwt = require('jsonwebtoken'); 

function convertArrayPicBuffers2Base64(documents) {
    let return_arr = []; 
    for (let doc of documents) {
        doc = convertBuffer2Base64(doc);
        return_arr.push(doc); 
    }
    return return_arr; 
}

function convertBuffer2Base64(doc) {
    doc = doc.toObject(); 
    doc.profile_picture = doc.profile_picture.toString('base64'); 
    return doc; 
}

function create_access_refresh_tokens(username) {
    const accessToken = jwt.sign({username: username}, process.env.ACESS_TOKEN_SECRET, {expiresIn: '20m'});
    const refreshToken = jwt.sign({username: username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '3d'});
    return [accessToken, refreshToken];
}

exports.convertArrayPicBuffers2Base64 = convertArrayPicBuffers2Base64; 
exports.convertBuffer2Base64 = convertBuffer2Base64; 
exports.create_access_refresh_tokens = create_access_refresh_tokens; 