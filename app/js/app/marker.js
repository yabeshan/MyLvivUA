
var Marker = {

    points:[],// all menu parents and items
    childs:[],// all markers with model on map
    markerConfigCount:16,
    lastIdInfoPopup:null,
    aroundMarkerArr:[],
    selectMarkerAroundWithTypeArr:[],

    init:function() {
        // Сервіс
        Marker.loadMarkerConfig("data/lviv/marker11.json"); // Шопінг
        Marker.loadMarkerConfig("data/lviv/marker12.json"); // Консульства
        Marker.loadMarkerConfig("data/lviv/marker13.json"); // Медицина
        Marker.loadMarkerConfig("data/lviv/marker14.json"); // ІНШЕ

        // Поїсти
        Marker.loadMarkerConfig("data/lviv/marker21.json"); // Ресторани
        Marker.loadMarkerConfig("data/lviv/marker22.json"); // Фастфуд
        Marker.loadMarkerConfig("data/lviv/marker23.json"); // Кав'ярні
        Marker.loadMarkerConfig("data/lviv/marker24.json"); // ІНШЕ

        // Розваги
        Marker.loadMarkerConfig("data/lviv/marker31.json"); // Театри
        Marker.loadMarkerConfig("data/lviv/marker32.json"); // Нічні клуби
        Marker.loadMarkerConfig("data/lviv/marker33.json"); // Cпорт
        Marker.loadMarkerConfig("data/lviv/marker34.json"); // ІНШЕ

        // Відвідати
        Marker.loadMarkerConfig("data/lviv/marker01.json"); // Музеї
        Marker.loadMarkerConfig("data/lviv/marker02.json"); // Пам'ятки (пам'ятники + архітектура)
        Marker.loadMarkerConfig("data/lviv/marker03.json"); // Галереї (виставкові зали і т.п.)
        Marker.loadMarkerConfig("data/lviv/marker04.json"); // ІНШЕ
    }
}

Marker.loadMarkerConfig = function (url) {
    $.ajax({
        dataType: "json",
        url: url,
        success: Marker.parseMarkerJson
    });
}

var locateMeFlag;
Marker.loadMarkerConfigComplete = function () {
    var url = window.location.toString(),
        id = url.indexOf("?"),
        arr, lng, k= 0, item;
    if (id>0) {
        arr = url.slice(id+1, url.length).split("&");
        lng = arr.length;
        for (k;k<lng;k++) {
            item = arr[k];
            if (item.indexOf("openMarker")==0) {
                var marker = Marker.getMarkerById(item.slice(11, item.length));
                Marker.openMarker(marker);
            } else if (item.indexOf("aroundMe")==0) {
                viewPanelMarker();
                locateMeFlag = true;
            } else if (item.indexOf("locateMe")==0) {
                locateMeFlag = true;
            }
        }
    }
    if (!locateMeFlag) Marker.showAll();
}

/********************************************* CREATE MARKERS *******************************/
Marker.parseMarkerJson = function( json ) {
    if (Marker.points[ Number(json.parentID) ]==null)
        Marker.points[ Number(json.parentID) ] = {};
    Marker.points[ Number(json.parentID) ].name = json.parent;
    if (Marker.points[ Number(json.parentID) ].items==null)
        Marker.points[ Number(json.parentID) ].items = [];
    Marker.points[ Number(json.parentID) ].items[ Number(json.itemID) ] = json.item;

    var k = 0, arr = json.data, lng = arr.length;
    for (k;k<lng;k++) {
        Marker.createMarker( arr[k] );
    }

    Marker.markerConfigCount--;
    if (Marker.markerConfigCount<=0) Marker.loadMarkerConfigComplete();
}

Marker.createMarker = function( obj ) {
    var marker = new google.maps.Marker({
        icon: '../app/img/marker/'+ obj.type +'.png',
        position: new google.maps.LatLng( obj.lat, obj.lng),
        model: obj,
        title: obj.name
    });

    google.maps.event.addListener(marker,'click',function(pos) {
        Marker.openMarker(this,marker,pos);
    });
    Marker.childs.push(marker);
}


