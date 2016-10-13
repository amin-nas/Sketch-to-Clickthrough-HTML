

function showLinkLayers () {
  return showOrHideLinkLayers(true);
}

function hideLinkLayers () {
  return showOrHideLinkLayers(false);
}

function toggleLinkLayers() {
  return showOrHideLinkLayers (-1);
}

function showOrHideLinkLayers (shouldShowLayers) {
  var layers = doc.currentPage().children().objectEnumerator();
  while (layer = layers.nextObject()) {

    var name = layer.name();
    if (name == linkLayerPrefix || name.indexOf(linkLayerPrefix) != -1) {

      if (shouldShowLayers === -1) {
        // decide whether to hide or show all layers, based on the visibility of the first layer we find
        shouldShowLayers = ![layer isVisible];
      }

      [layer setIsVisible:shouldShowLayers];
    }
  }
  return shouldShowLayers;
}

function displayMissingArtboardsWarnings (targets, artboards) {
  // Display a warning if there are link targets on this page that don't have a corresponding artboard
  var warnings = '';
  targets.sort();
  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];
    if (artboards.indexOf(target) === -1) {
      warnings += '\n· ' + target
    };
  };

  if (warnings !== '') {
    warnings += '\n\nThe prototype will be exported anyway.'
    var app = [NSApplication sharedApplication];
    [app displayDialog:warnings withTitle:"There are links to missing artboards:"];
  }
}

function createFolder(name) {
  var fileManager = [NSFileManager defaultManager];
  [fileManager createDirectoryAtPath:name withIntermediateDirectories:true attributes:nil error:nil];
}

function saveTextToFile (filename, text) {
  var path = [@"" stringByAppendingString:filename];
  var str = [@"" stringByAppendingString:text];
  str.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(path, true);
}

