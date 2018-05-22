var LoopMarkers = (function () {
  var proj = app.project;
  var markerProps ,  marker;
  var layerMarkers = [];
  var groupMarkers = [];
 

////// GET ALL MARKERS

function resetMarkers (){
  layerMarkers = [];
  groupMarkers = [];
};

function getMarkers(curComp) {
  var grpMarkers = []
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

  //// find markers on layer
function checkLayerMarkers(layer,curComp) {
   
  markerProps = layer.property("Marker");
  var digit = /^\d/g;
  for (var i = 1; i <= markerProps.numKeys; i++) {
    marker = new Object();
    var comment = markerProps.keyValue(i).comment;
    marker.id = groupMarkers.length +4;
    marker.text = comment;
    marker.time = markerProps.keyTime(i);
    marker.layerIndex = layer.index;
    marker.comp = curComp.id;
    layerMarkers.push(marker);
    var defaults = /dynamic|textVAlign|script|location|reaction|comment|date|_\d$/g  
    if(!(marker.text.match(defaults))){ 
      groupMarkers.push(marker)
      grpMarkers.push(marker)}

  }
}
  return grpMarkers;
};



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