function formatAMPM(currentTime){
    var meridiem;
    var minutes = currentTime.getMinutes();
    var hours = currentTime.getHours()
    currentTime.getHours() >= 12 ? meridiem = "pm" : meridiem = "am";
    if (minutes < 10) {minutes = `0${minutes}`};
    if (hours > 12) {hours = hours - 12};
    if (hours === 0) {hours = 12};
    var formattedTime = `${hours}:${minutes} ${meridiem}`;
    return formattedTime;
}

function deleteUser(objectArray){
    var tdArray = $('[data-image]');
    var nameArray  = [];
    var userName;
    
    $.each(objectArray, function(index, object){
        nameArray.push(object.name);
    });

    for (var i=0; i < tdArray.length; i++) {
        userName = tdArray[i].getAttribute('data-image');
        if (!nameArray.includes(userName)) {
            $(`[data-image="${userName}"]`).remove();
            $(`[data-info="${userName}"]`).remove();
        }
    }

}

$(document).ready(function(){
    setInterval(function(){
    var ticketsSolved = 0;
    var ticketsAssigned = 0;

    $.get('/userRecords', function(data){
        $.each(JSON.parse(data), function(userAction, userObject){
            $.each(userObject, function(userName, value){
                userAction === "solved" ? ticketsSolved += value : ticketsAssigned += value;
                var maxValue = $(`[data-progress-${userAction}="${userName}"]`).attr('aria-valuemax');
                $(`[data-progress-${userAction}="${userName}"`).attr({
                                                                  "aria-valuenow": `${value}`,
                                                                  "style": `width: ${(value / maxValue) * 100}%; min-width: 3%;`
                                                                 }).text(`${value}`);;                                                       
            });
        });
    });
    $.get('/dailyGoal', function(data){
        var data = JSON.parse(data);
        if (data != "No data") {
            var goalHour = data.time.slice(0, 2);
            var goalMinutes = data.time.slice(3);
            var goalTime = new Date();
            goalTime.setHours(goalHour);
            goalTime.setMinutes(goalMinutes);
            var currentTime = new Date();
            var currentTimeAMPM = formatAMPM(currentTime);
            var ticketsRemaining = Number(data.ticketNumber) - Number(data.ticketsCompleted);
            $('[data-time]').text(currentTime.toDateString() + " " + currentTimeAMPM);
            $('[data-goals]').text(`Daily Goal: ${data.ticketNumber} ${data.ticketType} ticket's by ${formatAMPM(goalTime)}`);
            $('[data-counter]').text(` ${ticketsRemaining}`);
            $('[data-div-goals]').removeClass('hidden');
            $('[data-time]').removeClass('hidden');
            data.ticketType === "solved" ? $('[data-counter]').attr({"style": "color: #bed686"}) : $('[data-counter]').attr({"style": "color: #00A2FF"})
            if (data.ticketType === "solved" && ticketsSolved >= data.ticketNumber && currentTime <= goalTime) {
                // CSS animations
            } else if (data.ticketType === "assigned" && ticketsAssigned >= data.ticketNumber && currentTime <= goalTime) {
                // CSS animations
            }
        } else {
        $('[data-div-goals]').addClass('hidden');
        $('[data-time]').addClass('hidden');
        }
    })

    $.get('/currentUsers', function(data){
        var data = JSON.parse(data);
        var objectArray = Object.values(data);
        var tbody = $('tbody');
        var $row;
        $.each(objectArray, function(index, object){
            if ($(`[data-progress-assigned = "${object.name}"]`).length === 0) {
                //Only add new row if 2 users have been added
                if (index % 2 === 0) {$row = tbody.append($(`<tr>`))}
                    tdImg = $('<td>').addClass('picture-size col-md-1').attr('data-image', object.name);
                    tdInfo = $('<td>').addClass('col-md-5').attr('data-info', object.name);
                    $('tbody tr:last').append(tdImg, tdInfo);
                    $('<img>').attr('src', object.imgSrc).appendTo(tdImg);
                    $(`<h3>${object.name}</h3>`).appendTo(tdInfo);
                    progressBarAssignedDiv = $('<div>').attr({'class': 'progress'});
                    $('<div>').attr({'class': `progress-bar progress-bar-striped active assigned`,
                                        'role': "progressbar",
                                        "aria-valuenow": `0`,
                                        "aria-valuemin": "0",
                                        "aria-valuemax": "60",
                                        "style": `width: 3%`,
                                        "data-progress-assigned": `${object.name}`
                                    }).text("0").appendTo(progressBarAssignedDiv);
                    progressBarSolvedDiv = $('<div>').attr({'class': 'progress'});
                    $('<div>').attr({'class': `progress-bar progress-bar-striped active solved`,
                    'role': "progressbar",
                    "aria-valuenow": `0`,
                    "aria-valuemin": "0",
                    "aria-valuemax": "60",
                    "style": `width: 3%`,
                    "data-progress-solved": `${object.name}`
                    }).text("0").appendTo(progressBarSolvedDiv);
                    tdInfo.append(progressBarAssignedDiv, progressBarSolvedDiv);
                }
                //Call deleteUser function if user is removed 
                deleteUser(objectArray);
                });
        });
    }, 1000);
});