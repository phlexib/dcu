var LoopMarkers = (function() {
  var proj = app.project;
  var markerProps, marker;
  var layerMarkers = [];
  var groupMarkers = [];

  ////// GET ALL MARKERS

  function resetMarkers() {
    layerMarkers = [];
    groupMarkers = [];
  }

 

  function getMarkers(curComp) {
    var grpMarkers = [];
    if (proj !== null) {
      if (curComp !== null && curComp instanceof CompItem) {
        for (var l = 1; l <= curComp.numLayers; l++) {
          curlayer = curComp.layer(l);
          checkLayerMarkers(curlayer, curComp);
          if (curlayer.source instanceof CompItem) {
            getMarkers(curlayer.source);
          }
        }
      }
    }

    //// find markers on layer
    function checkLayerMarkers(layer, curComp) {
      var groupTxt = [];
      markerProps = layer.property("Marker");
      var digit = /^\d/g;
      for (var i = 1; i <= markerProps.numKeys; i++) {
        marker = new Object();
        var comment = markerProps.keyValue(i).comment;
        marker.id = groupMarkers.length + 4;
        marker.text = comment;
        marker.time = markerProps.keyTime(i);
        marker.layerIndex = layer.index;
        marker.comp = curComp.id;

        marker.sub = 0;
        var subGroup = /(^\w+)(_\d+$)/;

        if (marker.text.match(subGroup)) {
          var matchSubGroup = marker.text.match(subGroup);
          var groupName = matchSubGroup[1];
          var subGroupString = matchSubGroup[2];
          var subGroupNumber = parseInt(subGroupString.match(/\d+/));
          marker.text = groupName;
          marker.sub = subGroupNumber;
        }

        layerMarkers.push(marker);

        var skipString = /dynamic|textVAlign|script|location|reaction|comment|date/g;
        if (!marker.text.match(skipString)) {
          groupMarkers.push(marker);
          grpMarkers.push(marker);
        }
      }
    }
    return grpMarkers;
  }

  //////////////////////////////// UTILS
  ////// Find element in array
  function findInArray(arr, val) {
    var found = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id == val) {
        found = true;
        return found;
      }
    }
    return found;
  }

  return {
    getMarkers: getMarkers,
    layerMarkers: layerMarkers,
    groupMarkers: groupMarkers,
    resetMarkers: resetMarkers
  };
})();

//  LoopMarkers.getMarkers(app.project.activeItem);
//  alert(LoopMarkers.groupMarkers.toSource());
