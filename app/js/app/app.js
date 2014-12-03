
function accordionClickHandler( id ) {
    if (id==1) {
        $('#collapseOne').collapse('toggle');
    } else if (id==2) {
        $('#collapseTwo').collapse('toggle');
    } else if (id==3) {
        $('#collapseThree').collapse('toggle');
    }

}

$(document).ready(function() {
    google.maps.event.addDomListener(window, 'load', initialize);
    function initialize() {
        mapInit();
        Popup.init();
    };
});




function goHome() {
    window.location = 'demo.html';
}





