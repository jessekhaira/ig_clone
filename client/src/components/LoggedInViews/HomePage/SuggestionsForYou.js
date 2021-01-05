import React, { useEffect } from 'react';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, infiniteScroll, setDisplay, normalizeCounts,createPostOptionsDiv} from '../../../utility/utility_functions';
import jwt_decode from 'jwt-decode';


/**
 * This function represents a React component that renders the section of the homepage 
 * responsible for suggesting users to follow for the given user. Implementing this component fully
 * is out of the scope for this project, so placeholders are used for completeness. 
 */
function SuggestionsForYouHomePage (props) {
    const curr_user = jwt_decode(localStorage.getItem('accessToken')).username;

    useEffect(() => {
        fetchSuggested(); 
    }, []);

    async function fetchSuggested() {
        try {
            await checkTokenExpirationMiddleware();
            const usersProfileInfoRaw = await fetch(`/homepage/${curr_user}/suggested`, {
                method: 'get',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            });
            const usersProfileInfo = await usersProfileInfo.json(); 
        }
        catch(err) {

        }
    }
    return(
        <div id = 'suggestions_for_you_top_holder'>
            <div id = 'own_user_info_holder'>
                <img id = 'prof_pic_suggested'></img>
                <div id = 'username_fullname_suggested_own'>
                    <h4 id = 'username_suggested'>Batman123123o2i13j12n3j12n3kj12n3jk21n3kj123kj123k21</h4>
                    <p id = 'fullname_suggested'>Batman123123o2i13j12n3j12n3kj12n3jk21n3kj123kj123k211232312312321</p>
                </div>
            </div>
        </div>
    )
}

export {SuggestionsForYouHomePage}; 