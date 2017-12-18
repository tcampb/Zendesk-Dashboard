var goalsAchieved = 0;
var runAnimation = true;

function formatAMPM(currentTime){
    var meridiem;
    var minutes = currentTime.getMinutes();
    var hours = currentTime.getHours()
    currentTime.getHours() >= 12 ? meridiem = "pm" : meridiem = "am";
    if (minutes < 10) {minutes = `0${minutes}`};
    if (hours > 12) {hours = hours - 12};
    if (hours === 0) {hours = 12};
    var formattedTime = `${hours}:${minutes}${meridiem}`;
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

function goalValidation(userName, value){
    if (value >= 45) {
        $(`[data-sheep-animation="${userName}"`).removeClass('hide');
        $(`[data-progress-assigned="${userName}"]`).attr('id', 'goalMet');
        $span = $(`[data-name="${userName}"`);
        $h3Width = Number($span.parent().css('width').replace('px', ''));
        $spanWidth = Number($span.css('width').replace('px', ''));
        animationWidth = '-' + String((($h3Width - $spanWidth) - 55)) + 'px';
        $(`[data-sheep-animation="${userName}"`).attr({'style': `transform: translate(${animationWidth}); transition: transform 10s;`})                                                          
    } else {
        $(`[data-sheep-animation="${userName}"`).addClass('hide');
        $(`[data-progress-assigned="${userName}"]`).removeAttr('id');
    }
}

function goalAchieved() {
    for (var i=0; i < 150; i++) {
        xAxis = String(Math.random() * $('[data-wrapper]').prop('clientWidth') + 2000) + 'px';
        yAxis = String(Math.random() * $('[data-wrapper]').prop('clientHeight')) + 'px';
        sheepImg = $('<img>').attr({'data-goal-achieved': '', 
                                    'src': 'stylesheets/sheepy.gif', 
                                    'style': `position: absolute; z-index: 1; bottom: ${yAxis}; left: ${xAxis}`
                                    }).appendTo('body');
    }
    $('[data-goal-achieved]').addClass('translate-screen');
    goalsAchieved = 1;
    runAnimation = false;
    //Delete images after 30 seconds
    setTimeout(function(){
        $('[data-goal-achieved]').remove();
    }, 30000);
}


$(document).ready(function(){
    setInterval(function(){
    var ticketsSolved = 0;
    var ticketsAssigned = 0;

    $.get('/userRecords', function(data){
        $.each(JSON.parse(data), function(userAction, userObject){
            $.each(userObject, function(userName, value){
                if (userAction === "assigned") {goalValidation(userName, value)}
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
        var newGoal;
        if (data != "No data") {
            data.ticketsCompleted === "0" ? newGoal = true : newGoal = false;
            if (newGoal && data.ticketsCompleted != 0) {runAnimation = true};
            var goalHour = data.time.slice(0, 2);
            var goalMinutes = data.time.slice(3);
            var goalTime = new Date();
            goalTime.setHours(goalHour);
            goalTime.setMinutes(goalMinutes);
            var currentTime = new Date();
            var currentTimeAMPM = formatAMPM(currentTime);
            var ticketsRemaining = Number(data.ticketNumber) - Number(data.ticketsCompleted);
            $('[data-time]').text(" " + currentTime.toDateString() + " " + currentTimeAMPM);
            $('[data-goals]').text(` ${data.ticketNumber} Tickets`);
            $('[data-goal-time]').text(` ${formatAMPM(goalTime)}`);
            $('[data-counter]').text(` ${ticketsRemaining}`);
            $('[data-div-goals]').removeClass('hidden');
            $('[data-time]').removeClass('hidden');
            if ((goalsAchieved === 1) && !newGoal) {
                $('[data-goal-achieved-icon]').remove();
                $('<i class="fa fa-check" aria-hidden="true" style="color: #00c199"></i> data-goal-achieved-icon').prependTo($('[data-goals]'))
                $('<i class="fa fa-check" aria-hidden="true" style="color: #00c199"></i> data-goal-achieved-icon').prependTo($('[data-goal-time]'))
                $('<i class="fa fa-check" aria-hidden="true" style="color: #00c199" data-goal-achieved-icon></i>').prependTo($('[data-counter-div]'));
                $('[data-goals]').removeClass().addClass('goal-achieved');
                $('[data-goal-time]').removeClass().addClass('goal-achieved');
                $('[data-counter-div]').removeClass().addClass('goal-achieved');
            } else {
                $('[data-goal-achieved-icon]').remove();
                $('[data-goals]').addClass('goal');
                $('[data-goal-time]').addClass('time');
                $('[data-counter-div]').addClass('counter-div');
            }
            //Change tickets remaining font color to color associated with the goal ticket type
            data.ticketType === "solved" ? $('[data-counter]').attr({"style": "color: #bed686"}) : $('[data-counter]').attr({"style": "color: #00A2FF"})
            //Check if group goal is completed
            if (data.ticketType === "solved" && data.ticketsCompleted >= data.ticketNumber && currentTime <= goalTime && runAnimation) {
                goalAchieved();
            } else if (data.ticketType === "assigned" && data.ticketsCompleted >= data.ticketNumber && currentTime <= goalTime && runAnimation) {
                goalAchieved();
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
                    tdImg = $('<td>').addClass('picture-size col-md-1').attr({'data-image': object.name, 'id': 'no-table'});
                    tdInfo = $('<td>').addClass('col-md-5').attr({'data-info': object.name, 'id': 'table-mobile'});
                    $('tbody tr:last').append(tdImg, tdInfo);
                    $('<img>').attr('src', object.imgSrc).appendTo(tdImg);
                    $(`<h3><span data-name="${object.name}">${object.name}</span><img src="stylesheets/sheepy.gif" data-sheep-animation="${object.name}" class="hide"></h3>`).appendTo(tdInfo);
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