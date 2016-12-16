
function getLinkedLayerHtml (layer, linkTarget, position) {
  var lx = layer.frame().x()
  var ly = layer.frame().y()
  var lw = layer.frame().width()
  var lh = layer.frame().height()

  var html = ''

  if (linkTarget !== '' && linkTarget !== null && linkTarget !== undefined) {
    linkTarget += '.html'
  } else {
    linkTarget = ''
  }

  // if (position)
  html= '<a href="' + linkTarget + '" class="'+ position +'" style="z-index: 4; left: ' + lx + 'px; top: ' + ly + 'px; width: ' + lw + 'px; height: ' + lh + 'px"></a>\n'

  return html
}

function getFixedLayerHtml(layer, position) {
  var layerId = layer.objectID()
  var lx = layer.frame().x()
  var ly = layer.frame().y()
  var lw = layer.frame().width()
  var lh = layer.frame().height()

  var html = ''
  var inlineStyle = ''

  if (position == "left" || position == "right") {
    inlineStyle = 'style="top: ' + ly + 'px;"'
  } else {
    inlineStyle = 'style="left: ' + lx + 'px;"'
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

  var layerId = layer.objectID()
  var lx = layer.frame().x()
  var ly = layer.frame().y()
  var lw = layer.frame().width()
  var lh = layer.frame().height()

  var inlineStyle = ''

  if (position == "left" || position == "right") {
    inlineStyle = 'style="top: ' + ly + 'px;"'
  } else {
    inlineStyle = 'style="left: ' + lx + 'px;"'
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
        position: fixed; \n\
        z-index: 10; \n\
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
        z-index: 2; \n\
        top: 0; \n\
      } \n\
      .left { \n\
        position: fixed; \n\
        z-index: 2; \n\
        top: 0; \n\
        left: 0; \n\
      } \n\
      .bottom { \n\
        position: fixed; \n\
        z-index: 2; \n\
        bottom: 0; \n\
      } \n\
      .right { \n\
        position: fixed; \n\
        z-index: 2; \n\
        top: 0; \n\
        right: 0; \n\
      } \n\
    </style> \n\
  </head>\n\
  <body><main>\n'

const HTML_FOOT = '</main></body></html>\n'

