function configureData(){
   
    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyCamwmj4QqCWe9rykcuqQrzYYlAgkGx8yc",
      authDomain: "zendesk-dashboard-f13ba.firebaseapp.com",
      databaseURL: "https://zendesk-dashboard-f13ba.firebaseio.com",
      projectId: "zendesk-dashboard-f13ba",
      storageBucket: "zendesk-dashboard-f13ba.appspot.com",
      messagingSenderId: "787748198564"
    };
    firebase.initializeApp(config);
    const email = $('[data-email]');
    const password = $('[data-password]');
    const submitButton = $('[data-submit]');
    const passwordReset = $('[data-password-reset]');

//Add sign-in eventListener
    submitButton.on('click', function(event){
        event.preventDefault();
        const emailValue = email.val();
        const passwordValue = password.val();
        const auth = firebase.auth();

        promise = auth.signInWithEmailAndPassword(emailValue, passwordValue);
        // General input error code reporting function
        var errorFcn = function(errorMessage) {
            var msg = document.getElementById(errorMessage);
            var emailForm = document.getElementById("email-form");
            var pwdForm = document.getElementById("pwd-form")
            var button = document.getElementById("reset-button-line");
            msg.style.display = 'block';
            button.style.marginTop = "22px";
            $(email).on('click', function(event){
                msg.style.display = 'none';
                emailForm.value = '';
                pwdForm.value = '';
                button.style.marginTop = "70px";

    });
};
    promise.catch(function(error){
        if (error.code.includes("invalid-email")) {
            // alert("Email not formatted correctly");
            errorFcn("email-error");
        
          //auth/user-not-found
        }else if (error.code.includes("user-not-found")) {
            errorFcn("user-error");

        
    //auth/wrong-password -> password reset email
        }else if (error.code.includes("wrong-password")) {
            errorFcn("password-error");
    };

    console.log(error.message);
    console.log(error.code);

});
});
    
//Add password reset eventListener
passwordReset.on('click', function(event){
    event.preventDefault();
    const emailValue = email.val();
    const passwordValue = password.val();
    const auth = firebase.auth();
    promise = auth.signInWithEmailAndPassword(emailValue, passwordValue);
    promise.catch(function(error){
        console.log(error.code);
        switch (error.code) {
            case "////auth/invalid-email":
                break;
            case "///////auth/user-not-found":
                break;
            default:
                auth.sendPasswordResetEmail(emailValue).then(function(){
                    $('.reset').text(`Please check your ${email.val()} inbox for a reset password link.`);
                }).catch(function(error){
                    $('.reset').text('An unexpected error occurred. Please try again later.').addClass('error');
                })
            }
        });
    });
    

//Return Admin console if authentication is successful
firebase.auth().onAuthStateChanged(function(user){
    if (user){
        localStorage.setItem("userId", user.uid);
        email.val("");
        password.val("");
        $.ajax({
            type: 'POST',
            url: '/admin',
            data: user.uid,
            success(response){;
                document.open();
                document.write(response);
                document.close();
            } 
        })
    }
});


};
configureData();