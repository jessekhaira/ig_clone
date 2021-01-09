# Instagram Clone
This is an application I built using Mongo, Express, React, Sass, and Redux that clones Instagram. Given that instagram is a massive application, the scope of the project was limited to implementing the specific features of instagram shown below.

The project is deployed and can be seen at:https://instagramwebclone.herokuapp.com/. A note that since the project is deployed on the free tier of Heroku, it will run slowly. 

## Features
- User can register for an account, requiring their email, username, name and password.
- User can login using their credentials (email/username, password). Logged in users obtain Json Web Tokens (access token, refresh token)
- User can upload a profile picture and edit their name, username, email and password after registration
- User can upload images
- User can see all the images they have uploaded in the order in which they were uploaded, with infinite scrolling supported for profile pages 
- Users can follow and unfollow other users
- User can see a global feed of images sorted on the homepage from all the users they follow, with infinite scrolling supported on every users homepage
- Search feature allows user to search for other users on the app
- Clicking on an image on a users profile page focuses in on it with its associated information such as likes and comments
- Static versions of user stories and suggested users implemented on homepage
- Static versions of notifications for user implemented
- Fully responsive Design


## Screenshots
Login page 
<br> 
<kbd>
  <img src="./screenshots/login.png" width="600">
</kbd>

Register page
<br> 
<img src="./screenshots/register.png" width="600">

When user logs in, they are redirected to their profile page 
<br> 
<img src="./screenshots/user_profile.png" width="600">

Showing responsiveness of the user profile route
<br> 
<img src="./screenshots/responsive_user_profile.png" width="600">

Viewing all users that are followers of this user
<br> 
<img src="./screenshots/see_all_followers.png" width="600">

Viewing all users this user is following
<br> 
<img src="./screenshots/see_all_following.png" width="600">

Looking up other users through the search bar
<br>
<img src="./screenshots/search_bar.png" width="600">

Focusing in on one image by clicking on it 
<br>
<img src="./screenshots/focused_in_pic.png" width="600">

Focused in on one image responsive
<br>
<img src="./screenshots/focused_in_pic_responsive.png" width="600">



## Installation
