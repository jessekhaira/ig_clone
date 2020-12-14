import React from 'react';
import {Link} from "react-router-dom";

function Notifications(props) {
    return(
        <div id = "notifications_div">
            <i id = "notifications_icon" class="far fa-heart navbar_icons margin_class" ></i>
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