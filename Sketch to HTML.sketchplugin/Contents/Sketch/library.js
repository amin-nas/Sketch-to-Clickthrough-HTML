
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
    Show fixed layers
    Used after an artboard is exported
  */

function showFixedLayers (artboard) {
  var layers = artboard.children().objectEnumerator();
  while (layer = layers.nextObject()) {
    var name = layer.name();
    if (name == fixedLayerPrefix || name.indexOf(fixedLayerPrefix) != -1) {
      [layer setIsVisible:true];
    }
  }
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
  log(artboards);
  log(targets);
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