Marker.getMarkerById = function (id) {
    var k = 0, arr = Marker.childs, lng = arr.length, marker;
    for (k;k<lng;k++) {
        marker = arr[k];
        if (marker.model.id==id) {
            k=-1
            break;
        }
    }
    return (k==-1) ? marker : null ;
}


/********************************************* SHOW MARKERS *******************************/
Marker.showAll = function() {
    var k = 0, arr = Marker.childs, lng = arr.length, item;
    for (k;k<lng;k++) {
        item = arr[k];
        item.setMap( gMap );
    }
}
// hideAll == for hide all markers USED this function without ID
Marker.showMarkerById = function (id) {
    var k = 0, arr = Marker.childs, lng = arr.length, marker;
    for (k;k<lng;k++) {
        marker = arr[k];
        if (marker.model.id==id) {
            gMap.setCenter( new google.maps.LatLng ( marker.model.lat, marker.model.lng ) );
            gMap.setZoom(18);
            marker.setMap(gMap);
        } else {
            marker.setMap(null);
        }
    }
}

Marker.showMarkerBySection = function ( partID, showFlag ) {
    var k = 0, arr = Marker.childs, lng = arr.length, marker;
    for (k;k<lng;k++) {
        marker = arr[k];
        if ( marker.model.id.indexOf(partID)==0 ) {
            marker.setMap( (showFlag) ? gMap : null );
        }
    }
}

function latlng2distance(lat1, long1, lat2, long2) {
    //радиус Земли
    var R = 6372795;

    //перевод коордитат в радианы
    lat1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    long1 *= Math.PI / 180;
    long2 *= Math.PI / 180;

    //вычисление косинусов и синусов широт и разницы долгот
    var cl1 = Math.cos(lat1);
    var cl2 = Math.cos(lat2);
    var sl1 = Math.sin(lat1);
    var sl2 = Math.sin(lat2);
    var delta = long2 - long1;
    var cdelta = Math.cos(delta);
    var sdelta = Math.sin(delta);

    //вычисления длины большого круга
    var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
    var x = sl1 * sl2 + cl1 * cl2 * cdelta;
    var ad = Math.atan2(y, x);
    var dist = ad * R; //расстояние между двумя координатами в метрах

    return dist
}

Marker.showMarkerAround = function (lat,lon,radius) {
    Marker.aroundMarkerArr = [];
    var k = 0, arr = Marker.childs, lng = arr.length, marker, posx, posy, dist, id, idArr, item, counter=Marker.aroundMarkerArr;
    for (k;k<lng;k++) {
        marker = arr[k];
        dist = latlng2distance(lat, lon, marker.model.lat,marker.model.lng );
        if (dist<radius) {
            marker.setMap(gMap);
            id=marker.model.id;
            idArr = id.split("_");
            if (!counter[idArr[0]]) counter[Number(idArr[0])]=[ [], [], [], [], [] ];

            counter[ Number(idArr[0]) ][ Number(idArr[1]) ].push(marker.model.id);

//            console.log ( id, counter[ Number(idArr[0]) ][ Number(idArr[1]) ]  );
        } else {
            marker.setMap(null);
        }
    }

    var total = ( !counter[0] ) ? 0 : counter[0][0].length + counter[0][1].length + counter[0][2].length + counter[0][3].length + counter[0][4].length,
        allTotal = total;
    $(".history-badge").html( total +" з "+ 109 );
    total = ( !counter[1] ) ? 0 : counter[1][0].length + counter[1][1].length + counter[1][2].length + counter[1][3].length + counter[1][4].length;
    allTotal += total;
    $(".service-badge").html( total +" з "+ 324 );
    total = ( !counter[2] ) ? 0 : counter[2][0].length + counter[2][1].length + counter[2][2].length + counter[2][3].length + counter[2][4].length;
    allTotal += total;
    $(".restory-badge").html( total +" з "+ 362 );
    total = ( !counter[3] ) ? 0 : counter[3][0].length + counter[3][1].length + counter[3][2].length + counter[3][3].length + counter[3][4].length
    allTotal += total;
    $(".enter-badge").html( total +" з "+ 155 );
    return allTotal;
}

