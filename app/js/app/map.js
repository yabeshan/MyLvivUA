
var gMap, panorama;
var directionsService, directionsDisplay;
var geocoder;
var cityForSearch = 'Львiв, ';
var latLviv = 49.840191;
var lonLviv = 24.029277;
var userCoord = {'lat':latLviv, 'lon':lonLviv}, infowindow = null;

function viewInfoWindow(content, lat, lon) {
    var mapZoom = 16;
    var flag = window.window.location.toString().indexOf("Nick_work")>0;
    if (flag || lat==null || lon==null) {
        lat = userCoord.lat;
        lon = userCoord.lon;
        mapZoom = 16;
    }
    var coord = new google.maps.LatLng ( lat, lon );
    infoWindow = new google.maps.InfoWindow();
    if (gMap==null) {
        mapContainerInit(coord, mapZoom);
    } else {
        gMap.setCenter(coord);
        gMap.setZoom( mapZoom );
    }

    var options = {
        map: gMap,
        position: coord,
        content: content
    };

    closeInfoWindow();
    infowindow = new google.maps.InfoWindow(options);
}

function closeInfoWindow() {
    if (infowindow) {
        infowindow.close();
    }
}

function mapInit() {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var lat=position.coords.latitude;
            var lon=position.coords.longitude;

            userCoord = {'lat':lat, 'lon':lon};
            viewInfoWindow("<strong>You are here. &nbsp; &nbsp;</strong>", lat, lon);
        }, function(error){
            viewInfoWindow("<strong>Error: The Geolocation service failed. </strong>");
        }, { timeout: 12000 });
    } else{
        viewInfoWindow("<strong>Error: Your browser doesn\'t support geolocation. </strong>");
    }

    $('#change-arrow-1').click(function(ev) {
        swipeInput(this);
    });
    $('#change-arrow-2').click(function(ev) {
        swipeInput(this);
    });
    $('#change-arrow-3').click(function(ev) {
        swipeInput(this);
    });
    $('#change-arrow-4').click(function(ev) {
        swipeInput(this);
    });
    $('#change-arrow-5').click(function(ev) {
        swipeInput(this);
    });
    $('#change-arrow-6').click(function(ev) {
        swipeInput(this);
    });
}

function mapContainerInit(coord, mapZoom) {
    Marker.init();

    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var latlng = new google.maps.LatLng( userCoord.lat, userCoord.lon );

    var mapOptions = {
        center: coord || latlng,
        scrollWheel: false,
        streetViewControl:false,
        zoom: mapZoom || 13
    };
    gMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    panorama = gMap.getStreetView();
    panorama.setPosition( latlng );
    panorama.setPov(({
        heading: 265,
        pitch: 0
    }));
    searchMarker = new google.maps.Marker({
        map: gMap,
        anchorPoint: new google.maps.Point(0, -29)
    });
    searchMarker.setVisible(false);

    searchFiledsDefault();

    var input = (document.getElementById('pac-input'));
    new google.maps.places.SearchBox( input );

    autocompleteSearchPanel = new google.maps.places.Autocomplete(input);
    autocompleteSearchPanel.setComponentRestrictions({'country': 'ua'});
    google.maps.event.addListener(autocompleteSearchPanel, 'place_changed', searchBoxHandler);

    input = (document.getElementById('start-input'));
    new google.maps.places.SearchBox( input );
    new google.maps.places.Autocomplete(input).setComponentRestrictions({'country': 'ua'});
    input = (document.getElementById('end-input'));
    new google.maps.places.SearchBox( input );
    new google.maps.places.Autocomplete(input).setComponentRestrictions({'country': 'ua'});
    input = (document.getElementById('point-input-1'));
    new google.maps.places.SearchBox( input );
    new google.maps.places.Autocomplete(input).setComponentRestrictions({'country': 'ua'});
    input = (document.getElementById('point-input-2'));
    new google.maps.places.SearchBox( input );
    new google.maps.places.Autocomplete(input).setComponentRestrictions({'country': 'ua'});
    input = (document.getElementById('point-input-3'));
    new google.maps.places.SearchBox( input );
    new google.maps.places.Autocomplete(input).setComponentRestrictions({'country': 'ua'});
    input = (document.getElementById('point-input-4'));
    new google.maps.places.SearchBox( input );
    new google.maps.places.Autocomplete(input).setComponentRestrictions({'country': 'ua'});
    input = (document.getElementById('point-input-5'));
    new google.maps.places.SearchBox( input );
    new google.maps.places.Autocomplete(input).setComponentRestrictions({'country': 'ua'});
}

function swipeInput( inp ) {
    var id = Number( inp.id.slice(13) )-1,
        currInput = inp.parentNode.childNodes[1],
        val = currInput.value;

    for (id; id>=0; id--) {
        var prevID = (id>0) ? "point-input-" + id : "start-input";
        prevInput = (document.getElementById( prevID )),
            prevInputVisible = prevInput.parentNode.style.display == "none";

        if (!prevInputVisible) {
            currInput.value = prevInput.value;
            prevInput.value = val;
            break;
        }
    }
}

