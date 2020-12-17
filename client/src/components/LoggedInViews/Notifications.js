import React from 'react';
import {useEffect, useState} from 'react';
import { fetchDummyNotifications, setDisplay } from '../../utility/utility_functions';


/**
 * This functional component represents the notifications icon + associated notifications dropdown 
 * present on the navigation bar. Whenever the notifications icon is clicked, an HTTP get request
 * is sent to the backend to retrieve all the new follow requests and notifications for this user. 
 */
function Notifications(props) {

    useEffect(() => {
        if (firstTimeMounted === true) {
            document.getElementById('notifications_holder').style.display = 'none'; 
            document.getElementsByClassName('notif_triangle')[0].style.display = 'none'; 
            setFirstTimeMounted(false); 
        }
    });

    // useEffect(async function() {

    // }); 

    // as soon as component mounts we send a request to the server to find out if there are any
    // non-stale notifications lying in wait for the user -- at which point we 

    const [followRequests, setFollowRequests] = useState({}); 
    const [firstTimeMounted, setFirstTimeMounted] = useState(true); 


    async function fetchNotifications() {
        // Can implement an api endpoint in backend that returns 
        // all notifications for a given user but for now, pretending we have 
        // objects already
        
        // hide follow req display and notifications display
        const follow_req_display = document.getElementById('follow_requests');
        const notif_div = document.getElementById('notificationDiv');
        const spinner_div = document.getElementsByClassName('sk-chase-notif')[0];
        setDisplay(['none','none','block'], follow_req_display, notif_div, spinner_div);

        try {
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
            setDisplay(['flex','block','none'], follow_req_display, notif_div, spinner_div);
        }
    }

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


    return(
        <div id = "notifications_div" onClick = {fetchNotifications}>
            <i id = "notifications_icon" class="far fa-heart navbar_icons margin_class" ></i>
            <div className = "top_triangle notif_triangle"></div>
            <div className = "new_notifications"></div>
            <div id ="notifications_holder">
                <div id = "spinner_div_notifications" className="sk-chase sk-chase-notif">
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                </div>
                <div id = "follow_requests">
                    <div id = "follow_req_info_container">
                        <div id = "num_follow_req">1</div>
                        <div id = "follow_req_info">
                            <h3>Follow Requests</h3>
                            <p>Approve or ignore requests</p>
                        </div>
                    </div>
                    <div className = "side_triangle"></div>
                </div>
                <div id = "notificationDiv">
                </div>
            </div>
        </div>
    )
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
        img_tag.classList.add('notif_profile_img');
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