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
            const usersProfileInfo = await usersProfileInfoRaw.json(); 
            if ('UnauthorizedUser' in usersProfileInfo) {
                throw Error('UnauthorizedUser');
            }

            insertProfileInfo(usersProfileInfo.profile_info);
            insertSuggestedUsersInfo(usersProfileInfo.suggested_users_to_follow); 
        }
        catch(err) {
            err = String(err);
            if (err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut(); 
            }
        }
    }

    function insertProfileInfo(profile_info) {
        document.getElementById('username_suggested').innerHTML = profile_info.username;
        document.getElementById('fullname_suggested').innerHTML = profile_info.full_name;
        document.getElementById('prof_pic_suggested').src = 'data:image/jpeg;base64,' + profile_info.profile_picture.profile_picture;
    }

    function insertSuggestedUsersInfo(suggested_users_to_follow){

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

            <div id = 'suggestions_group_holder'>
                <div id = 'suggestions_descr_holder'>
                    <h3>Suggestions for you</h3>
                    <p>See all</p>
                </div> 
                <div className = 'suggestion_individual_holder'>
                    <img className = 'img_suggestion' src = 'https://lh3.googleusercontent.com/proxy/wabyVXu0CFTL-o76GfEq6j7SGVZowuMMJwMyiQLogU5P-hWZmwYb08uCaokVJG9tcZHIWcvrdnMlX6kfhzbqR-ZjfBNH-plPshQeFJE5IduLBXcx0N9LNeBqOGs0qm4rMs5yGXaHsEYwuR88IEr-blJKEQ6O5K9GxA'></img>
                    <div className = 'username_suggestion_holder'>
                        <h5>Placeholder 1</h5>
                        <p>Suggested for you.</p>
                    </div>
                    <p className = 'follow_suggested'>Follow</p>
                </div>

                <div className = 'suggestion_individual_holder'>
                    <img className = 'img_suggestion' src = 'https://lh3.googleusercontent.com/proxy/wabyVXu0CFTL-o76GfEq6j7SGVZowuMMJwMyiQLogU5P-hWZmwYb08uCaokVJG9tcZHIWcvrdnMlX6kfhzbqR-ZjfBNH-plPshQeFJE5IduLBXcx0N9LNeBqOGs0qm4rMs5yGXaHsEYwuR88IEr-blJKEQ6O5K9GxA'></img>
                    <div className = 'username_suggestion_holder'>
                        <h5>Placeholder 2</h5>
                        <p>Suggested for you.</p>
                    </div>
                    <p className = 'follow_suggested'>Follow</p>
                </div>

                <div className = 'suggestion_individual_holder'>
                    <img className = 'img_suggestion' src = 'https://lh3.googleusercontent.com/proxy/wabyVXu0CFTL-o76GfEq6j7SGVZowuMMJwMyiQLogU5P-hWZmwYb08uCaokVJG9tcZHIWcvrdnMlX6kfhzbqR-ZjfBNH-plPshQeFJE5IduLBXcx0N9LNeBqOGs0qm4rMs5yGXaHsEYwuR88IEr-blJKEQ6O5K9GxA'></img>
                    <div className = 'username_suggestion_holder'>
                        <h5>Placeholder 3</h5>
                        <p>Suggested for you.</p>
                    </div>
                    <p className = 'follow_suggested'>Follow</p>
                </div>

                <div className = 'suggestion_individual_holder'>
                    <img className = 'img_suggestion' src = 'https://lh3.googleusercontent.com/proxy/wabyVXu0CFTL-o76GfEq6j7SGVZowuMMJwMyiQLogU5P-hWZmwYb08uCaokVJG9tcZHIWcvrdnMlX6kfhzbqR-ZjfBNH-plPshQeFJE5IduLBXcx0N9LNeBqOGs0qm4rMs5yGXaHsEYwuR88IEr-blJKEQ6O5K9GxA'></img>
                    <div className = 'username_suggestion_holder'>
                        <h5>Placeholder 4</h5>
                        <p>Suggested for you.</p>
                    </div>
                    <p className = 'follow_suggested'>Follow</p>
                </div>

                <div className = 'suggestion_individual_holder'>
                    <img className = 'img_suggestion' src = 'https://lh3.googleusercontent.com/proxy/wabyVXu0CFTL-o76GfEq6j7SGVZowuMMJwMyiQLogU5P-hWZmwYb08uCaokVJG9tcZHIWcvrdnMlX6kfhzbqR-ZjfBNH-plPshQeFJE5IduLBXcx0N9LNeBqOGs0qm4rMs5yGXaHsEYwuR88IEr-blJKEQ6O5K9GxA'></img>
                    <div className = 'username_suggestion_holder'>
                        <h5>Placeholder 5</h5>
                        <p>Suggested for you.</p>
                    </div>
                    <p className = 'follow_suggested'>Follow</p>
                </div>
            </div>
        </div>
    )
}

export {SuggestionsForYouHomePage}; 