const path = require('path'); 
require('dotenv').config({path: path.resolve(".env")}); 
const jwt = require('jsonwebtoken'); 

/**
 * Object with a mapping between string numbers and the month they represent. Useful when processing
 * date information. 
 */
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


/**
 * This function has the responsibility of converting an array of objects, each representing a Mongoose document, 
 * to an array of Javascript objects with the purpose of converting binart vuffers representing images to base64 
 * encoded strings.
 * 
 */
function convertArrayPicBuffers2Base64(documents, property) {
    let return_arr = []; 
    for (let doc of documents) {
        doc = convertBuffer2Base64(doc, property);
        return_arr.push(doc); 
    }
    return return_arr; 
}

/**
 * This function accepts two arguments: a Mongoose document and a string. The string represents the property in the 
 * mongoose document that holds a buffer representing an image. The Mongoose document is converted to a Javascript
 * object, and the binary buffer is converted to a base64 encoded string. 
 */
function convertBuffer2Base64(doc, property) {
    doc = doc.toObject(); 
    doc[property] = doc[property].toString('base64'); 
    return doc; 
}

/**
 * This function accepts two numbers representing dates, and returns the differential in time between the dates. 
 * According to the differential in time between the dates, the appropriate time is returned.
 * 
 * @param {number} date1 Number representing a date
 * @param {number} date2 Number representing a date
 */
function getDateDifferential(date1, date2) {
    const diffMilliseconds = Math.abs(date2 - date1);
    const diffMinutes = Math.ceil(diffMilliseconds/(1000*60));
    const diffHours = Math.ceil(diffMinutes/60);
    const diffDays = Math.ceil(diffHours / (24)); 

    // based on the time differential, return the appropriate period of time (ie: minutes, hours, etc)
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


/**
 * This purpose of this function is to produce JSON web tokens for a user that has been authorized.
 * @param {String} username String representing the username of a given user 
 * @returns {String[]} Array of 2 strings, with each string representing a JSON web token 
 */
function create_access_refresh_tokens(username) {
    const accessToken = jwt.sign({username: username}, process.env.ACESS_TOKEN_SECRET, {expiresIn: '20m'});
    const refreshToken = jwt.sign({username: username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '3d'});
    return [accessToken, refreshToken];
}

exports.convertArrayPicBuffers2Base64 = convertArrayPicBuffers2Base64; 
exports.convertBuffer2Base64 = convertBuffer2Base64; 
exports.create_access_refresh_tokens = create_access_refresh_tokens; 
exports.getDateDifferential = getDateDifferential; 