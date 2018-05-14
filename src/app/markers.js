var Markers = (function () { // eslint-disable-line no-unused-vars

  /**
   * Creates marker with comment set to argument
   *
   * @param {String} markerComment - Comment to set on marker
   * @param {String} markerChapter - Comment to set on marker
   */
  function setMarker (markerComment,markerChapter) {
      Log.trace("--> setMarker: " + String(markerComment));
      app.beginUndoGroup("Make Makers");

      var comp = aeq.getActiveComp();

      if (!aeq.isComp(comp)) {
          var msg = "Please activate a comp before making markers.";
          alert(msg);
          Log.warning("<-- setMarker: " + msg);
          return;
      }

      aeq.getSelectedLayers(comp).forEach(function (layer) {
          var marker = new MarkerValue(markerComment,"markerChapter");
          alert(markerComment,markerChapter);
          aeq.getMarkerGroup(layer).setValueAtTime(comp.time, marker);
      });

      app.endUndoGroup();
      Log.trace("<-- setMarker: " + String(markerComment));
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
