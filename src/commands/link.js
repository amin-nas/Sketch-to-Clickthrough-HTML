import WebUI from 'sketch-module-web-view'
import { getArtboards, executeSafely } from '../common'

export default function (context) {

  const artboards = getArtboards(context)
  const data = {
    artboards
  }
  
  const webUI = new WebUI(context, 'link.html', {
    identifier: 'clickthrough-html-sketch-plugin.link',
    width: 340,
    height: 400,
    onlyShowCloseButton: true,
    hideTitleBar: true,
    handlers: {
      setLink (data) {
        executeSafely(context, function () {

          const target = JSON.parse(data)
         
          const sketch = context.api()
          const document = sketch.selectedDocument
          const selection = document.selectedLayers
      
          selection.iterate((item) => { 
            context.command.setValue_forKey_onLayer(target.value, 'link', item.sketchObject)
            context.document.showMessage(`${item.name} linked to ${target.label}`)
          });

          webUI.panel.close()
          WebUI.clean()
          
        })
      }
    }
  })
  webUI.eval('window.data=' + JSON.stringify(data))
}