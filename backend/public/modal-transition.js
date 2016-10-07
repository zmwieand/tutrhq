$(document).ready(function(){
  $("#tutors").hide();
  $("#request").hide();
  $(".eng").click(function() {
    $("#account").hide();
    $("#request").show();
    $("#loading-message").text("Finding Tutor's in your area ...");
    setTimeout(function() {
      $("#request").hide();
      $("#tutors").show();
      Materialize.showStaggeredList('#staggered-test');
    }, 3000);
  });

  var new_course = '<div class="row">' +
                        '<div class="col s10">' +
                            '<select class="browser-default" name="course">' +
                                '<option disabled>Select the course</option>' +
                                '<option value="CSE 115">CSE 115</option>' +
                                '<option value="MTH 141">MTH 141</option>' +
                                '<option value-"UGC 112">UGC 112</option>' +
                                '<option value="ENG 101">ENG 101</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="col s2">' +
                            '<a class="btn red remove_course_button">' +
                                '<i class="material-icons">close</i>' +
                            '</a>' +
                        '</div>' +
                   '</div>'
  
  $('#add_course_button').click(function(e) {
    e.preventDefault();
    $('.wrapper').append(new_course);
    x += 1;
  }); 

  $('.wrapper').on('click', '.remove_course_button', function(e){
    e.preventDefault();
    // This is a cheap hack
    $(this).parents('div')[1].remove();
  });
});
