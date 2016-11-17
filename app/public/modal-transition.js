$(document).ready(function(){
  function createTutorCard(name, price, rating, pic, email, sender, link) {
    a = $('<a></a>');
    a.addClass('collection-item avatar');
    a.on('click', function(event){
      notify(email, sender, link);
      $("#tutors").hide();
      $("#request").show();
      $("#loading-message").text("Contacting " + name + ' ...');
    });
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

  function notify(email, sender, link) {
    socket.emit('send notification', email, sender, link);
    console.log("sending a notification to: " + email);
  }

  function accept(email, sender) {
    socket.emit('send accept', "tmweppne@buffalo.edu", "zmwieand@buffalo.edu");
  }

  function decline(email, sender) {
    socket.emit('send decline', email, sender);
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
          if (res.length == 0) {
              $("#area-tutors").append("<p class='center-align'>" +
                  "<i>Sorry, there are no tutors in your area at this time" +
                  "<br>Please try again later</i>.</p>");
          }
          for (var i in res) {
              var tutor = res[i];
              $('#area-tutors').append(createTutorCard(
                  tutor["first_name"]+ ' ' + tutor["last_name"],
                  tutor['price'],
                  tutor['rating'],
                  tutor['pic'],
                  tutor['email_address'],
                  tutor['sender'],
                  tutor['sender_pic']
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

  $('#accept-btn').on('click', function(event) {
    accept("email", "sender");
  });
  
  $('#decline-btn').on('click', function(event) {
    decline("email", "sender");
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
    socket.emit('send start session');
    
    $('#stop-btn').attr('disabled', false);
    $('#cancel-btn').attr('disabled', true);
    $('#start-btn').attr('disabled', true);
  });

  $('#stop-btn').attr('disabled', true);

  $('#stop-btn').click(function() {
    socket.emit('send end session');
    
  });

});