var searchMarker = null;
var autocompleteSearchPanel;
function searchBoxHandler ( ev ) {
    if (autocompleteSearchPanel && !ev) {
        var place = autocompleteSearchPanel.getPlace();
        if ( place ) {
            searchBoxViewResult (place);
            return;
        }
    }
    startGeocoderPosition( $("#pac-input").val(), searchBoxViewResult );
}

function startGeocoderPosition(result, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address' : result}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            position = new google.maps.LatLng(lat, lng);

            if (callback) {
                callback(results[0]);
            }
        } else {
            alert('Результатів не знайдено!')
        }
    });
}

function searchBoxViewResult (place) {
    hideSearchPanel();
    searchMarker.setVisible(false);

    if (place.geometry.viewport) {
        gMap.fitBounds(place.geometry.viewport);
    } else {
        gMap.setCenter(place.geometry.location);
        gMap.setZoom(17);
    }

    if (place.icon) {
        searchMarker.setIcon({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        });
        searchMarker.setVisible(true);
    }

    searchMarker.setPosition(place.geometry.location);
    var name = "", arr = place.address_components;
    if (place.name) {
        name = place.name
    } else if (arr && arr.length>0 ) {
        var k= 0, lng = arr.length;
        for (k;k<lng;k++) {
            name += arr[k].long_name +", "
        }
        name = name.substr(0,name.length-2);
    } else {
        name = cityForSearch;
    }

    closeInfoWindow();
    infoWindow.setContent('<div><strong>' + name + '</strong><br>');
    infoWindow.open(gMap, searchMarker);
}

var redMarkerArr=null;
var redMarkerImageArr = ['../app/img/marker/redA.png','../app/img/marker/redB.png','../app/img/marker/redC.png','../app/img/marker/redD.png','../app/img/marker/redE.png','../app/img/marker/redF.png','../app/img/marker/redG.png','../app/img/marker/redH.png','../app/img/marker/redI.png','../app/img/marker/redJ.png','../app/img/marker/redK.png','../app/img/marker/redL.png'];
function addRedMarkers(myRoute) {
    var markerZIndex = 10000000;
    if (redMarkerArr!=null) removeRedMarkers();
    redMarkerArr = [];

    var marker = new google.maps.Marker({
        position: myRoute.legs[0].start_location,
        map: gMap,
        icon: redMarkerImageArr[redMarkerArr.length],
        zIndex:markerZIndex
    });
    redMarkerArr.push(marker);

    /*
     var k=0, arr = myRoute.legs, lng = arr.length-1;
     for (k;k<lng;k++) {
     marker = new google.maps.Marker({
     position: arr[k].end_location,
     map: map,
     icon: that.redMarkerImageArr[that.redMarkerArr.length],
     zIndex:markerZIndex
     });
     console.log("middle    "+ that.redMarkerImageArr[that.redMarkerArr.length]);
     that.redMarkerArr.push(marker);
     }
     */

    var k=0, arr = myRoute.legs, lng = arr.length-1;
    for (k;k<lng;k++) {
        marker = new google.maps.Marker({
            position: arr[k].end_location,
            map: gMap,
            icon: redMarkerImageArr[redMarkerArr.length],
            zIndex:markerZIndex
        });
        redMarkerArr.push(marker);
    }

    marker = new google.maps.Marker({
        position: myRoute.legs[ myRoute.legs.length-1 ].end_location,
        map: gMap,
        icon: redMarkerImageArr[redMarkerArr.length],
        zIndex:markerZIndex
    });
    redMarkerArr.push(marker);
}

function removeRedMarkers() {
    if (redMarkerArr==null) return;

    var k= 0, arr = redMarkerArr, lng = arr.length;
    for (k; k<lng; k++) {
        arr[k].setMap(null);
    }
    redMarkerArr = null;

    k= 0, arr = Marker.childs, lng = arr.length;
    for (k; k<lng; k++) {
        arr[k].model.viewRoute = null;
    }
}

function viewRadiusStations(myRoute) {
    var point=myRoute.overview_path[0], marker, posx, posy, dist;
    var k = 1, arr = myRoute.overview_path, lng = arr.length, routeMarker=[];
    for (k; k<lng; k++) {
//        posx = Math.pow( Math.abs( point.lat() - arr[k].lat() ), 2);
//        posy = Math.pow( Math.abs( point.lng() - arr[k].lng() ), 2);
//        dist = Math.sqrt(posx+posy);
        dist = latlng2distance( point.lat(), point.lng(), arr[k].lat(), arr[k].lng() );
        if (dist>80) {
            routeMarker.push( point );
            point=arr[k];
        }
    }
    routeMarker.push( point );
    if(routeMarker.length>0) {
        var m = 0, arr = routeMarker, lng = arr.length;
        for (m; m<lng; m++) {
            findRadiusMarkers( routeMarker[m].lat(), routeMarker[m].lng() );
        }
    }
}

