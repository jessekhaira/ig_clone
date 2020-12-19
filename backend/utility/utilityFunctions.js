
function convert2Base64MongooseDocs(documents) {
    let return_arr = []; 
    for (let doc of documents) {
        doc = doc.toObject(); 
        doc.profile_picture = doc.profile_picture.toString('base64'); 
        return_arr.push(doc); 
    }
    return return_arr; 
}

exports.convert2Base64MongooseDocs = convert2Base64MongooseDocs; 