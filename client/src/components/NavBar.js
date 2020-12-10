import React from 'react'; 


class NavBar extends React.Component{
    constructor(props) {
        super(props); 
    }

    render() {
        return(
            <nav id = "navbar">
                <div id = "ig_name">
                    <h1 className = "instagram_name">Instagram Clone</h1>
                </div>

                <div id = "search_bar">
                    <label for = "search"></label>
                    <p>search icon</p>
                    <input id = "search" type = "text"></input>
                </div>

                <div id = "navbar_options">
                    <p>home icon</p>
                    <p>dm icon</p>
                    <p>explore icon</p>
                    <p>notifications icon</p>
                    <p>profile icon</p>
                </div>
            </nav>
        )
    }
}

export {NavBar}; 