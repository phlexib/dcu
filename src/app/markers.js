var Markers = (function () { // eslint-disable-line no-unused-vars

 /**
   * Creates marker with comment set to argument
   *
   * @param {String} markerComment - Comment to set on marker
   */
  function setMarker(markerComment) {
    //Log.trace("--> setMarker: " + String(markerComment));
    app.beginUndoGroup("Make Makers");
    saveScriptSettings();
    var comp = aeq.getActiveComp();

    if (!aeq.isComp(comp)) {
      var msg = "Please activate a comp before making markers.";
      alert(msg);
      // Log.warning("<-- setMarker: " + msg);
      return;
    }

    var selectedLayers = aeq.getSelectedLayers(comp);
    if (selectedLayers.length < 1) {
      alert("Select a layer before assigning a marker.");
    } else {
      selectedLayers.forEach(function(layer) {
        var marker = new MarkerValue(markerComment);
        var markerTime = comp.time;
        var hasCloseKeyframe = false;
        var markerExists = false;
        var hasAlignment = false;

        if (
          markerTime < comp.displayStartTime ||
          markerTime < comp.displayStartTime + comp.duration
        ) {
          markerTime = comp.displayStartTime;
        }

        for (var i = 1; i <= layer.property("Marker").numKeys; i++) {
          if (layer.property("Marker").keyValue(i).comment === markerComment) {
            markerExists = true;
            alert('Layer already has a marker "' + markerComment + '"');
            continue;
          }

          if (
            (markerComment === "textVAlign=.5" ||
              markerComment === "textVAlign=1") &&
            (layer.property("Marker").keyValue(i).comment === "textVAlign=.5" ||
              layer.property("Marker").keyValue(i).comment === "textVAlign=1")
          ) {
            var res = confirm(
              "Layer already has an Alignment marker. Do you want to overwrite it",
              true,
              "Updating alignment marker"
            );
            // if the user hits no stop the script
            if (res !== true) {
              return;
            } else {
              markerExists = true;
              hasAlignment = true;
              var updateMarker = new MarkerValue(markerComment);
              aeq
                .getMarkerGroup(layer)
                .setValueAtTime(
                  layer.property("Marker").keyTime(i),
                  updateMarker
                );
              refreshMarkers();
              continue;
            }
          }
          if (
            layer.property("Marker").keyTime(i) >= markerTime - 0.5 &&
            layer.property("Marker").keyTime(i) <= markerTime + 0.5
          ) {
            hasCloseKeyframe = true;
            markerTime += 0.5;
          }
        }

        var marker = new MarkerValue(markerComment);

        if (markerExists === false && hasAlignment === false) {
          aeq.getMarkerGroup(layer).setValueAtTime(markerTime, marker);
        }
      });
      refreshMarkers();
    }
    app.endUndoGroup();
    //Log.trace("<-- setMarker: " + String(markerComment));
  }


  /**
   * Removes all markers on selected layers
   */
  function removeAllMarkers () {
      Log.trace("--> removeAllMarkers");
      var comp = aeq.getActiveComp();

      if (!aeq.isComp(comp)) {
          var msg = "Please activate a comp before removing markers.";
          alert(msg);
          Log.warning("<-- removeAllMarkers: " + msg);
          return;
      }

      aeq.getSelectedLayersOrAll(comp).forEach(function (layer) {
          var markerGroup = aeq.getMarkerGroup(layer);

          if (markerGroup.numKeys > 0) {
              while (markerGroup.numKeys)
                  markerGroup.removeKey(1);
          }
      });

      Log.trace("<-- removeAllMarkers");
  }

  /**
   * Finds and removes all markers matching passed comment
   *
   * @param {String} markerComment - Marker to find and remove
   */
  function removeSpecificMarkers (markerComment) {
      Log.trace("--> removeSpecificMarkers: " + String(markerComment));
      app.beginUndoGroup("Remove Marker " + String(markerComment));

      var comp = aeq.getActiveComp();

      if (!aeq.isComp(comp)) {
          var msg = "Please activate a comp before removing markers.";
          alert(msg);
          Log.warning("<-- removeSpecificMarkers: " + msg);
          return;
      }

      aeq.getSelectedLayersOrAll(comp).forEach(function (layer) {
          var markerGroup = aeq.Property(aeq.getMarkerGroup(layer));

          markerGroup.forEachKey(function (key) {
              if (key.value().comment === markerComment)
                  markerGroup.removeKey(key);
          });
      });

      app.endUndoGroup();
      Log.trace("<-- removeSpecificMarkers: " + String(markerComment));
  }

  /**
   * Finds and selects all layers with passed comment
   *
   * @param {String} markerComment - Comment to find
   */
  function selectLayersWithComment (markerComment) {
      Log.trace("--> selectLayersWithComment: " + String(markerComment));
      var comp = aeq.getActiveComp();

      if (!aeq.isComp(comp)) {
          var msg = "Please activate a comp before selecting markers.";
          alert(msg);
          Log.warning("<-- selectLayersWithComment: " + msg);
          return;
      }

      // Get all layers
      var layers = aeq.getLayers(comp);

      layers.forEach(function (layer) {
          var markerKeys = aeq.Property(aeq.getMarkerGroup(layer)).getKeys();

          if (markerKeys.exists(function (key) {
              return key.value().comment === markerComment;
          }))
              layer.selected = true;
          else
              layer.selected = false;
      });

      Log.trace("<-- selectLayersWithComment: " + String(markerComment));
  }

  return {
      "setMarker"               : setMarker,
      "removeAllMarkers"        : removeAllMarkers,
      "removeSpecificMarkers"   : removeSpecificMarkers,
      "selectLayersWithComment" : selectLayersWithComment
  };
})();
