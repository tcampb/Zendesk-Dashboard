$(document).ready(function(){

    while (true) {
    setTimeout(function(){
       


    $.get('/userRecords', function(data){
        console.log(JSON.parse(data));
        $.each(JSON.parse(data), function(key, value){
            if (key === "Hannah Tatum") {
                $(`[data-user="${key}"`).text(`${value}`);
    }
        });

    });
    


    }, 1000);
}
});