const path = require('path'); 
require('dotenv').config({path: path.resolve(".env")}); 
const jwt = require('jsonwebtoken'); 

const monthMapping = {
    1: 'JANUARY',
    2: 'FEBRUARY',
    3: 'MARCH',
    4: 'APRIL',
    5: 'MAY',
    6: 'JUNE',
    7: 'JULY',
    8: 'AUGUST',
    9: 'SEPTEMBER',
    10: 'OCTOBER',
    11: 'NOVEMBER',
    12: 'DECEMBER'
};

function convertArrayPicBuffers2Base64(documents, property) {
    let return_arr = []; 
    for (let doc of documents) {
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

function getDateDifferential(date1, date2) {
    const diffMilliseconds = Math.abs(date2 - date1);
    const diffMinutes = Math.ceil(diffMilliseconds/(1000*60));
    const diffHours = Math.ceil(diffMinutes/60);
    const diffDays = Math.ceil(diffHours / (24)); 

    if (diffMinutes < 60) {
        let descr_text = diffMinutes === 1? `MINUTE AGO`: `MINUTES AGO`;
        return `${diffMinutes} ${descr_text}`;
    }
    else if (diffHours < 24) {
        let descr_text = diffHours === 1 ? 'HOUR AGO': 'HOURS AGO';
        return `${diffHours} ${descr_text}`
    }
    else if (diffDays < 8) {
        let descr_text = diffDays === 1 ? 'DAY AGO': 'DAYS AGO';
        return `${diffDays} ${descr_text}`;
    }
    else {
        const month = monthMapping[date1.getUTCMonth() + 1]; 
        const day = date1.getUTCDate();
        const year = date1.getUTCFullYear();
        return `${month} ${day}, ${year}`;
    }
}

function create_access_refresh_tokens(username) {
    const accessToken = jwt.sign({username: username}, process.env.ACESS_TOKEN_SECRET, {expiresIn: '20m'});
    const refreshToken = jwt.sign({username: username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '3d'});
    return [accessToken, refreshToken];
}

exports.convertArrayPicBuffers2Base64 = convertArrayPicBuffers2Base64; 
exports.convertBuffer2Base64 = convertBuffer2Base64; 
exports.create_access_refresh_tokens = create_access_refresh_tokens; 
exports.getDateDifferential = getDateDifferential; 