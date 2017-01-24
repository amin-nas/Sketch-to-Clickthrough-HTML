
/**
    Export artboards and fixed layers
    Scale set to 2 for retina displays 
  */

function exportLayerToPath(doc, layer, path) {
  var frame = [layer frame];
  var slice_name = [layer name];

  var copy = [layer duplicate];
  var rect = copy.absoluteRect().rect()
  var request = MSExportRequest.new();
  request.rect = rect;
  request.scale = 2;
  [copy removeFromParent];
  
  doc.saveArtboardOrSlice_toFile(request, path)
}



/**
    Export html files
  */

function createFolder(name) {
  var fileManager = [NSFileManager defaultManager];
  [fileManager createDirectoryAtPath:name withIntermediateDirectories:true attributes:nil error:nil];
}


function saveTextToFile (filename, text) {
  var path = [@"" stringByAppendingString:filename];
  var str = [@"" stringByAppendingString:text];
  str.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(path, true);
}

function fileSaver() {
  // Panel
  var openPanel = [NSOpenPanel openPanel]

  [openPanel setTitle: "Choose a location…"];
  [openPanel setPrompt: "Export"];

  [openPanel setCanCreateDirectories: true]
  [openPanel setCanChooseFiles: false]
  [openPanel setCanChooseDirectories: true]
  [openPanel setAllowsMultipleSelection: false]
  [openPanel setShowsHiddenFiles: false]
  [openPanel setExtensionHidden: false]

  var openPanelButtonPressed = [openPanel runModal]
  if (openPanelButtonPressed == NSFileHandlingPanelOKButton) {
    allowedUrl = [openPanel URL]
  }
  return allowedUrl
}



/**
    Display a message about broken links  
  */

function displayMissingArtboardsWarnings (sketch, targets, artboards) {
  var warnings = '';
  targets.sort();
  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];
    if (artboards.indexOf(target) === -1) {
      warnings += '\n ' + target
    };
  };

  if (warnings !== '') {
    warnings += '\n\nThe prototype will be exported anyway.';
    sketch.alert(warnings, "Links to missing artboards:");
  }
}



/**
    Return list of artboards in the current page  
    Return false if layer is not nested within an artboard
  */

function getArtboardsList (doc) {
  var artboards = (doc.sketchObject).currentPage().artboards().objectEnumerator();

  var artboardsList = [];

  while (artboard = artboards.nextObject()) {
    var artboardName = artboard.name().trim();
    artboardsList.push(artboardName);
  }

  return artboardsList;
}


/**
    Open folder  
  */

function openFolder (path) {
  var folderPath = [@"" stringByAppendingString:path];
  [[NSWorkspace sharedWorkspace]openFile:folderPath withApplication:@"Finder"]
}


/**
    Get the artboard ID of a selected layer  
  */

function getParentArtboardId (object) {
  if (object.isKindOfClass(MSArtboardGroup)) {
    return (object.objectID())
  } else if (object.parentGroup() != null) {
    return getParentArtboardId(object.parentGroup())
  } else {
    return null
  }
}



/**
    If any parent layer is fixed, the layer has to be fixed too  
  */

function getPosition (layer, artboardConfig) {
  
  var object = layer.sketchObject
  
  while(!(object.isKindOfClass(MSArtboardGroup))) {
    var objId = object.objectID();
    if(artboardConfig[objId] && 'fix' in artboardConfig[objId]) {
      return artboardConfig[objId]['fix']
    } else {
      object = object.parentGroup()
    }
  }

  return false
}



/**
  Set the new config text   
  */

function setConfig (page, config) {

  var configStr = JSON.stringify(config)

  page.iterate(function(item) { 
    if (item.name == htmlConfigName) { 
      item.iterate(function(layer) {
        layer.text = configStr
      });
    }
  });
}



/**
  Return config object if it exists
  Create a new layer if it doesn't    
  */

function getConfigObject (sketch, page) {
  var config = {}
  var configStr
  var configExists = false

  page.iterate(function(item) { 
    if (item.name == htmlConfigName) { 
      configExists = true
      item.iterate(function(layer) {
        configStr = layer.text
      });
    }
  });

  if (configExists) {
    config = JSON.parse(configStr)
  } else {     
    var groupLayer = page.newGroup({frame: new sketch.Rectangle(-10000, -10000, 100, 100), name: htmlConfigName})
    var textLayer = groupLayer.newText({text:"{}", name: htmlConfigName})
    groupLayer.moveToBack()
    groupLayer.deselect()
  }

  return config
}


/**
  Remove config text    
  */

function removeConfigText (sketch, page) {
  var config = {}
  var configStr

  page.iterate(function(item) { 
    if (item.name == htmlConfigName) { 
      item.remove()
    }
  });
}
