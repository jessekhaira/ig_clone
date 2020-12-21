import React from 'react';
import {useEffect, useState} from 'react';
import {setDisplay} from '../../utility/utility_functions';
import {fetchDummyNotifications, newNotificationsForUser} from '../../utility/engineering_utility';

/**
 * This functional component represents the notifications icon + associated notifications dropdown 
 * present on the navigation bar. Whenever the notifications icon is clicked, an HTTP get request
 * is sent to the backend to retrieve all the new follow requests and notifications for this user. 
 */
function Notifications(props) {

    /**
     * This effect acts to set the display of the heart icon dropdown and its associated top triangle 
     * to none when the component FIRST mounts, not on later mounts (ex: refreshing page). 
     */
    useEffect(() => {
        if (firstTimeMounted === true) {
            document.getElementById('heartIconDropdown').style.display = 'none'; 
            document.getElementsByClassName('notif_triangle')[0].style.display = 'none'; 
            setFirstTimeMounted(false); 
        }
    });


    /**
     * This effect acts to query the backend whether or not this particular user has any new notifications.
     * Call should be done every time the component mounts unless the heart icon dropdown is already displaying
     * or if we're already in the middle of an api call 
     */
    useEffect(()  => {
        // don't want to and make api call if we're currently looking at notifications 
        async function getNewNotificationsUser() {
            if (document.getElementById('heartIconDropdown').style.display === 'none' && 
                !currentlyFetchingNotif) {
                try {
                    const new_notifs_user = await newNotificationsForUser();
                    (new_notifs_user ? 
                        document.getElementsByClassName('new_notifications')[0].style.display = 'block':
                        document.getElementsByClassName('new_notifications')[0].style.display = 'none'
                    ); 
                }
                catch(err) {
                    console.log(err.message); 
                }
            }
        }
        getNewNotificationsUser(); 
    }); 

    /**
     * State object that keeps track of all the follow requests for this given user. When we query
     * the backend for all the new notifications for this user, we also fetch the follow requests
     * along with it and the follow requests must be shared by multiple different functions. 
     */
    const [followRequests, setFollowRequests] = useState({}); 
    const [firstTimeMounted, setFirstTimeMounted] = useState(true); 
    const [currentlyFetchingNotif, setCurrentlyFetchingNotif] = useState(false); 


    async function fetchNotifications(e) {
        // Can implement an api endpoint in backend that returns 
        // all notifications for a given user but for now, pretending we have 
        // objects already
        if (e.target.classList[0] === 'new_notifications') {
            return; 
        }
        // hide follow req display and notifications display
        const follow_req_display = document.getElementById('follow_requests_container');
        const notif_div = document.getElementById('notificationDiv');
        const spinner_div = document.getElementsByClassName('sk-chase-notif')[0];
        const new_notif_circle = document.getElementsByClassName('new_notifications')[0];
        const follower_requests_actual = document.getElementById('follow_requests_div');
        setDisplay(['none','none','block', 'none', 'none'], follow_req_display, notif_div, spinner_div, new_notif_circle, follower_requests_actual);

        try {
            setCurrentlyFetchingNotif(true); 
            const dummyNotifications = await fetchDummyNotifications(); 
            const follow_req = dummyNotifications.follow_requests;
            setFollowRequests(follow_req); 
            addNewNotificationsToNotifDiv(dummyNotifications.notifications);
            document.getElementById('num_follow_req').innerHTML = follow_req.length; 
        }

        catch(err) {
            console.log(err.message);
        }

        finally {
            setDisplay(['flex','block','none', 'none'], follow_req_display, notif_div, spinner_div, new_notif_circle);
            setCurrentlyFetchingNotif(false); 
        }
    }

    function showFollowRequests(e) {
        const follow_req_display = document.getElementById('follow_requests_container');
        const notif_div = document.getElementById('notificationDiv');
        const follow_req_div = document.getElementById('follow_requests_div');
        setDisplay(['none', 'none', 'block'], follow_req_display, notif_div, follow_req_div);
        addNewFollowRequestsToFollowReqDiv(followRequests);
    }


    return(
        <div id = "heartIconContainer">
            <i id = "heart_icon" class="far fa-heart navbar_icons margin_class" onClick = {fetchNotifications}></i>
            <div className = "top_triangle notif_triangle"></div>
            <div className = "new_notifications"></div>
            <div id ="heartIconDropdown">
                <div id = "spinner_div_notifications" className="sk-chase sk-chase-notif">
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                </div>
                <div id = "follow_requests_container" onClick = {showFollowRequests}>
                    <div id = "follow_req_info_container">
                        <div id = "num_follow_req">1</div>
                        <div className = "follow_req_info">
                            <h3>Follow Requests</h3>
                            <p>Approve or ignore requests</p>
                        </div>
                    </div>
                    <div className = "side_triangle"></div>
                </div>
                <div id = "notificationDiv">
                </div>
                <div id ="follow_requests_div">
                </div>
            </div>
        </div>
    )
}



// all functions below related to adding follow requests programmatically
function addNewFollowRequestsToFollowReqDiv(follow_reqs) {
    const follow_req_div = document.getElementById('follow_requests_div');
    follow_req_div.textContent = '';
    for (let follow_req of follow_reqs) {
        const newFollowReqDiv = createFollowRequest(follow_req);
        const hr_tag = document.createElement('hr');
        hr_tag.classList.add('notification_hr'); 
       
        follow_req_div.appendChild(newFollowReqDiv);
        follow_req_div.appendChild(hr_tag);
    }
    
}

