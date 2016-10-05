$(document).ready(function(){
  $("#tutors").hide();
  $("#request").hide();
  $("button").click(function() {
    $("#account").hide();
    $("#request").show();
    $("#loading-message").text("Finding Tutor's in your area ...");
    setTimeout(function() {
      $("#request").hide();
      $("#tutors").show();
      Materialize.showStaggeredList('#staggered-test');
    }, 3000);
  });
});