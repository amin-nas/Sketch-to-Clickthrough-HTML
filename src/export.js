import WebUI from 'sketch-module-web-view'
import { getUserPreferences } from './preferences'


export default function (context) {
  const prefs = getUserPreferences(context)
  
  const webUI = new WebUI(context, 'preferences.html', {
    identifier: 'clickthrough-html-sketch-plugin.preferences',
    width: 340,
    height: 400,
    onlyShowCloseButton: true,
    hideTitleBar: false
  })
  webUI.eval('window.prefs=' + JSON.stringify(prefs))
}

/*
import { createFolder, getArtboardsList, getConfigObject, 
          exportLayerToPath, displayMissingArtboardsWarnings, 
          openFolder, saveTextToFile } from './common'
import { getFixedAndLinkedLayerHtml, getLinkedLayerHtml, getFixedLayerHtml } from './html'


const HTML_HEAD = '<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
  <meta charset="utf-8">\n\
  <title>Prototype</title>\n\
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
  <script type="text/javascript"> \n\
    document.onmousedown = function() { \n\
      document.body.setAttribute("class", "is-highlighted"); \n\
    } \n\
    document.onmouseup = function() { \n\
      document.body.setAttribute("class", ""); \n\
    } \n\
  </script> \n\
  <style> \n\
    html, body { \n\
      padding: 0; \n\
      margin: 0; \n\
    } \n\
    a { \n\
      position: absolute; \n\
    } \n\
    body.is-highlighted a { \n\
      background-color: #e5e5e5; \n\
      opacity: .2; \n\
    } \n\
    main { \n\
      position: relative; \n\
      margin: 0 auto; \n\
    } \n\
    .top { \n\
      position: fixed; \n\
      z-index: 6; \n\
      top: 0; \n\
    } \n\
    .left { \n\
      position: fixed; \n\
      z-index: 6; \n\
      top: 0; \n\
      left: 0; \n\
    } \n\
    .bottom { \n\
      position: fixed; \n\
      z-index: 6; \n\
      bottom: 0; \n\
    } \n\
    .right { \n\
      position: fixed; \n\
      z-index: 6; \n\
      top: 0; \n\
      right: 0; \n\
    } \n\
  </style> \n\
</head>\n\
<body><main>\n'

const HTML_FOOT = '</main></body></html>\n'



export default function (context) {
  
  const sketch = context.api()
  const doc = sketch.selectedDocument
  const docName = [(doc.sketchObject) displayName]
  const page = doc.selectedPage

  // open the system dialog to choose the export location
  const fileURL = fileSaver();
  const exportPath = fileURL.path() + '/' + docName + '_HTML/'
  createFolder(exportPath);

  var html = ''
  var linkTargets = []
  var hiddenLayers = []
  var artboardsList = getArtboardsList (doc)

  var artboards = (doc.sketchObject).currentPage().artboards().objectEnumerator()

  while (artboard = artboards.nextObject()) {

    var artboardName = artboard.name().trim()
    var artboardId = artboard.objectID()
    var artboardW = artboard.frame().width()

    // start the HTML string
    html = HTML_HEAD + '<!-- ' + artboardName + ' -->\n'
    html += '<img class="artboardImage" src="img/' + artboardName + '.png" width="'+ artboardW +'">\n'

    var config = getConfigObject (sketch, page)
    var artboardConfig = config[artboardId]
    if (artboardConfig) {
      var layersIds = Object.keys(artboardConfig)

      for (var layerId of layersIds) {
        var layer = doc.layerWithID(layerId)
        if (!layer) break
        var layerObj = layer.sketchObject
        
        var layerConfig = artboardConfig[layerId]
        if (!layerConfig) break
        if ( Object.keys(layerConfig).length > 1 ) { // layer if both fixed and linked
          
          var linkTarget = layerConfig[linkedLayerKey]
          var position = layerConfig[fixedLayerKey]

          html += getFixedAndLinkedLayerHtml(layer, linkTarget, position)
          var filePath = exportPath + "img/" + layerId + ".png"
          exportLayerToPath((doc.sketchObject), layerObj, filePath)
          //hide layer until the artboard is exported
          [layerObj setIsVisible:false]
          hiddenLayers.push(layerObj)

        } else {
          for (var htmlType of Object.keys(layerConfig)) {

            var htmlValue = layerConfig[htmlType]

            switch(htmlType) {

              case linkedLayerKey:
                linkTargets.push(htmlValue)
                var position = getPosition(layer, artboardConfig)
                html += getLinkedLayerHtml(layer, htmlValue, position)
                break

              case fixedLayerKey:
                html += getFixedLayerHtml(layer, htmlValue)
                var filePath = exportPath + "img/" + layerId + ".png"
                exportLayerToPath((doc.sketchObject), layerObj, filePath)
                //hide layer until the artboard is exported
                [layerObj setIsVisible:false]
                hiddenLayers.push(layerObj)
                break
            }
          }
        }
      }
    }

    html += HTML_FOOT;

    var htmlPath = exportPath + artboardName + '.html'
    saveTextToFile(htmlPath, html);

    // export this artboard
    var filePath = exportPath + "img/" + artboardName + ".png"
    exportLayerToPath((doc.sketchObject), artboard, filePath)

    // show fixed layers
    for (var i = 0; i < hiddenLayers.length; i++) {
      [(hiddenLayers[i]) setIsVisible:true]
    }
    hiddenLayers = []
    
  }

  // display list of dead links, if any
  displayMissingArtboardsWarnings(sketch, linkTargets, artboardsList);

  // display a toaster message
  sketch.message('HTML files exported to: ' + exportPath)

  openFolder(exportPath);
}

*/