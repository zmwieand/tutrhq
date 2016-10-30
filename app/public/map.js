var map;
var myLatLng = {
    lat: 42.9977999,
    lng: -78.7882364
};

function initMap() {

    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: myLatLng,
        zoom: 17
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });

    marker.addListener('click', function() {
        $("#account-modal").openModal(function() {
            console.log("HERE")
        });
    });
}

function findCenter(lat1, long1, lat2, long2) {
    return {
        lat: (lat1 + lat2) / 2,
        lng: (long1 + long2) / 2
    };
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
