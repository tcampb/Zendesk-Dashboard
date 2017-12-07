$(document).ready(function(){
    setInterval(function(){
    $.get('/userRecords', function(data){
        console.log(JSON.parse(data));
        $.each(JSON.parse(data), function(key, value){
            $(`[data-user="${key}"`).text(`${value}`);
        });
    
    });
    }, 1000);
});