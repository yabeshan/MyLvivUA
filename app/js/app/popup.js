
var Popup = {

    init: function() {
        Popup.initTopMenu();
        Popup.initBottomMenu();
        Popup.initInfoPopup();
        Popup.initSettings();
    }
}

Popup.initTopMenu = function() {

// SHOW
    $("#btn-around").click(function() {
        viewPanelMarker();
    });
    $("#btn-list-tours").click(function() {
        viewPanelListTours();
    });
    $("#btn-list-single").click(function() {
        viewPanelListTours();
    });
    $("#btn-search").click(function() {
        Popup.viewSearchPanel();
    });

// HIDE
    $("#panel-marker").click(function(ev) {
        if(ev.target.className!="map-dark-button" && ev.target.parentNode.className!="map-dark-button") {
            hidePanelMarker();
        }
    });
    $("#panel-marker-detals").click(function(ev) {
        if(ev.target.className!="map-dark-button" && ev.target.parentNode.className!="map-dark-button") {
            hidePanelMarkerDetails();
        }
    });
    $("#panel-marker-list").click(function(ev) {
        if(ev.target.className!="panel-marker-list-item") {
            hidePanelMarkerList();
        }
    });
    $("#panel-tours-list").click(function(ev) {
        if(ev.target.className=="row") {
            hidePanelListTours();
        }
    });
}

Popup.initBottomMenu = function() {
// SHOW POPUPS
    $('#popup-settings').draggable();
    $("#btn-settings").click(function() {
        viewPopup("settings");
    });
    $("#btn-trip-planner").click(function() {
        viewPopup("trip-planner");
    });
    $('#popup-route-builder').draggable();
    $("#btn-route-builder").click(function() {
        openRouteBuilerPopup();
    });
    $("#popup-route-builder-add-point").click(function() {
        addPointRouteBuilder();
    });
    $(".popup-route-builder-input-holder-delete-icon").click(delPointRouteBuiler);
    $(".popup-route-builder-input-holder-delete-txt").click(delPointTxtRouteBuiler);

    $("#popup-route-builder-start").click(function() {
        initRouteBuilder();
    });
    $("#btn-note").click(function() {
        viewPopup("note");
    });
    $("#btn-share").click(function() {
        viewPopup("share");
    });

// HIDE POPUPS
    $("#popup-modal").click(function() {
        hidePopup();
    });
    $("#popup-settings").click(function() {
//            hidePopup();
    });
    $("#popup-trip-planner").click(function() {
        hidePopup();
    });
    $("#popup-route-builder").click(function() {
//        hidePopup();
    });
    $("#popup-share").click(function() {
        hidePopup();
    });
    $("#popup-note-save-btn").click(function() {
        hidePopup();
    });
    $("#popup-note-cancel-btn").click(function() {
        hidePopup();
    });
}

Popup.initInfoPopup = function() {
    $("#popup-info-mobile-holder").click(function(){
        var phone = $("#popup-info-mobile").html();
        if ( phone.length>10 ) window.location = "tel:"+phone;
    });
    $("#popup-info-site-holder").click(function(){
        var site = $("#popup-info-site").html();
        if ( site.length>10 ) window.open(site, '_blank');
    });
    $("#popup-info-nav-view-map").click(function() {
        Popup.showMarkerOnMapClickHandler( Marker.lastIdInfoPopup );
    });
    $("#popup-info-nav-add-route").click(function() {
        hidePopup();
        openRouteBuilerPopup("add", Marker.lastIdInfoPopup);
    });
    $("#popup-info-nav-build-route").click(function() {
        hidePopup();
        buildRouteByPoints();
    });
    $("#popup-info-nav-more-info").click(function(ev) {
        var info = $("#popup-info-nav-more-info").attr('name');
        if (info.length>6) {
            window.location = info;
        }
    });
    $("#popup-info-close-btn").click(function(ev) {
        hidePopup();
    });
}

