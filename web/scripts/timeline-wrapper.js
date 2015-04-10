var timeline;
var eventSource;
var event_data;

function onLoad() {
  eventSource = new Timeline.DefaultEventSource();
  var bands = [
    Timeline.createBandInfo({
      eventSource: eventSource,
      width: "30%",
      intervalUnit: Timeline.DateTime.HOUR,
      intervalPixels: 50
    }),
    Timeline.createBandInfo({
      eventSource: eventSource,
      width: "55%",
      intervalUnit: Timeline.DateTime.DAY,
      intervalPixels: 80
    }),
    Timeline.createBandInfo({
      eventSource: eventSource,
      overview: true,
      width: "15%",
      intervalUnit: Timeline.DateTime.MONTH,
      intervalPixels: 400
    })
  ];
  bands[2].syncWith = 0;
  bands[2].highlight = true;
  bands[1].syncWith = 0;
  bands[1].highlight = true;
  timeline = Timeline.create(document.getElementById("timeline-root"), bands);
  timeline.loadJSON("api/v1/events", function( data, url ) {
    console.log(data);
    event_data = data;
    eventSource.loadJSON(data, url);
    
    var implementer_select = document.getElementById("timeline-implementers-select");
    var elem = document.createElement("option");
        elem.text = "No Selection";
        elem.value = "cleared";
        elem.selected = true;
    implementer_select.appendChild(elem);
    for (var i = 0, l = event_data.implementers.length, imp, md5; i < l; i++) {
      imp = event_data.implementers[i];
      md5 = CryptoJS.MD5(imp).toString();
      elem = document.createElement("option");
      elem.text = imp;
      elem.value = imp;
      elem.className = "select-m" + md5;
      implementer_select.appendChild(elem);
    }
    
    var coordinator_select = document.getElementById("timeline-coordinators-select");
        elem = document.createElement("option");
        elem.text = "No Selection";
        elem.value = "cleared";
        elem.selected = true;
    coordinator_select.appendChild(elem);
    for (var i = 0, l = event_data.coordinators.length, imp, md5; i < l; i++) {
      imp = event_data.coordinators[i];
      md5 = CryptoJS.MD5(imp).toString();
      elem = document.createElement("option");
      elem.text = imp;
      elem.value = imp;
      elem.className = "select-m" + md5;
      coordinator_select.appendChild(elem);
    }
  });
};

var resizeTimer = null;
function onResize() {
  if (resizeTimer == null) {
    resizeTimer = window.setTimeout(function() {
      resizeTimer = null;
      timeline.layout();
    }, 500);
  }
};

function select_person(name) {
  //MD5 used on names added to all events as a class for identity
  //Generate the MD5 on the targetted name to find all events with
  //that identity class
  var md5 = CryptoJS.MD5(name).toString();
  console.log(name + "::" + md5);
  //Update stored events
  var a = eventSource._events._events._a;
  $("select.timeline-select").val("cleared");
  $(".select-m" + md5).attr('selected', 'selected');
  for (var i = 0, l = a.length, e; i < l; i++) {
    e = a[i];
    //Remove 'selected_person' class from all events.
    if (e._classname.indexOf("selected_person") >= 0) {
      e._classname = e._classname.replace(/selected_person/, '');
    }
    //Add 'selected_person' class to targetted events
    if (e._classname.indexOf("m" + md5) >= 0) {
      e._classname = e._classname + " selected_person";
    }
  }
  //Refresh timeline view
  timeline.layout();
};
