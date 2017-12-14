var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Anna", "Joelle", "Amanda", "Brett", "Tyler", "Tope"],
        datasets: [{
            label: '# of tickets',
            data: [1, 4, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(0, 162, 255, 0.2)',
                'rgba(0, 162, 255, 0.2)',
                'rgba(0, 162, 255, 0.2)',
                'rgba(0, 162, 255, 0.2)',
                'rgba(0, 162, 255, 0.2)',
                'rgba(0, 162, 255, 0.2)'
            ],
            borderColor: [
                'rgba(0, 0, 0, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(0, 0, 0, 1)',
                'rgba(0, 0, 0, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        layout: {
           
        
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    }
});

// var egg = $("[easter-egg]");
// egg.on("click", function easterEgg() {

// });