Popup.initSettings = function() {

    $('#settings-checkbox-all-obj').click(function(){
        if (this.checked) {
            Marker.showAll();
            $("#settings-checkbox-all-obj1").prop('checked', false);
            $("#settings-checkbox-all-obj2").prop('checked', false);
            $("#settings-checkbox-all-obj3").prop('checked', false);
            $("#settings-checkbox-all-obj4").prop('checked', false);
            $("#popup-settings-list").css("visibility", "hidden");
            $("#popup-settings-banner").css("visibility", "visible");
            if ( $("#popup-settings-list").children().length>0 ) {
                $("#popup-settings-list").empty();
            }
        } else {
            Marker.showMarkerById();
        }
    });
    $('#settings-checkbox-all-obj1').click(function(){
        toggleMarkerList(0, this.checked);
    });
    $('#settings-checkbox-all-obj2').click(function(){
        toggleMarkerList(1, this.checked);
    });
    $('#settings-checkbox-all-obj3').click(function(){
        toggleMarkerList(2, this.checked);
    });
    $('#settings-checkbox-all-obj4').click(function(){
        toggleMarkerList(3, this.checked);
    });

    $('#settings-radio-1').click(function(){
        toggleMapView(google.maps.MapTypeId.ROADMAP);
    });
    $('#settings-radio-2').click(function(){
        toggleMapView(google.maps.MapTypeId.HYBRID);
    });
    $('#settings-checkbox-panorama').click(function(){
        tooglePanorama( this.checked );
    });
}

/********************************** SHOW AND HIDE POPUPS *************************/
function viewPopup( val ) {
    hidePopup();
    switch (val) {
        case "share":
            $("#popup-modal").css("visibility", "visible");
            $("#popup-share").css("visibility", "visible");
            break;
        case "note":
            $("#popup-modal").css("visibility", "visible");
            $("#popup-note").css("visibility", "visible");
            $("#popup-note-name").val("");
            $("#popup-note-text").val("");
            break;
        case "settings":
            $("#popup-modal").css("visibility", "visible");
            $("#popup-settings").css("visibility", "visible");
            if ( $("#popup-settings-list").children().length>0 ) {
                $("#popup-settings-list").css("visibility", "visible");
                $("#popup-settings-banner").css("visibility", "hidden");
            } else {
                $("#popup-settings-banner").css("visibility", "visible");
                $("#popup-settings-list").css("visibility", "hidden");
            }
            break;
        case "trip-planner":
            $("#popup-modal").css("visibility", "visible");
            $("#popup-trip-planner").css("visibility", "visible");
            break;
        case "route-builder":
            $("#popup-modal").css("visibility", "visible");
            $("#popup-route-builder").css("visibility", "visible");
            break;
        case "info":
            $("#popup-modal").css("visibility", "visible");
            $("#popup-info").css("visibility", "visible");
            break;
    }
}

function hidePopup() {
    hideTopPopup();
    hideBottomPopup();
    hideInfoPopup();
}

function hideTopPopup() {
    hidePanelMarker();
    hidePanelListTours();
    hideSearchPanel();
}

function hideInfoPopup() {
    $("#popup-info").css("visibility", "hidden");
    $("#audio-player-mini").css("visibility", "hidden");
    if (audioPlayer && audioPlayer.playing) audioPlayer.pause();
}

function hideBottomPopup() {
    $("#popup-modal").css("visibility", "hidden");
    $("#popup-share").css("visibility", "hidden");
    $("#popup-note").css("visibility", "hidden");
    $("#popup-settings").css("visibility", "hidden");
    $("#popup-settings-banner").css("visibility", "hidden");
    $("#popup-settings-list").css("visibility", "hidden");
    $("#popup-trip-planner").css("visibility", "hidden");
    $("#popup-route-builder").css("visibility", "hidden");
}

var stepZoom = [ [300,16], [530,15], [730,15]], nextStepCount=1;
function viewPanelMarker( flag ) {
    hideTopPopup();
    $("#panel-marker").css("visibility", "visible");

    var lat = userCoord.lat, lon = userCoord.lon;
//    var lat = 49.773991, lon = 23.964781;

    if (flag==null) flag = stepZoom[1];
    var totalMarkers = Marker.showMarkerAround( lat, lon, flag[0] );
    if (nextStepCount>0) {
        nextStepCount--;
        if (totalMarkers>200) {
            setTimeout(function(){
                viewPanelMarker( stepZoom[0] );
            },100);
        } else if (totalMarkers<100) {
            setTimeout(function(){
                viewPanelMarker( stepZoom[2] );
            },100);
        } else {
            viewPanelMarkerComplete(lat, lon, flag[1]);
        }
    } else {
        viewPanelMarkerComplete(lat, lon, flag[1]);
    }
}
function viewPanelMarkerComplete(lat, lon, zoom) {
    nextStepCount=1;
    var latlng = new google.maps.LatLng( lat, lon );
    gMap.setCenter(latlng);
    gMap.setZoom( zoom );
}