Marker.showMarkerAroundWithType = function (id) {
    if( !Marker.aroundMarkerArr[id] ) {
        hidePanelMarkerDetails();
        return;
    }
    $("#panel-marker-detals").css("visibility", "visible");

    if (id==0) {
        Marker.changeBadgeStyle("history-badge");
    } else if (id==1) {
        Marker.changeBadgeStyle("service-badge");
    } else if (id==2) {
        Marker.changeBadgeStyle("restory-badge");
    } else if (id==3) {
        Marker.changeBadgeStyle("enter-badge");
    }

    var name1 = Marker.points[id].items[1],
        name2 = Marker.points[id].items[2],
        name3 = Marker.points[id].items[3],
        name4 = Marker.points[id].items[4],
        arr1 = Marker.aroundMarkerArr[id][1],
        arr2 = Marker.aroundMarkerArr[id][2],
        arr3 = Marker.aroundMarkerArr[id][3],
        arr4 = Marker.aroundMarkerArr[id][4];

    $("#panel-marker-detals-name-1").html( name1 );
    $("#panel-marker-detals-name-2").html( name2 );
    $("#panel-marker-detals-name-3").html( name3 );
    $("#panel-marker-detals-name-4").html( name4 );

    var count1 = (id==0) ? 54 : (id==1) ? 103 : (id==2) ? 113 : 10;
    var count2 = (id==0) ? 21 : (id==1) ? 18  : (id==2) ? 101 : 26;
    var count3 = (id==0) ? 28 : (id==1) ? 45  : (id==2) ? 55  : 40;
    var count4 = (id==0) ? 6  : (id==1) ? 158 : (id==2) ? 93  : 79;

    $("#panel-marker-detals-1").html( arr1.length +" з "+ count1 );
    $("#panel-marker-detals-2").html( arr2.length +" з "+ count2 );
    $("#panel-marker-detals-3").html( arr3.length +" з "+ count3 );
    $("#panel-marker-detals-4").html( arr4.length +" з "+ count4 );

    Marker.selectMarkerAroundWithTypeArr = [0];
    Marker.selectMarkerAroundWithTypeArr.push( arr1 );
    Marker.selectMarkerAroundWithTypeArr.push( arr2 );
    Marker.selectMarkerAroundWithTypeArr.push( arr3 );
    Marker.selectMarkerAroundWithTypeArr.push( arr4 );

    arr1 = arr1.concat( arr2 );
    arr1 = arr1.concat( arr3 );
    arr1 = arr1.concat( arr4 );

    var k= 0, arr=Marker.childs, lng=arr.length;
    for (k;k<lng;k++) {
        marker = arr[k];
        if ( arr1.indexOf( marker.model.id )>=0 ) {
            marker.setMap(gMap);
        } else {
            marker.setMap(null);
        }
    }
}

Marker.showMarkerAroundWithTypeAndSection = function (id) {

    if (Marker.selectMarkerAroundWithTypeArr[id].length==0) {
        $("#panel-marker-list").css("visibility", "hidden");
        return;
    } else {
        $("#panel-marker-list").css("visibility", "visible");
    }

    var k= 0, arr=Marker.childs, lng=arr.length, marker, arrID=Marker.selectMarkerAroundWithTypeArr[id], content="";
    for (k;k<lng;k++) {
        marker = arr[k];
        if ( arrID.indexOf( marker.model.id )>=0 ) {
            marker.setMap(gMap);
            content +='<div class="panel-marker-list-item" onclick="Marker.viewAroundMarkerClickHandler(event)" name="'+ marker.model.id +'">'+ marker.model.name +'</div>';
        } else {
            marker.setMap(null);
        }
    }
    $("#panel-marker-list-holder").html( content );
}

