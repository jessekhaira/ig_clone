/**
 * This function is a utility function used to set the display of a variable number of input DOM elements. 
 * Useful in multiple places in the frontend as displays of elements are changed regularly. 
 * 
 * Expects the displays array to match the length of the args array, where displays[i] is a String describing the
 * display of args[i]. 
 * @param {String[]} displays Array of strings containing the CSS displays for a wide variety of elements
 * @param  {HTMLElement[]} args Array of DOM elements 
 */
export function setDisplay(displays, ...args) {
    for (let [i,arg] of args.entries()) {
        const display = displays[i]; 
        arg.style.display = display; 
    }
}


/**
 * Function used for frontend development
 * Simulates the response expected from the backend for search
 */
export async function simulateSearchResults1() {
    return new Promise(resolve => {
        setTimeout(() => {
            const searchResult1 = {
                username: "user_1232132132132141251823193123213012312321312312312312321312891239123",
                full_name: "anon4",
                user_profile_pic: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            };
            
            const searchResult2 = {
                username: "1231213",
                full_name: "anon2",
                user_profile_pic: "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"
            };

            const searchResult3 = {
                username: "user_1232132132132141251823193123213012312321312312312312321312891239123",
                full_name: "anon1",
                user_profile_pic: "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074__340.jpg"
            };

            const searchResult4 = {
                username: "user_12321321321321412518231931232130123891239123",
                full_name: "anon3",
                user_profile_pic: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" 
            };

            const returnObj = {
                searchResults: [searchResult1, searchResult2, searchResult3, searchResult4]
            };

            resolve(returnObj); 

        }, 250);
      });
}

/**
 * Function used for frontend development
 * Simulates the response expected from the backend for search
 */
export async function simulateSearchResults2() {
    return new Promise(resolve => {
        setTimeout(() => {
            const searchResult1 = {
                username: "user_1232132132132141251823193123213012312321312312312312321312891239123",
                full_name: "anon4",
                user_profile_pic: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            };
            
            const searchResult2 = {
                username: "1231213",
                full_name: "anon2",
                user_profile_pic: "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"
            };

            const searchResult3 = {
                username: "user_1232132132132141251823193123213012312321312312312312321312891239123",
                full_name: "anon1",
                user_profile_pic: "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074__340.jpg"
            };

            const searchResult4 = {
                username: "user_12321321321321412518231931232130123891239123",
                full_name: "anon3",
                user_profile_pic: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" 
            };

            const returnObj = {
                searchResults: [searchResult2, searchResult1, searchResult4, searchResult3]
            };

            resolve(returnObj); 

        }, 250);
      });
}


/**
 * Function used for frontend development
 * Simulates the response expected from the backend for search
 */
export async function simulateSearchResults3() {
    return new Promise(resolve => {
        setTimeout(() => {
            const returnObj = {
                searchResults: []
            }
            resolve(returnObj); 

        }, 250);
      });
}



/**
 * Function used for frontend development
 * Simulates the response expected from the backend when asked if there are any new 
 * notifications for the given user 
 */
export async function newNotificationsForUser() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true); 
        }, 250);
      });
}



/**
 * Function used for frontend development
 * Simulates the response expected from the backend for notifications for a given user 
 */
export async function fetchDummyNotifications() {
    return new Promise(resolve => {
        setTimeout(() => {
            const notification1 = {
                user_profile_pic: "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg",
                username: "1231213",
                action: "liked",
                target_img: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                time_elapsed: '30s'
            };

            const notification2 = {
                user_profile_pic: "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg",
                username: "user_2",
                action: "comment",
                comment: "123123213213213 12321 3123 21312 321 12 3123 0111010101100101  101101010210101010101101010191919",
                target_img: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                time_elapsed: '2d'
            };

            const notification3 = {
                user_profile_pic: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                username: "user_12321321321321412518231931232130123891239123",
                action: "comment",
                comment: "123123213213213 12321 3123 21312 321 12 3123 0111010101100101 1010101101010101 101101010210101010101101010191919",
                target_img: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                time_elapsed: '5m'
            };


            const notification4 = {
                user_profile_pic: "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074__340.jpg",
                username: "user_1232132132132141251823193123213012312321312312312312321312891239123",
                action: "liked",
                target_img: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                time_elapsed: '25m'

            };

            const follow_req1 = {
                username: "user_1232132132132141251823193123213012312321312312312312321312891239123",
                full_name: "anon1",
                user_profile_pic: "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074__340.jpg"
            };

            const follow_req2 = {
                username: "1231213",
                full_name: "anon2",
                user_profile_pic: "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"
            };

            const follow_req3 = {
                username: "user_12321321321321412518231931232130123891239123",
                full_name: "anon3",
                user_profile_pic: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            };

            const follow_req4 = {
                username: "user_1232132132132141251823193123213012312321312312312312321312891239123",
                full_name: "anon4",
                user_profile_pic: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            };

            const user_notifications = {
                follow_requests: [follow_req1, follow_req2, follow_req3, follow_req4],
                notifications: [notification1, notification2, notification3, notification4]
            };


            resolve(user_notifications); 
        }, 500);
      });
}

export function _preprocess_loginbutton(loginButton, eventListenerRemove) {
    loginButton.disabled = true; 
    loginButton.removeEventListener('click', eventListenerRemove); 
}

export function displayErrorInHTMLElement(err_msg, err_node, display) {
    if (err_msg.includes(":")) {
        err_msg = err_msg.split(":")[1]; 
    }
    err_node.innerHTML = err_msg; 
    err_node.style.display = display; 
}

export function _toggleDisplays(display, ...args) {
    for (let elem of args) {
        elem.style.display = (elem.style.display === display ? 'none': display);
    }
}

export function _setDisplayNone(...args) {
    for (let elem of args) {
        elem.style.display = 'none'; 
    }
}