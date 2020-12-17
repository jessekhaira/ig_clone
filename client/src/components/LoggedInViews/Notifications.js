import React from 'react';
import {useEffect, useState} from 'react';


function Notifications(props) {

    return(
        <div id = "notifications_div">
            <i id = "notifications_icon" class="far fa-heart navbar_icons margin_class" ></i>
            <div className = "top_triangle notif_triangle"></div>
            <div id ="notifications_holder">
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