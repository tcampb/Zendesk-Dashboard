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
    const password = $('[data-password');
    const button = $('[data-submit]');

//Add sign-up event

button.on('click', function(event){
    event.preventDefault();
    const emailValue = email.val();
    const passwordValue = password.val();
    const auth = firebase.auth();

    promise = auth.signInWithEmailAndPassword(emailValue, passwordValue);
    promise.catch(function(error){
        console.log(error.message);
    });
    
});

firebase.auth().onAuthStateChanged(function(user){
    if (user){
        localStorage.setItem("userId", user.uid);
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