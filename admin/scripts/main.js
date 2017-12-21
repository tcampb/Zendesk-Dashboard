var objectArray = [];
var currentURL = '<URL>';

function accountValidation() {
    $.ajax({
        type: 'POST',
        url:  '/admin',
        beforeSend: function(xhr){
            xhr.setRequestHeader('TOKEN', localStorage.getItem("userId"));
            xhr.setRequestHeader('PATH', window.location.pathname);
        },
        success: function(res){
            res === 'invalid user' && window.location.assign('/admin');
        }
    })
}

function getCurrentUsers(){
    $.get('/currentUsers', function(data){
        var data = JSON.parse(data);
        objectArray = Object.values(data);
    });
}

function sendFormData(){
    $('form').on('submit', function(event){
        event.preventDefault()
        var form = $(this);
        var formData = form.serialize();
        var processData = true;
        var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
        if (form.attr('name') === 'adduser') {
            processData = false;
            formData = new FormData(form[0]);
            contentType = false;
        }
        $.ajax({
            type: 'POST',
            url:  form.attr('action'),
            data: formData,
            contentType: contentType,
            processData: processData,
            beforeSend: function(xhr){
                xhr.setRequestHeader('TOKEN', localStorage.getItem("userId"));
            },
            success(response) {
                if (form.attr('name') === 'removeuser') {
                    generateConsoleScreen('removeuser', objectArray);
                }
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
            location.assign(`${currentURL}/admin`);
            break;

        case "adduser":
            $consoleDiv.append(createConsoleElement(e));
            $('[data-goal]').empty().append($('<h2>').text('Add User'));
            sendFormData();
            break;
        case "removeuser":
            $consoleDiv.append(createConsoleElement(e, objectArray));
            $('[data-goal]').empty().append($('<h2>').text('Remove User'));
            $('[data-remove-user-select]').change(function(){
                changeImg($(this).val(), objectArray);
            });
            sendFormData();
            break;
            
        case "setgoal":
            $consoleDiv.append(createConsoleElement(e));
            $('[data-goal]').empty().append($('<h2>').text('Set Goal'));
            sendFormData();
            break;
    
        default:
            $consoleDiv.append(`<iframe src="${currentURL}" width="100%" height="100%" style="border:none"></iframe>`);
            $('[data-goal]').empty().append($('<h2>').text('Dashboard'));
            break;
    }
};

function createConsoleElement(select, objectArray){
    var $consoleDiv = $('<div>').addClass(select);
    var $consoleForm = $('<form>').attr({'action': `/api/${select}`, 'method': 'post', 'name': `${select}`});
    var $submitButton = $('<input>').attr({'type': 'submit', 'value': 'Submit'});
    var $formInput;

    switch (select) {
        case "adduser":
            var $menuContainer = $('<div>').addClass('select-container');
            $consoleForm.attr('enctype', 'multipart/form-data');
            $h2userName = $('<h2><i class="fa fa-user" aria-hidden="true"></i></i> Zendesk Username: </h2>');
            $userNameInput = $('<input>').attr({'type': 'text', 'value': '', 'name': 'username', 'style':
                                                                                                 'width: 100%; height: 100%; outline: none; border: none;'})
                                                                                                 .appendTo($menuContainer);  
            $fileInput = $('<input>').attr({'type': 'file', 'value': '', 'name': 'img', 'id': 'file-upload'});
            $fileLabel = $('<label></label>').attr({'for': 'file-upload', 'class': 'file-label'});
            $fileLabelSpan = $('<span><i class="fa fa-cloud-upload" aria-hidden="true"></i></span>').addClass('file-span').appendTo($fileLabel);
            $consoleForm.append($h2userName, $menuContainer, $fileInput, $fileLabel, $submitButton);
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
            var $menuContainer = $('<div>').addClass('select-container');
            var $timeContainer = $('<div>').addClass('select-container');
            $h2number = $('<h2><i class="fa fa-envelope-o" aria-hidden="true"></i> Number of tickets: </h2>');
            $h2ticketType = $('<h2><i class="fa fa-ticket" aria-hidden="true"></i> Ticket Type: </h2>');
            $h2time = $('<h2><i class="fa fa-clock-o" aria-hidden="true"></i> Goal Time: </h2>');
            $ticketNumberInput = $('<input>').attr({'type': 'number', 'value': '0', 'name': 'ticketNumber'});
            $ticketType = $('<select data-ticket-type-select name="ticketType">').appendTo($menuContainer);
            $solvedOption = $('<option>').text('Solved').attr({"value": `solved`}).appendTo($ticketType);
            $assignedOption = $('<option>').text('Assigned').attr({"value": `assigned`}).appendTo($ticketType);
            $timeInput = $('<input>').attr({'type': 'time', 'value': '0', 'name': 'time'}).appendTo($timeContainer);
            $hiddenInput = $('<input>').attr({'type': 'hidden', 'value': '0', 'name': 'ticketsCompleted'});


            $consoleForm.append($h2number, $ticketNumberInput, $h2ticketType, $menuContainer, $h2time, $timeContainer, $hiddenInput, $submitButton);
            return $consoleDiv.append($consoleForm);
        default:
            break;
    }
};

$(document).ready(function(){
    //Ensure that user did not logout
    accountValidation();
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