function createFollowRequest(follow_req) {

    function createFollowRequestInfo() {
        const followReqInfoDiv = document.createElement('div');
        followReqInfoDiv.classList.add('profile_img_names_container');

        const profile_img_div = document.createElement('div');
        const profile_img = document.createElement('img');
        profile_img.classList.add('profile_img');
        profile_img.src = follow_req.user_profile_pic; 
        profile_img_div.appendChild(profile_img); 

        const name_holding_div = document.createElement('div');
        name_holding_div.classList.add('request_names');
        const username = document.createElement('h3');
        const fullname = document.createElement('p');
        username.innerHTML = follow_req.username;
        fullname.innerHTML = follow_req.full_name;
        name_holding_div.appendChild(username);
        name_holding_div.appendChild(fullname);

        followReqInfoDiv.appendChild(profile_img_div);
        followReqInfoDiv.appendChild(name_holding_div); 
        return followReqInfoDiv; 
    }

    function createFollowRequestButtons() {
        const buttonHolder = document.createElement('div');
        buttonHolder.classList.add('follow_req_buttons');
        const confirm_button = document.createElement('div');
        const delete_button = document.createElement('div');

        confirm_button.classList.add('button_fr');
        confirm_button.classList.add('confirm_button');
        confirm_button.innerHTML = 'Confirm';

        delete_button.classList.add('button_fr');
        delete_button.classList.add('delete_button')
        delete_button.innerHTML = 'Delete'; 

        buttonHolder.appendChild(confirm_button);
        buttonHolder.appendChild(delete_button);
        return buttonHolder; 
    }
    const newFollowReq = document.createElement('div');
    newFollowReq.classList.add('follow_request');

    const followReqInfoDiv = createFollowRequestInfo();

    const buttons = createFollowRequestButtons(); 

    newFollowReq.appendChild(followReqInfoDiv);
    newFollowReq.appendChild(buttons);
    return newFollowReq; 
}

// all functions below related to adding notifications programmatically
function addNewNotificationsToNotifDiv(notifications) {
    const notifDivHolder = document.getElementById('notificationDiv');
    // erase all children in the holder in preparation for the new children
    // (they may be the same, but the backend decides which notifications to send when)
    notifDivHolder.textContent = '';
    for (let notif of notifications) {
        const notif_div = createNotificationDivs(notif);
        console.log(notif_div);
        notifDivHolder.appendChild(notif_div); 
        const hr_tag = document.createElement('hr');
        hr_tag.classList.add('notification_hr');
        notifDivHolder.appendChild(hr_tag);
    }
    console.log(notifDivHolder.children);
}


/**
 * Utility function that creates an HTML element that represents a properly formatted notification present
 * within the notification dropdown. 
 */
function createNotificationDivs(notif_object) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    const infoAboutNotificationContainer = createUserInfoNotifDivs(notif_object);
    const targetPhotoLikedContainer = createTargetPhotoNotifDiv(notif_object); 
    notification.appendChild(infoAboutNotificationContainer);
    notification.appendChild(targetPhotoLikedContainer);
    return notification; 
    
}

function createUserInfoNotifDivs(notif_object){
    function createProfileImgDiv() {
        const profile_imgDiv = document.createElement('div');
        profile_imgDiv.classList.add('notif_profile_img_div');
        const img_tag = document.createElement('img');
        img_tag.classList.add('profile_img');
        img_tag.src = notif_object.user_profile_pic;
        profile_imgDiv.appendChild(img_tag);
        return profile_imgDiv; 
    }

    function createUsernameDiv() {
        const notifUsernameDiv = document.createElement('div');
        notifUsernameDiv.classList.add('notif_username_div')
        const username = document.createElement('p');
        username.classList.add('notif_username');
        username.innerHTML = notif_object.username;
        notifUsernameDiv.appendChild(username);
        return notifUsernameDiv;
    }

    function createDescriptionDiv() {
        const notif_descr_div = document.createElement('div');
        notif_descr_div.classList.add('notif_descr_div');
        let description = null;
        switch(notif_object.action) {
            case "liked":
                description = "liked your photo";
                break;
            case "comment":
                description = `commented: ${notif_object.comment}`;
                break;
        }
        const p_tag = document.createElement('p');
        p_tag.classList.add('notif_descr');
        p_tag.innerHTML = description;
        notif_descr_div.appendChild(p_tag);
        return notif_descr_div;
        
    }
    function createTimeElapsedDiv(){
        const notif_time_elapsed_div = document.createElement('div');
        notif_time_elapsed_div.classList.add('notif_time_elapsed_div');
        const p_tag = document.createElement('p');
        p_tag.classList.add('notif_time_elapsed');
        p_tag.innerHTML = notif_object.time_elapsed; 
        notif_time_elapsed_div.appendChild(p_tag);
        return notif_time_elapsed_div;
    }

    const userInfoNotifHolder = document.createElement('div');
    userInfoNotifHolder.classList.add('userInformation_notif');
    const childrenDivs = [createProfileImgDiv(), createUsernameDiv(), createDescriptionDiv(), createTimeElapsedDiv()];
    for (let i=0; i<childrenDivs.length; i++) {
        userInfoNotifHolder.appendChild(childrenDivs[i]);
    }

    return userInfoNotifHolder;

}

function createTargetPhotoNotifDiv(notif_object) {
    const photo_notif_targets_div = document.createElement('div');
    photo_notif_targets_div.classList.add('photo_notif_targets_div');
    const img_tag = document.createElement('img');
    img_tag.classList.add('photo_notif_targets');
    img_tag.src = notif_object.target_img;
    photo_notif_targets_div.appendChild(img_tag);
    return photo_notif_targets_div;
}


export {Notifications}; 