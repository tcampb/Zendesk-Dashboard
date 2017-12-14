$('form').on('submit'), function(event){
    event.preventDefault();
    $('#test').attr("value")
    var formData = JSON.stringify($('#test').attr(value));
    console.log(form);
    console.log(formData);

    $.ajax({
        type: 'POST',
        url: '/post',
        data: formData
    });
};