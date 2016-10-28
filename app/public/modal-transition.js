$(document).ready(function(){
  function createTutorCard(name, price, rating, pic) {
    a = $('<a></a>');
    a.addClass('collection-item avatar');

    img = $("<img>");
    img.addClass('circle');
    img.attr("src", pic);

    s = $('<span></span>');
    s.addClass('title');
    s.text(name);

    p = $('<p></p>');
    p.text('$' + price +'/hr');

    h5 = $('<h5></h5>');
    h5.addClass('secondary-content');
    h5.text(rating);

    a.append(img);
    a.append(s);
    a.append(p);
    a.append(h5);

    return a;
  }

  $("#tutors").hide();
  $("#request").hide();
  $(".eng").click(function() {
    $("#account").hide();
    $("#request").show();
    $("#loading-message").text("Finding Tutor's in your area ...");
    
    $.ajax({
      url: "http://localhost:3000/match/request_tutor",
      type: 'GET',
      success: function(res) {
          console.log(res);
          for (var i in res) {
              var tutor = res[i];
              $('#area-tutors').append(createTutorCard(
                  tutor["first_name"]+ ' ' + tutor["last_name"],
                  tutor['price'],
                  tutor['rating'],
                  tutor['pic']
              ));
          }

          // render the tutors
          $('#request').hide();
          $("#tutors").show();
      }
    });
  });

  var new_course = '<div class="row">' +
                        '<div class="col s10">' +
                            '<select class="browser-default" name="course">' +
                                '<option disabled selected>Select your course</option>' +
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

  $('#tutor-switch').on('click', function(){
    if ($(this).is(":checked")) {
        $.ajax({
            url: "http://localhost:3000/users/tutor_online",
            type: 'GET',
            success: function(res) {
                Materialize.toast("You are now an available Tutor!", 5000)
            }
        });
    } else {
        $.ajax({
            url: "http://localhost:3000/users/tutor_offline",
            type: 'GET',
            success: function(res) {
                Materialize.toast("You are now offline", 5000)
            }
        });
    }
  });

  // notification buttons
  $('.fixed-action-btn').hide();
  
  $('#accept-btn').click(function(){
    $.ajax({
      url: "http://localhost:3000/match/accept",
      type: 'GET',
      success: function(res) {
      }
    });
    $('.fixed-action-btn').show();
  });

  // timer
  var seconds = 0;
  var minutes = 0;
  var hours = 0;
  var t;

  function add() {
    seconds++;
    if (seconds > 60) {
        seconds = 0;
        minutes++;
        if (minutes > 60) {
            minutes = 0;
            hours++;
        }
    }

    $('#tutor-timer')[0].textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
  }

  function timer() {
    t = setTimeout(add, 1000);
  }
  
  // timer buttons
  $('#start-btn').click(function() {
    $.ajax({
      url: "http://localhost:3000/match/start",
      type: 'GET',
      success: function(res) {
          Materialize.toast("Session Started", 5000)
      }
    });

    timer();
    $('#stop-btn').attr('disabled', false);
    $('#cancel-btn').attr('disabled', true);
    $('#start-btn').attr('disabled', true);
  });
  
  $('#stop-btn').attr('disabled', true);

  $('#stop-btn').click(function() {
    $.ajax({
      url: "http://localhost:3000/match/stop",
      type: 'GET',
      success: function(res) {
          Materialize.toast("Session over", 5000)
      }
    });
    clearTimeout(t);
    $('.fixed-action-btn').hide();

  });

});
