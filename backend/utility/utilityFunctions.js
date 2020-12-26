const path = require('path'); 
require('dotenv').config({path: path.resolve(".env")}); 
const jwt = require('jsonwebtoken'); 

function convertArrayPicBuffers2Base64(documents, property) {
    let return_arr = []; 
    for (let doc of documents) {
        console.log(doc);
        doc = convertBuffer2Base64(doc, property);
        return_arr.push(doc); 
    }
    return return_arr; 
}

function convertBuffer2Base64(doc, property) {
    doc = doc.toObject(); 
    doc[property] = doc[property].toString('base64'); 
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