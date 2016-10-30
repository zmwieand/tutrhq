socket.on('notification', function(email, status, data) {
  if (status)
    $('.notify').click();
  Push.create("Update from tutr!", {
    body: email + data,
    icon: '/img/tutrlogo.png',
    timeout: 4000,
    onClick: function () {
        window.focus();
        this.close();
    }
});
});
