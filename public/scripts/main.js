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
                if (userName === "Hannah Tatum") {
                var maxValue = $(`[data-progress-${userAction}="${userName}"]`).attr('aria-valuemax');
                $(`[data-progress-${userAction}="${userName}"`).attr({
                                                                  "aria-valuenow": `${value}`,
                                                                  "style": `width: ${(value / maxValue) * 100}%`
                                                                 });
                $(`[data-span-${userAction}="${userName}"`).text(`${value}`);
                                                                }

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
        $('.time').text(currentTime.toDateString() + " " + currentTimeAMPM);
        $('.footer').text(`Daily Goal: ${data.ticketNumber} ${data.ticketType} ticket's by ${formatAMPM(goalTime)}`);
        if (data.ticketType === "solved" && ticketsSolved >= data.ticketNumber && currentTime <= goalTime) {
            // CSS animations
        } else if (data.ticketType === "assigned" && ticketsAssigned >= data.ticketNumber && currentTime <= goalTime) {
            // CSS animations
        }
    })

    }, 1000);
});