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


export {Notifications}; 