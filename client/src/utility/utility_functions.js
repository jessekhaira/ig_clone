import jwt_decode from "jwt-decode";

export function _validateEmail(email_inp) {
    // must follow regex pattern xyz@__.com 
    const regex_pattern = /\S+@\S+\.\S+/;
    return regex_pattern.test(email_inp); 
}

export function _validateUsername(username_inp) {
    // Usernames can only use letters, numbers, underscores and periods.
    const regex_pattern = /^[a-zA-Z0-9_]+$/;
    return regex_pattern.test(username_inp); 
}

export function infiniteScroll() {
    const usersCurrentScrollFromTop = window.innerHeight + document.documentElement.scrollTop + 1; 
    const totalScrollHeightPage = document.documentElement.scrollHeight; 
    if (usersCurrentScrollFromTop >= totalScrollHeightPage) {
        return true; 
    }
}

export function darkenBackground(showPhotoInformation, hidePhotoInformation) {
    [...document.getElementsByClassName('overlay_div_blackout')].map((x) => {
        x.style.display ='block'; 
    });

    [...document.getElementsByClassName('grid_photo_information')].map((x) =>{
        x.style.display = 'flex';
    });

    [...document.getElementsByClassName('infoPhotoHover')].map((x) => {
        x.style.display = 'none';
    }); 

    [...document.getElementsByClassName('grid_photo_div')].map((x) => {
        x.removeEventListener('mouseenter', showPhotoInformation);
        x.removeEventListener('mouseleave', hidePhotoInformation);
    });

    document.getElementById('root').style.pointerEvents = 'none'; 

    document.getElementsByTagName('body')[0].style.overflow = 'hidden'; 
}

export function lightenBackground(showPhotoInformation, hidePhotoInformation) {
    [...document.getElementsByClassName('overlay_div_blackout')].map((x) => {
        x.style.display = 'none';
    });

    [...document.getElementsByClassName('grid_photo_information')].map((x) =>{
        x.style.display = 'none';
    });

    [...document.getElementsByClassName('infoPhotoHover')].map((x) => {
        x.style.display = 'flex';
    }); 

    [...document.getElementsByClassName('grid_photo_div')].map((x) => {
        x.addEventListener('mouseenter', showPhotoInformation);
        x.addEventListener('mouseleave', hidePhotoInformation);
    });
}

export function normalizeCounts(...args) {
    const output_normalized = [];
    for(let arg of args) {
        arg = Number(arg);
        switch (true) {
            case (arg >= 1000000):
                arg /= 1000000;
                output_normalized.push(`${arg.toFixed(1)}m`);
                break;
            case (arg >= 10000):
                arg /= 1000; 
                output_normalized.push(`${arg.toFixed(1)}k`);
                break;
            default:
                output_normalized.push(arg);
                break; 
        }
    }
    return output_normalized; 
}

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
 * Utility function called before we dispatch any HTTP request to a protected route to ensure our 
 * access token isn't prematurely expired. 
 */
export async function checkTokenExpirationMiddleware() {
    // if the access token isn't null, means user has been verified and we should be 
    // checking whether or not access token is expired 
    if (localStorage.getItem('accessToken') !== null) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        // check accessToken expiry -- don't want to send needless requests to the API
        // if our token isnt expired 
        if (jwt_decode(accessToken).exp < Date.now() / 1000) {
            const new_access_token_raw = await fetch(
                '/accounts/refreshToken',
                {
                    method: 'GET',
                    headers: {
                        authorization: refreshToken
                    }
                }
            ); 
            const new_access_token = await new_access_token_raw.json(); 
            if ("message" in new_access_token) {
                // access token is expired and we failed to renew the access token
                // using the refresh token so clear everything out of local storage 
                // and the user will be effectively logged out
                localStorage.clear(); 
            }
            else {
                // otherwise our access token has been refreshed succesfully and we forward the
                // action onward with a valid access token
                localStorage.setItem('accessToken', new_access_token.new_access_token);
                console.log('new access token set!');
            }
        }
    }
}


export function _authenticationErrorLogOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload(); 
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