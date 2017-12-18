// function getCurrentUsers(){

// }



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
            break;
        case "removeuser":
            // $consoleDiv.append(createConsoleElement(e));
            console.log(objectArray);
            break;
            
        case "setgoal":
            $consoleDiv.append(createConsoleElement(e));
            break
    
        default:
            $consoleDiv.append('<iframe src="https://4da9b220.ngrok.io/" width="100%" height="100%" style="border:none"></iframe>');
            break;
    }
};

function createConsoleElement(select){
    var $consoleDiv = $('<div>').addClass(select);
    var $consoleForm = $('<form>').attr({'action': `/api/${select}`, 'method': 'post'});
    var $submitButton = $('<input>').attr({'type': 'submit', 'value': 'submit'});
    var $formInput;

    switch (select) {
        case "adduser":
            $userNameInput = $('<input>').attr({'type': 'text', 'value': '', 'name': 'username'});
            $fileInput = $('<input>').attr({'type': 'file', 'value': '', 'name': 'img'});
            $consoleForm.append($userNameInput, $fileInput, $submitButton);
            return $consoleDiv.append($consoleForm);
        case "removeuser":
            f
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


//     <form action="/api/delete" method="post" name="Delete">
//         <select name="username" data-remove-user>
//             <option value=" " selected hidden>Select</option>   
//         <input type="submit" value="submit">
//     </form>

// <form action="/api/goals" method="post" name="test123123123">
//         <input type="number" value="0" id="test" name="ticketNumber">Tickets Number
//         <input type="radio" value="solved" name="ticketType">Solved
//         <input type="radio" value="assigned" name="ticketType">Assigned
//         <input type="time" value="0" id="test" name="time">Time
//         <input type="hidden" value="0" name="ticketsCompleted">
//         <input type="submit" value="submit">
//     </form>


$(document).ready(function(){
    var objectArray = [];

    setInterval(function(){
        $.get('/currentUsers', function(data){
            var data = JSON.parse(data);
            var objectArray = Object.values(data);
        });
    }, 1000);
        
        
    $('[data-select]').click(function(event){
        event.preventDefault();
        generateConsoleScreen($(this).attr('data-select'), objectArray);
    });

});