function findRadiusMarkers( startX, startY ) {
    var k= 0, arr = Marker.childs, lng = arr.length, coordx, coordy, posx, posy, dist;
    for (k; k<lng; k++) {
        coordx = arr[k].model.lat;
        coordy = arr[k].model.lng;

//        posx = Math.pow( Math.abs(startX-coordx), 2);
//        posy = Math.pow( Math.abs(startY-coordy), 2);
//        dist = Math.sqrt(posx+posy);
        dist = latlng2distance( startX, startY, coordx, coordy );

        if (dist>100 && arr[k].model.viewRoute!=true) {
            arr[k].setMap(null);
        } else {
            arr[k].model.viewRoute=true;
            arr[k].setMap(gMap);
        }
    }
}

function clearRoad() {
    hidePopup();
    Marker.showAll();

    if (directionsDisplay!=null) {
        directionsDisplay.setDirections({ routes: [] });
        removeRedMarkers();
    }

    searchFiledsDefault();

    document.getElementById('point-input-1').parentNode.style.display="none";
    document.getElementById('point-input-2').parentNode.style.display="none";
    document.getElementById('point-input-3').parentNode.style.display="none";
    document.getElementById('point-input-4').parentNode.style.display="none";
    document.getElementById('point-input-5').parentNode.style.display="none";
}

function searchFiledsPanelDefault() {
    document.getElementById('pac-input').value = cityForSearch;
}
function searchFiledsDefault() {
    searchFiledsPanelDefault();
    document.getElementById('start-input').value = cityForSearch;
    document.getElementById('end-input').value = cityForSearch;
    document.getElementById('point-input-1').value = cityForSearch;
    document.getElementById('point-input-2').value = cityForSearch;
    document.getElementById('point-input-3').value = cityForSearch;
    document.getElementById('point-input-4').value = cityForSearch;
    document.getElementById('point-input-5').value = cityForSearch;
}

function toggleMapView (val) {
    gMap.setMapTypeId( val );
}

function tooglePanorama(flag) {
    panorama.setPosition( gMap.getCenter() );
    panorama.setVisible(flag);
}

function initRouteBuilder() {
    closeInfoWindow();
    var start = document.getElementById('start-input').value;
    var end = document.getElementById('end-input').value;
    var point1 = document.getElementById('point-input-1').value;
    var point2 = document.getElementById('point-input-2').value;
    var point3 = document.getElementById('point-input-3').value;
    var point4 = document.getElementById('point-input-4').value;
    var point5 = document.getElementById('point-input-5').value;

    startRouteBuilder( start, end, point1, point2, point3, point4, point5 );
}

function startRouteBuilder( start, end, point1, point2, point3, point4, point5) {
    if( start.length<10 || end.length<10 ) {
        alert("Please enter correct Start and Destination Points");
        return;
    }

    var waypts = [];
    if (point1 && point1.length>10) waypts.push({location:point1, stopover:true});
    if (point2 && point2.length>10) waypts.push({location:point2, stopover:true});
    if (point3 && point3.length>10) waypts.push({location:point3, stopover:true});
    if (point4 && point4.length>10) waypts.push({location:point4, stopover:true});
    if (point5 && point5.length>10) waypts.push({location:point5, stopover:true});

//    waypts.reverse();
    var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.WALKING
    };

    directionsService.alternatives = true;
    directionsService.route(request, function (response, status) {

        if (status == google.maps.DirectionsStatus.OK) {
            hidePopup();
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap( gMap );
            directionsDisplay.setOptions( { suppressMarkers: true } );
//            $("#popup-route-banner").empty();
//            directionsDisplay.setPanel(document.getElementById("popup-route-banner"));

            /*
            var route = response.routes[0];
            var totalDistanse = 0;
            var totalTime = 0;

            for (var i = 0; i < route.legs.length; i++) {
                totalDistanse += route.legs[i].distance.value;
                totalTime += route.legs[i].duration.value;
            }

            var hoursRoute = Math.floor( totalTime / 3600 );
            var minsRoute = Math.ceil( (totalTime-hoursRoute*3600)/60 );

            Ext.get('tp-details-title').dom.innerHTML = 'Trip Details ('+ Math.ceil(totalDistanse/1610) +'mi, '+ hoursRoute +'h '+ minsRoute+'mins)';
            Ext.get('listToTripBtn').dom.innerHTML = 'Trip Details ('+ Math.ceil(totalDistanse/1610) +'mi, '+ hoursRoute +'h '+ minsRoute+'mins)';
            document.getElementById ('listToTripBtn').style.visibility = "visible";
            var distanseBetweenMarkers = Math.max(1000, Math.round(totalDistanse / 100));

            Ext.getCmp('tripPlaner').addRedMarkers(response.routes[0]);
            //                Ext.getCmp('tripPlaner').viewRadiusStations(response.routes[0]);
*/
            addRedMarkers(response.routes[0]);
            viewRadiusStations(response.routes[0]);
        } else {
            var message = status + '. Please enter correct Start and Destination Points';
            alert(message);
        }

    });

}

function convertCoortToPosition( input, name, lat, lng, callback) {
    var latlng = new google.maps.LatLng( lat, lng );
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results[0]) {
            input.val( name +", "+ results[0].formatted_address );
            if (callback) callback();
            return true;
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });
    return false;
}
