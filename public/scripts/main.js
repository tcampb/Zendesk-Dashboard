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
        var goalHour = data.time.slice(0, 2);
        var goalMinutes = data.time.slice(3);
        var goalTime = new Date();
        goalTime.setHours(goalHour);
        goalTime.setMinutes(goalMinutes);
        var currentTime = new Date();
        var currentTimeAMPM = formatAMPM(currentTime);
        $('[data-time]').text(currentTime.toDateString() + " " + currentTimeAMPM);
        $('[data-goals]').text(`Daily Goal: ${data.ticketNumber} ${data.ticketType} ticket's by ${formatAMPM(goalTime)}`);
        if (data.ticketType === "solved" && ticketsSolved >= data.ticketNumber && currentTime <= goalTime) {
            // CSS animations
        } else if (data.ticketType === "assigned" && ticketsAssigned >= data.ticketNumber && currentTime <= goalTime) {
            // CSS animations
        }
    })

    $.get('/currentUsers', function(data){
        var data = JSON.parse(data);
        var objectArray = Object.values(data);
        var tbody = $('tbody');
       
        $.each(objectArray, function(index, object){
            if ($(`[data-progress-assigned = "${object.name}"]`).length === 0) {
                if (index % 2 === 0) {row = tbody.append($(`<tr>`))}
                    tdImg = $('<td>').addClass('picture-size col-md-1').appendTo(row);
                    tdInfo = $('<td>').addClass('col-md-5').appendTo(row);
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
                });
        }); 
    }, 1000);
});