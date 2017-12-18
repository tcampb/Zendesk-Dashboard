var objectArray = [];

function getCurrentUsers(){
    $.get('/currentUsers', function(data){
        var data = JSON.parse(data);
        objectArray = Object.values(data);
    });
}

function sendFormData(){
    $('[name="removeuser"]').on('submit', function(event){
        event.preventDefault();
        var form = $(this);
        $.ajax({
            type: 'POST',
            url:  form.attr('action'),
            data: form.serialize(),
            beforeSend: function(xhr){
                xhr.setRequestHeader('TOKEN', localStorage.getItem("userId"));
            },
            success(response) {
                generateConsoleScreen('removeuser', objectArray);
            }
        });
    });
}


function changeImg(user, objectArray){
    var imgFile;
    var userName;
    $.each(objectArray, function(index, object){
        if (user === object.name) {
            imgFile = object.imgSrc;
            userName = object.name;
        };
    });
    $img = $('<img>').attr({'src': `${imgFile}`, 'style': 'display: block; margin: 0 auto 0 auto; border-radius: 50%; height: 200px'});
    $('[data-remove-user-img]').empty();
    $('[data-remove-user-img]').append($img, $('<h2>').text(`${userName}`));
};

function generateConsoleScreen(e, objectArray) {
    var $consoleDiv = $('[data-console]');
    $consoleDiv.empty();

    switch (e) {
        case "logout":
            localStorage.clear();
            location.assign('https://4da9b220.ngrok.io/admin/');
            break;

        case "adduser":
            $consoleDiv.append(createConsoleElement(e));
            sendFormData();
            break;
        case "removeuser":
            $consoleDiv.append(createConsoleElement(e, objectArray));
            $('[data-remove-user-select]').change(function(){
                changeImg($(this).val(), objectArray);
            });
            sendFormData();
            break;
            
        case "setgoal":
            $consoleDiv.append(createConsoleElement(e));
            break;
    
        default:
            $consoleDiv.append('<iframe src="https://4da9b220.ngrok.io/" width="100%" height="100%" style="border:none"></iframe>');
            break;
    }
};

function createConsoleElement(select, objectArray){
    var $consoleDiv = $('<div>').addClass(select);
    var $consoleForm = $('<form>').attr({'action': `/api/${select}`, 'method': 'post', 'name': `${select}`});
    var $submitButton = $('<input>').attr({'type': 'submit', 'value': 'submit'});
    var $formInput;

    switch (select) {
        case "adduser":
            $userNameInput = $('<input>').attr({'type': 'text', 'value': '', 'name': 'username'});
            $fileInput = $('<input>').attr({'type': 'file', 'value': '', 'name': 'img'});
            $consoleForm.append($userNameInput, $fileInput, $submitButton);
            return $consoleDiv.append($consoleForm);
        case "removeuser":
            var $removeUserButton = $('<input>').attr({'type': 'submit', 'value': 'Remove User'});
            var $menuContainer = $('<div>').addClass('select-container');
            var $dropdownMenu = $('<select data-remove-user-select name="username">').appendTo($menuContainer);
            var $default = $('<option>').text('Select a user').attr({"value": `none`}).appendTo($dropdownMenu);
            $.each(objectArray, function(index, object){
                var selectOption = $('<option>').text(`${object.name}`).attr({"value": `${object.name}`}).appendTo($dropdownMenu);
            });
            $imgPlaceholder = $('<div>').attr({'class': 'remove-user-img', 'data-remove-user-img': ''});
            $iconPlaceholder = $('<i class="fa fa-user-circle-o" aria-hidden="true"></i>').attr({'style': "color: #00a2ff; font-size: 200px"}).appendTo($imgPlaceholder);
            $consoleForm.append($menuContainer, $imgPlaceholder, $removeUserButton);
            return $consoleDiv.append($consoleForm);

        case "setgoal":
            $ticketNumberInput = $('<input>').attr({'type': 'number', 'value': '0', 'name': 'ticketNumber'})
            $solvedRadioInput = $('<input>').attr({'type': 'radio', 'value': 'solved', 'name': 'ticketType'})
            $assignedRadioInput = $('<input>').attr({'type': 'radio', 'value': 'assigned', 'name': 'ticketType'});
            $timeInput = $('<input>').attr({'type': 'time', 'value': '0', 'name': 'time'});
            $hiddenInput = $('<input>').attr({'type': 'hidden', 'value': '0', 'name': 'ticketsCompleted'});
            $consoleForm.append($ticketNumberInput, $solvedRadioInput, $assignedRadioInput, $timeInput, $hiddenInput, $submitButton);
            return $consoleDiv.append($consoleForm);
        default:
            break;
    }
};

$(document).ready(function(){
    setInterval(function(){
        getCurrentUsers();
    }, 1000);
        
    $('[data-select]').click(function(event){
        event.preventDefault();
        $('[data-select]').removeClass('selected');
        $(this).addClass('selected');
        generateConsoleScreen($(this).attr('data-select'), objectArray);
    });

});