function hidePanelMarker() {
    $("#panel-marker").css("visibility", "hidden");
    $("#panel-marker-detals").css("visibility", "hidden");
    $("#panel-marker-list").css("visibility", "hidden");
}
function hidePanelMarkerDetails() {
    $("#panel-marker-detals").css("visibility", "hidden");
    $("#panel-marker-list").css("visibility", "hidden");
}
function hidePanelMarkerList() {
    $("#panel-marker-list").css("visibility", "hidden");
}

function viewPanelListTours() {
    hideTopPopup();
    $("#panel-tours-list").css("visibility", "visible");
//        $('#collapseOne').collapse('hide');
//        $('#collapseTwo').collapse('hide');
//        $('#collapseThree').collapse('hide');
}
function hidePanelListTours() {
    $("#panel-tours-list").css("visibility", "hidden");
}
function hideSearchPanel() {
    $("#popup-search-panel").css("visibility", "hidden");
}


Popup.viewSearchPanel = function () {
    var flag = $("#popup-search-panel").css("visibility");
    hideTopPopup();
    if (flag=="hidden") {
        searchFiledsPanelDefault();
        $("#popup-search-panel").css("visibility", "visible");
    }
}

function openRouteBuilerPopup( type, markerID ) {
    if (type && markerID) {
        var marker = Marker.getMarkerById( markerID );
        if (marker==null) {
            console.log ( "Error :: Popup.openRouteBuilerPopup :: dont find marker id = "+ markerID );
        } else if (type=="add") {
            var input = addPointRouteBuilder();
            if (input) {
                input.value += marker.model.name;
                convertCoortToPosition( $("#"+input.id), marker.model.name, marker.model.lat, marker.model.lng);
            } else {
                convertCoortToPosition( $('#end-input'), marker.model.name, marker.model.lat, marker.model.lng);
            }
        }
    }

    viewPopup("route-builder");
}

function buildRouteByPoints() {
    var marker = Marker.getMarkerById( Marker.lastIdInfoPopup),
        name = cityForSearch.slice(0,cityForSearch.length-2);
    document.getElementById('end-input').value = marker.model.address;
    convertCoortToPosition( $('#start-input'), name, userCoord.lat, userCoord.lon, function() {
        initRouteBuilder();
    });
}

/************************************** EVENTS **************************************/

Popup.showMarkerOnMapClickHandler = function( id ) {
    Marker.showMarkerById (id);
    hidePopup();
}

Popup.goMoreMarkerClickHandler = function(id) {
    var marker = Marker.getMarkerById(id);
    hidePopup();
    if (marker==null) console.log ( "Error :: Popup.goMoreMarkerClickHandler :: dont find marker id = "+ id );
    else Marker.openMarker(marker);
}

function toggleMarkerList(id, stat) {
    if( $("#settings-checkbox-all-obj").prop('checked') ) {
        Marker.showMarkerById();
        if( $("#popup-settings-list").children().length>0 ) {
            $("#popup-settings-list").empty();
        }
    }
    $("#settings-checkbox-all-obj").prop('checked', false);
    $("#popup-settings-list").css("visibility", "visible");
    $("#popup-settings-banner").css("visibility", "hidden");

    Marker.showMarkerBySection( id+"_", stat );

    if (stat) {
        var content = "";
        content += '<div id="popup-settings-list-'+id+'"><div class="popup-settings-list-title">'+ Marker.points[id].name +'</div>';
        var k = 1, arr = Marker.points[id].items, lng = arr.length;
        for (k;k<lng;k++) {
            content +='<div id="popup-settings-list-item" class="checkbox">';
            content +='<label><input type="checkbox" value="" checked onclick="settigSubMenuClickHandler('+ id +','+ k +', this)"><div>'+ arr[k] +'</div></label></div>';
        }
        content += "</div>";
        $("#popup-settings-list").append(content);
    } else {
        var holder = $("#popup-settings-list-"+id);
        if (holder) holder.remove();
    }
}

function settigSubMenuClickHandler( parentID, itemID, el ) {
    Marker.showMarkerBySection( (parentID +"_"+ itemID +"_"), el.checked );
}

function addPointRouteBuilder() {
    var k = 0, arr = $("#popup-route-builder-input > .popup-route-builder-input-holder"), lng = arr.length;
    for (k;k<lng;k++) {
        if (arr[k].style.display=="none") {
            arr[k].style.display="block";
            break;
        }
    }
    if( k<lng) return arr[k].children[0];
    return false;
}

function delPointRouteBuiler(ev) {
    var parent = ev.target.parentNode;
    parent.children[0].value = cityForSearch;
    parent.style.display="none";
}

function delPointTxtRouteBuiler(ev) {
    var parent = ev.target.parentNode;
    parent.children[0].value = cityForSearch;
}
