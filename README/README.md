<h1>Calendly Zendesk Dashboard version 1.0</h1>
<h4>Coded by Tyler Campbell and Rich Oswald</h4>
<h4>Released: December 20, 2017</h4>
<h4>To: Calendly</h4>
<h4>Deployed: December 20, 2017</h4>
<h3>Purpose</h3>
<p>This app was written as a front-end project for DigitalCrafts 16-week Full-Stack Immersion Bootcamp. The idea was presented to Tyler Campbell by Calendly employee, Joelle Waksman. Joelle wished for a 
dashboard to display her teams realtime progress on support requests for the day. Joelle's reaction
to the finished project is captured in this quote from a LinkedIn message: </p>
<img src="screen_shots/Screen_shot_Joelle_quote.png" alt="">
<h3>Dashboard</h3>
<p>The Calendly Zendesk Dashboard (CZD) provides a realtime visual display of each team members progress on ticket requests and completions. A photo of the team member along with two progress bars provide a visually appealing, easy-to-read display.</p> 
<img src="screen_shots/Screen_shot_dashboard_active.png" width=60%>
<h4>Progress Bars</h4>
<p>The bars report the number of tickets received by the member and the number of tickets completed
by the member. Each bar provides a visual, as well as numerical, description of the team members current work load so the team can be aware of the distribution of work and their individual progress.

<h4>Color Coded</h4>
The top bar, colored blue, displays the tickets received. The lower bar, colored green,
displays the tickets completed. 
</p>
<img src="screen_shots/Screen_shot_progress_bars.png" alt="" width=60%>

<h3>Admin Login</h3>    
<p>A separate admin panel is accessed through a login page that requires a unique user name and id.</p> 
<img src="screen_shots/Screen_shot_admin_login.png" alt="Admin Login" width=60%>

<h3>Admin Page</h3>
<p>The admin page provides the supervisor with control over various items displayed in the dashboard.</p> to a menu on the left of the
page. The menu displays the options to:</p> <ul>
<li>View Dashboard</li>
<li>Add User</li>
<li>Remove User</li>
<li>Set Goal</li>
<li>Logout</li>
</ul>


<img src="screen_shots/Screen_shot_admin_dashboard.png" alt="Admin Dashboard" width=60%>
        
<h3>Add user page</h3>
<p>When adding a user, the admin will be promted to enter the team members name and a picture to use on 
the dashboard display.</p>
<img src="screen_shots/Screen_shot_add_user.png" alt="Admin Add User" width=60%>
<h4>Add user picture</h4>
<p>The picture can be uploaded by browsing in Finder and selecting the appropriate
file, or drag and drop the file into the area denoted in the middle of the add user panel.
</p>
<img src="screen_shots/Screen_shot_add_user_picture.png" alt="Admin Add User Picture" width=60%>
<h3>Remove User</h3>
<p>Users are removed by selecting the remove user link in the task bar which brings up the remove user screen.</p>
<img src="screen_shots/Screen_shot_remove_user.png" alt="" width=60%>            
<h3>Remove User Dropdown Menu</h3>
<p>When removing a user, a drop down menu displays all the current users. From this list, the member to delete
is selected.</p> 
<img src="screen_shots/Screen_shot_remove_user_dropdown_menu.png" alt="" width=60%>
<h3>Remove User Picture Verification</h3>
<p>The current picture along with the name of the selected team member is displayed. If the
correct member has been selected, clicking the red boardered submit button at the bottom of the page will
remove the team member from the Dashboard and Admin Panel display. 
</p>
<img src="screen_shots/Screen_shot_remove_user_picture.png" alt="" width=60%>

<h3>Set Goal Admin Screen</h3>
<p>To set the main goal for the team, the admin selects set goal from the dropdown menu. Then the admin can enter a value and that value will be displayed in the header of the dashboard.
</p>
<img src="screen_shots/Screen_shot_set_goal.png" alt="" width=60%>   
<h3>Logout</h3>
<p>Clicking the logout button returns the admin to the admin login page and prevents viewing admin page without re-entering the correct user-name and password.</p>

<h3>Form Validation and Login Error Display</h3>
<p>There are various errors that can occur when attempting to login to the admin panel.</p>
<h3>Poorly Formatted Email</h3>
<p>If a user types in an email that does not contain the appropriate characters and section of a proper email address, this is noted with an error code in red.</p>
<img src="screen_shots/Screen_shot_login_incorrect_email.png" alt="Incorrect Email Error Message" width=60%>
<h3>User Not Found</h3>
<p>If the user name is not found, an error code reading the same is displayed in red.</p>
<img src="screen_shots/Screen_shot_login_user_not_found.png" alt="User Not Found Error Message" width=60%>
<h3>Wrong Password</h3>
<p>If there is an error in the password entered, this error is reported to the user in red.</p>
<img src="screen_shots/Screen_shot_wrong_password.png" alt="Wrong Password Error Message" width=60%>
<h2>Challenges</h2>
<ul>
    <li>Back-end</li>
    <li>Layout</li>
        <ul>
            <li>Grid</li>
            <li>Bootstrap</li>
        </ul>
    <li>Security</li>
    <li></li>
</ul>   