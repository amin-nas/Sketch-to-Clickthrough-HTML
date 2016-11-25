
function getLinkedLayerHtml (layer, linkTarget) {

  if (linkTarget !== '' && linkTarget !== null && linkTarget !== undefined) {
    linkTarget += '.html';
  } else {
    linkTarget = '';
  }

  if (typeof layer.frame === 'function') {
    var lx = layer.frame().x();
    var ly = layer.frame().y();
    var lw = layer.frame().width();
    var lh = layer.frame().height();
    var html= '<a href="' + linkTarget + '" style="left: ' + lx + 'px; top: ' + ly + 'px; width: ' + lw + 'px; height: ' + lh + 'px"></a>\n';
  }
  return html;
}

function getFixedLayerHtml(layer, position) {

  var layerId = layer.objectID();
  var lw = layer.frame().width();

  if (position == "left" || position == "right") {
    if (typeof layer.frame === 'function') {
      var ly = layer.frame().y();
    }
    html = '<img class="'+ position +'" style="top: ' + ly + 'px; width: ' + lw + 'px;" src="img/' + layerId + '.png">\n';
  } else {
    if (typeof layer.frame === 'function') {
      var lx = layer.frame().x();
    }
    html = '<img class="'+ position +'" style="left: ' + lx + 'px; width: ' + lw + 'px;" src="img/' + layerId + '.png">\n';
  }
  return html;
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
        z-index: 10; \n\
      } \n\
      body.is-highlighted a { \n\
        background-color: #e5e5e5; \n\
        opacity: .2; \n\
      } \n\
      main { \n\
        position: relative; \n\
        display: inline-block; \n\
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
  <body><main>\n';

const HTML_FOOT = '</main></body></html>\n';