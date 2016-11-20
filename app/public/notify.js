socket.on('notification', function(email, status, data, link) {
  if (status) {
    $('#notification-modal').openModal();
    $('#name').text(email);
    $('#location').text("Capen Libray Room 16");
    $('#subject').text("Assignment 3");
    $('#image').attr('src', link);

    $("#accept-btn").on('click', function(event) {
        console.log("accepting");
        socket.emit('send accept', email);
    });

    $("#decline-btn").on('click', function(event) {
        console.log('declining');
        socket.emit('send decline', email);
    });
  }
  Push.create("Update from tutr!", {
    body: email + data,
    icon: '/img/tutrlogo.png',
    timeout: 10000,
    onClick: function () {
        window.focus();
        this.close();
    }
  });
});

socket.on('student accept', function(name) {
    // TODO: show the tutors location to the student
    Materialize.toast(name + " is on the way", 4000);
});

socket.on('tutr_error', function(message) {
    Materialize.toast(message, 4000);
});

socket.on('tutor accept', function() {
    // TODO show student location to the student
    $('.fixed-action-btn').show();
});

socket.on('decline', function() {
    $('#denied-modal').openModal();
    $('#denied-message').text("Looks like your tutor cannot make it.");
});

socket.on('start session', function() {
    Materialize.toast('Your session has started', 4000);
});

socket.on('end session', function(price) {
    $('.fixed-action-btn').hide();
    $('#rating-modal').openModal();
    $('#price').text("$" + price);
})