Marker.changeBadgeStyle = function ( cl ) {
    $("#panel-marker-detals-1").removeClass("history-badge");
    $("#panel-marker-detals-1").removeClass("service-badge");
    $("#panel-marker-detals-1").removeClass("restory-badge");
    $("#panel-marker-detals-1").removeClass("enter-badge");

    $("#panel-marker-detals-2").removeClass("history-badge");
    $("#panel-marker-detals-2").removeClass("service-badge");
    $("#panel-marker-detals-2").removeClass("restory-badge");
    $("#panel-marker-detals-2").removeClass("enter-badge");

    $("#panel-marker-detals-3").removeClass("history-badge");
    $("#panel-marker-detals-3").removeClass("service-badge");
    $("#panel-marker-detals-3").removeClass("restory-badge");
    $("#panel-marker-detals-3").removeClass("enter-badge");

    $("#panel-marker-detals-4").removeClass("history-badge");
    $("#panel-marker-detals-4").removeClass("service-badge");
    $("#panel-marker-detals-4").removeClass("restory-badge");
    $("#panel-marker-detals-4").removeClass("enter-badge");

    $("#panel-marker-detals-1").addClass( cl );
    $("#panel-marker-detals-2").addClass( cl );
    $("#panel-marker-detals-3").addClass( cl );
    $("#panel-marker-detals-4").addClass( cl );
}


/********************************************* HANDLERS *******************************/
Marker.openMarker = function( marker ){
    Marker.lastIdInfoPopup = marker.model.id;
    $("#popup-info").attr('name', marker.model.id);

    $("#popup-info-title").html( marker.model.name );
    $("#popup-info-address").html( marker.model.address );
    $("#popup-info-coord").html( marker.model.lat +", "+marker.model.lng );

    if (marker.model.img && marker.model.img.length>4) {
        $("#popup-info-img").attr("src", marker.model.img);
    } else {
        $("#popup-info-img").attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    }

    if (marker.model.phone) {
        $("#popup-info-mobile").html(marker.model.phone);
        $("#popup-info-mobile-holder").css("display", "block");
    } else {
        $("#popup-info-mobile").html("");
        $("#popup-info-mobile-holder").css("display", "none");
    }

    if (marker.model.site) {
        $("#popup-info-site").html(marker.model.site);
        $("#popup-info-site-holder").css("display", "block");
    } else {
        $("#popup-info-site").html("");
        $("#popup-info-site-holder").css("display", "none");
    }

    if (marker.model.price) {
        $("#popup-info-price").html(marker.model.price);
        $("#popup-info-price-holder").css("display", "block");
    } else {
        $("#popup-info-price").html("");
        $("#popup-info-price-holder").css("display", "none");
    }

    if (marker.model.text) {
        $("#popup-info-details").html(marker.model.text);
    } else {
        $("#popup-info-details").html(marker.model.name);
    }

    if (marker.model.info) {
        $("#popup-info-nav-more-info").attr('name', marker.model.info);
        $("#popup-info-nav-more-info").css("display", "block");
    } else {
        $("#popup-info-nav-more-info").attr('name', "");
        $("#popup-info-nav-more-info").css("display", "none");
    }

    $("#popup-info").removeClass("popup-info-blue");
    $("#popup-info").removeClass("popup-info-green");
    $("#popup-info").removeClass("popup-info-orange");
    $("#popup-info").removeClass("popup-info-pink");

         if ( marker.model.type.indexOf("marker0")==0 ) $("#popup-info").addClass("popup-info-blue");
    else if ( marker.model.type.indexOf("marker1")==0 ) $("#popup-info").addClass("popup-info-green");
    else if ( marker.model.type.indexOf("marker2")==0 ) $("#popup-info").addClass("popup-info-orange");
    else if ( marker.model.type.indexOf("marker3")==0 ) $("#popup-info").addClass("popup-info-pink");

    viewPopup("info");

    if (marker.model.audio) {
        if (audioPlayer && audioPlayer.load) {
            audioPlayer.load( marker.model.audio );
            audioPlayer.play();
        }
        $("#audio-player-mini").css("height", "45px");
        $("#audio-player-mini").css("visibility", "visible");
    } else {
        $("#audio-player-mini").css("height", "10px");
        $("#audio-player-mini").css("visibility", "hidden");
    }
}

Marker.viewAroundMarkerClickHandler = function ( ev ) {
    hidePanelMarker();
    Popup.goMoreMarkerClickHandler ( $(ev.target).attr('name') );
}





