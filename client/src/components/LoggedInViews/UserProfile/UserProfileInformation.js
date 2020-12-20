import React, { useEffect } from 'react';


function UserProfileInformation () {

    useEffect(async () => {
        // call endpoint to fetch all user info
        // profile info + 12pics to start off 
    }); 

    return (
        <div id = "user_profile_info_container">
            <div id = "profile_page_profpic_divcontainer">
                <img id = "profile_page_profpic" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>
            <div id = "profile_info_directparentdiv">
                <div id = "name_options_divcontainer">
                    <div id = "profile_page_username" className = "options_item">
                        <h2 id = "profile_page_username" >Batman</h2>
                    </div>
                    <button id = "edit_profile" className = "options_item">
                        Edit Profile
                    </button>
                    <img id = "profilepg_settingicon" alt = "Settings Wheel" className = "icons_settings options_item" src = "https://image.flaticon.com/icons/png/512/126/126472.png"></img>
                </div>
                <div id = "meta_info_user">
                    <div id = "post_info_div" className = "meta_info_user_divcontainer">
                        <p id = "post_count" className = "post_info_counts">21</p>
                        <p className = "post_info_descr">posts</p>
                    </div>
                    <div id = "follower_info_div" className = "meta_info_user_divcontainer">
                        <p id = "follower_count" className = "post_info_counts">10</p>
                        <p className = "post_info_descr">followers</p>
                    </div>
                    <div id = "following_info_div" className = "meta_info_user_divcontainer">
                        <p id = "following_count" className = "post_info_counts">100</p>
                        <p className = "post_info_descr">following</p>
                    </div>
                </div>
                <div id = "profile_info_bio">
                    <p id = "fullname_profile">Batman</p>
                    <p id = "editable_bio_info">
                        Superhero
                        Justice League
                        Galaxy
                    </p>
                </div>
            </div>
        </div>
    )
}

export {UserProfileInformation}; 