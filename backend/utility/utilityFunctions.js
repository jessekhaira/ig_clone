
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

exports.convertArrayPicBuffers2Base64 = convertArrayPicBuffers2Base64; 
exports.convertBuffer2Base64 = convertBuffer2Base64; 