var map;
var marker;
var myLatLng = {
    lat: 42.9977999,
    lng: -78.7882364
};

var directionsService;
var directionsDisplay;


function initMap() {

  var mapDiv = document.getElementById('map');
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  map = new google.maps.Map(mapDiv, {
    zoom: 17,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: false
  });

  marker = new google.maps.Marker({
    // position: myLatLng,
    map: map
  });

  marker.addListener('click', function() {
    $("#account-modal").openModal({
        complete: function () {
            $('#tutors').hide();
            $('#request').hide();
            $('#account').show();
            $('#area-tutors').empty();
        }
    });
  });

  directionsDisplay.setMap(map);
  $.ajax({
      url: URL + "/users/get_location",
      type: 'GET',
      success: function(pos) {
          // Materialize.toast("You are now an available Tutor!", 5000)
          console.log('done');
          // var s = ()pos.lat;
          // var q = pos.lng
          var s = new google.maps.LatLng(parseFloat(pos.lat), parseFloat(pos.lng));
          marker.setPosition(s);
          map.setCenter(s);
      }
  });
}


function findCenter(lat1, long1, lat2, long2) {
    return {
        lat: (lat1 + lat2) / 2,
        lng: (long1 + long2) / 2
    };
}


function calculateAndDisplayRoute(start, end) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'WALKING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}


function tutorClick() {

    $('#tutors').hide();
    $('#request').show();
    $("#loading-message").text("Contacting Jian Yang ...");

    window.setTimeout(function() {
        $('#account-modal').closeModal(function() {});
        var tutorLocation = {
            lat: 42.999999,
            lng: -78.78891
        };
        var center = findCenter(tutorLocation["lat"], tutorLocation["lng"],
            myLatLng["lat"], myLatLng["lng"]);

        window.setTimeout(function() {
            map.setZoom(16);
            map.setCenter(center);
            var tutorMarker;
            window.setTimeout(function() {
                tutorMarker = new google.maps.Marker({
                    position: tutorLocation,
                    map: map,
                    animation: google.maps.Animation.DROP
                });
                tutorMarker.addListener('click', function() {
                    $('#rating-modal').openModal(function() {});
                });
                Materialize.toast("Jian Yang is on his way!", 4000);
            }, 1000);
        }, 200);
    }, 2000);
}
