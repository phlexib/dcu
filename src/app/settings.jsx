var DCSettings = (function (){

  function saveScriptSettings(grp,defaultArray){
    var sectionName = "DCTOJSON-UI";
    try{
      for( var s = 0 ; s <defaultArray.length; s++){
        var value = grp.children[s].children[2].children[0].value;
       app.settings.saveSetting(sectionName, defaultArray[s].id, value);
      } 
    }catch(e){
      alert(e);
    }
    
     
  }
  
  function readScriptSettings(grp,defaultArray){
    var sectionName = "DCTOJSON-UI";
    try{
      for( var s = 0 ; s < defaultArray.length; s++){
       var curSetting = app.settings.getSetting(sectionName, defaultArray[s].id);
          if(curSetting === "true"){
        grp.children[s].children[2].children[0].value = true;
       }else{
        grp.children[s].children[2].children[1].value = true;
       }
      }
  
    }catch(e){
  
    }
}

return {
saveScriptSettings : saveScriptSettings,
readScriptSettings : readScriptSettings
};

})();


