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
        document.getElementById('notifications_holder').style.display = 'none'; 
        document.getElementsByClassName('notif_triangle')[0].style.display = 'none'; 
    })


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
            console.log(dummyNotifications); 
        }
        catch(err) {
            console.log(err.message);
        }

        finally {
            setDisplay(['flex','block','none'], follow_req_display, notif_div, spinner_div);
        }
    }


    return(
        <div id = "notifications_div" onClick = {fetchNotifications}>
            <i id = "notifications_icon" class="far fa-heart navbar_icons margin_class" ></i>
            <div className = "top_triangle notif_triangle"></div>
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
                    <div className = "notification">
                        <div className = "userInformation_notif">
                            <div className = "notif_profile_img_div ">
                                <img className = "notif_profile_img" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
                            </div>
                            <div className = "notif_username_div">
                                <p className = "notif_username">1231232131231231213123123121</p>
                            </div>
                            <div className = "notif_descr_div">
                                <p className = "notif_descr">liked your photo</p>
                            </div> 
                            <div className = "notif_time_elapsed_div">
                                <p className = "notif_time_elapsed">2d</p>
                            </div>
                        </div>
                        <div className = "photo_notif_targets_div">
                            <img className = "photo_notif_targets" src = "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"></img>
                        </div>
                    </div>
                    <hr className = "notification_hr"></hr>
                    <div className = "notification">

                    </div>
                    <hr className = "notification_hr"></hr>
                    <div className = "notification">

                    </div>
                    <hr className = "notification_hr"></hr>
                    <div className = "notification">
                        
                    </div>
                    <hr className = "notification_hr"></hr>
                    <div className = "notification">

                    </div>
                    <hr className = "notification_hr"></hr>
                    <div className = "notification">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Utility function that creates an HTML element that represents a properly formatted notification present
 * within the notification dropdown. 
 */
function createNotificationDivs() {

}

function createUserInfoNotifDivs(){
    function createProfileImgDiv() {
    
    }
    function createUsernameDiv() {

    }
    function createDescriptionDiv() {

    }
    function createTimeElapsedDiv(){

    }
}

function createTargetPhotoNotifDiv() {
}


export {Notifications}; 