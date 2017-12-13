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
    let emailValue = email.val();
    let passwordValue = password.val();
    const auth = firebase.auth();

    promise = auth.signInWithEmailAndPassword(emailValue, passwordValue);
    promise.catch(function(error){
        // The email address is badly formatted. 
        //auth/user-not-found
        //auth/wrong-password -> password reset email
        console.log(error.message);
        console.log(error.code);
    });
    
});

//Add password reset eventListener
passwordReset.on('click', function(event){
    event.preventDefault();
    const auth = firebase.auth();
    promise = auth.signInWithEmailAndPassword(emailValue, passwordValue);
    promise.catch(function(error){
        switch (error.code) {
            case "auth/invalid-email":
                break;
            case "auth/user-not-found":
                break;
            default:
                break;
        }

    })

})




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