import React from 'react';
import {useEffect, useState} from 'react';


function Notifications(props) {

    return(
        <div id = "notifications_div">
            <i id = "notifications_icon" class="far fa-heart navbar_icons margin_class" ></i>
            <div className = "top_triangle notif_triangle"></div>
            <div id ="notifications_holder">
                <div id = "follow_requests">
                </div>
                <div id = "notifications">
                </div>
            </div>
        </div>
    )
}


export {Notifications}; 