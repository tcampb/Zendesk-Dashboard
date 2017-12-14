$(document).ready(function(){
    setInterval(function(){
    // $.get('/userRecords', function(data){
    //     console.log(JSON.parse(data));
    //     $.each(JSON.parse(data), function(key, value){
    //         $(`[data-user="${key}"`).text(`${value}`);

    //     });

    $.get('/userRecords', function(data){
        $.each(JSON.parse(data), function(userAction, userObject){
            $.each(userObject, function(userName, value){
                if (userName === "Hannah Tatum") {
                var maxValue = $(`[data-progress-${userAction}="${userName}"]`).attr('aria-valuemax');
                $(`[data-progress-${userAction}="${userName}"`).attr({
                                                                  "aria-valuenow": `${value}`,
                                                                  "style": `width: ${(value / maxValue) * 100}%`
                                                                 });
                    
                                                                }

            });
        });
    });
    $.get('/dailyGoal', function(data){
        var data = JSON.parse(data);
        $('.footer').text(`Daily Goal: ${data.ticketNumber} ${data.ticketType} ticket's by ${data.time}`);

    })
    }, 1000);
});