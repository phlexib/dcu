var LoopMarkers = (function () {
  var proj = app.project;
  var markerProps ,  marker;
  var layerMarkers = new Array();
  var groupMarkers = new Array();
 

////// GET ALL MARKERS

function resetMarkers (){
  layerMarkers = [];
  groupMarkers = [];
};

function getMarkers(curComp) {
  
  if (proj !== null) {
    if (curComp !== null && curComp instanceof CompItem) {
      for (var l =1 ; l<= curComp.numLayers ;l++) {
        curlayer = curComp.layer(l);
        checkLayerMarkers(curlayer,curComp);
        if(curlayer.source instanceof CompItem){
          getMarkers(curlayer.source);
        }
      }
    }
  }
  return groupMarkers;
};

//// find markers on layer
function checkLayerMarkers(layer,curComp) {
  markerProps = layer.property("Marker");
  var digit = /^\d/g;
  for (var i = 1; i <= markerProps.numKeys; i++) {
    marker = new Object();
    var comment = markerProps.keyValue(i).comment;
    marker.id = comment;
    marker.text = markerProps.keyValue(i).chapter;
    marker.time = markerProps.keyTime(i);
    marker.layerIndex = layer.index;
    marker.comp = curComp.id;
    layerMarkers.push(marker);
    if(marker.id.match(digit)){
      groupMarkers.push(marker);
    }
  }
}

//////////////////////////////// UTILS
////// Find element in array
function findInArray(arr,val){
  var found = false;
  for(var i = 0; i < arr.length; i++) {
    if (arr[i].id == val) {
        found = true;
        return found;
    }
  }
  return found
}

return {
  getMarkers : getMarkers,
  layerMarkers : layerMarkers,
  groupMarkers : groupMarkers,
  resetMarkers : resetMarkers
}
})();

//  LoopMarkers.getMarkers(app.project.activeItem);
//  alert(LoopMarkers.groupMarkers.toSource());