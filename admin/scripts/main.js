$(document).ready(function(){
    var queryString = window.location.search;
    queryString.includes("404") && alert("User not found");
    queryString.includes("500") && alert("Failed to create new user. Please try again.");
    $.get('/userRecords', function(data){
        $.each(JSON.parse(data), function(userAction, userObject){
            if (userAction === "solved") {
                $.each(userObject, function(userName, value){
                    var selectOption = $('<option>').text(`${userName}`).attr({"value": `${userName}`});
                    $('[data-remove-user]').append(selectOption);   
                });
            }
        });
    });
    $('form').on('submit', function(event){
        event.preventDefault();
        var form = $(this);

        $.ajax({
            type: 'POST',
            url:  form.attr('action'),
            data: form.serialize()
        });
    });

});

