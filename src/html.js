  
export function addParentX (x, layer) {
  var newX = x + layer.frame.x
  if (!(layer.container.isArtboard)) {
      newX = addParentX(newX, layer.container)
  }
  return newX
}

export function addParentY (y, layer) {
  var newY = y + layer.frame.y
  if (!(layer.container.isArtboard)) {
      newY = addParentY(newY, layer.container)
  }
  return newY
}

export function getRelativeX (layer) {
  var x = 0
  x = layer.frame.x
  if (!(layer.container.isArtboard)) x = addParentX(x, layer.container)
  return x
}

  
export function getRelativeY (layer) {
  var y = 0
  y = layer.frame.y
  if (!(layer.container.isArtboard)) y = addParentY(y, layer.container)
  return y
}

  

export function getLinkedLayerHtml (layer, linkTarget, position) {
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

export function getFixedLayerHtml(layer, position) {
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

export function getFixedAndLinkedLayerHtml (layer, linkTarget, position) {
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

