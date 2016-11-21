socket.on('notification', function(email, status, data, link) {
  if (status) {
    $('#notification-modal').openModal();
    $('#name').text(email);
    $('#location').text("Capen Libray Room 16");
    $('#subject').text("Assignment 3");
    $('#image').attr('src', link);

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
