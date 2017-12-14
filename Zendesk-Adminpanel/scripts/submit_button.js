// Submit Button with animation
var basicTimeline = anime.timeline({
    autoplay: false
  });
  
  var pathEls = $(".check");
  for (var i = 0; i < pathEls.length; i++) {
    var pathEl = pathEls[i];
    var offset = anime.setDashoffset(pathEl);
    pathEl.setAttribute("stroke-dashoffset", offset);
  }
  
  basicTimeline
    .add({
      targets: ".text",
      duration: 1,
      opacity: "0"
    })
    .add({
      targets: ".button",
      duration: 1300,
      height: 20,
      width: 300,
      backgroundColor: "#00A2FF",
      border: "0",
      borderRadius: 100
    })
    .add({
      targets: ".progress-bar",
      duration: 2000,
      width: 300,
      easing: "linear"
    })
    .add({
      targets: ".button",
      width: 0,
      duration: 1
    })
    .add({
      targets: ".progress-bar",
      width: 80,
      height: 80,
      delay: 500,
      duration: 750,
      borderRadius: 80,
      backgroundColor: "#00A2FF"
    })
    .add({
      targets: pathEl,
      strokeDashoffset: [offset, 0],
      duration: 200,
      easing: "easeInOutSine"
    });
     
  $(".button").click(function() {
    basicTimeline.play();
  });
  
  $(".text").click(function() {
    basicTimeline.play();
  });