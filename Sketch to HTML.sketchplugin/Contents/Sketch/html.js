  
function addParentX (x, layer) {
  var newX = x + layer.frame.x
  if (!(layer.container.isArtboard)) {
      newX = addParentX(newX, layer.container)
  }
  return newX
}

function addParentY (y, layer) {
  var newY = y + layer.frame.y
  if (!(layer.container.isArtboard)) {
      newY = addParentY(newY, layer.container)
  }
  return newY
}

function getRelativeX (layer) {
  var x = 0
  x = layer.frame.x
  if (!(layer.container.isArtboard)) x = addParentX(x, layer.container)
  return x
}

  
function getRelativeY (layer) {
  var y = 0
  y = layer.frame.y
  if (!(layer.container.isArtboard)) y = addParentY(y, layer.container)
  return y
}

  

function getLinkedLayerHtml (layer, linkTarget, position) {
  var lx = getRelativeX(layer) 
  var ly = getRelativeY(layer)
  var lw = layer.frame.width
  var lh = layer.frame.height

  var html = ''

  if (linkTarget !== '' && linkTarget !== null && linkTarget !== undefined) {
    linkTarget += '.html'
  } else {
    linkTarget = ''
  }

  if (position) {
    html= '<a href="' + linkTarget + '" class="'+ position +'" style="z-index: 8; left: ' + lx + 'px; top: ' + ly + 'px; width: ' + lw + 'px; height: ' + lh + 'px"></a>\n'
  } else {
    html= '<a href="' + linkTarget + '" style="z-index: 4; left: ' + lx + 'px; top: ' + ly + 'px; width: ' + lw + 'px; height: ' + lh + 'px"></a>\n'
  }

  return html
}

function getFixedLayerHtml(layer, position) {
  var layerId = layer.sketchObject.objectID()
  var lx = getRelativeX(layer) 
  var ly = getRelativeY(layer)
  var lw = layer.frame.width
  var lh = layer.frame.height

  var html = ''
  var inlineStyle = ''

  switch (position) {
    case "top":
      inlineStyle = 'style="left: ' + lx + 'px;top: ' + ly + 'px;"'
      break;
    case "bottom":
      inlineStyle = 'style="left: ' + lx + 'px;bottom: ' + ly + 'px;"'
      break;
    case "left":
      inlineStyle = 'style="left: ' + lx + 'px;top: ' + ly + 'px;"'
      break;
    case "right":
      inlineStyle = 'style="right: ' + lx + 'px;top: ' + ly + 'px;"'
      break;
  }

  html = '<div id="'+ layerId + '" class="'+ position +'"' + inlineStyle + '">\n\
            <img src="img/' + layerId + '.png" style="width: ' + lw + 'px;"> \n\
          </div>'

  return html
}

function getFixedAndLinkedLayerHtml (layer, linkTarget, position) {
  if (linkTarget !== '' && linkTarget !== null && linkTarget !== undefined) {
    linkTarget += '.html'
  } else {
    linkTarget = ''
  }

  var layerId = layer.sketchObject.objectID()
  var lx = getRelativeX(layer) 
  var ly = getRelativeY(layer)
  var lw = layer.frame.width
  var lh = layer.frame.height

  var inlineStyle = ''

  if (position == "left" || position == "right") {
    inlineStyle = 'style="top: ' + ly + 'px; z-index: 8; "'
  } else {
    inlineStyle = 'style="left: ' + lx + 'px; z-index: 8; "'
  }

  html = '<a id="'+ layerId + '" href="' + linkTarget + '" class="'+ position +'"' + inlineStyle + '">\n\
            <img src="img/' + layerId + '.png" style="width: ' + lw + 'px;"> \n\
          </a>'

  return html
}

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

