import WebUI from 'sketch-module-web-view'
import { getUserPreferences, setUserPreferences } from './preferences'
import { getArtboards } from './common'

export default function (context) {
  const artboards = {
    name: "Page 1"  
  }

  
  const webUI = new WebUI(context, 'hello.html', {
    identifier: 'git-sketch-plugin.preferences',
    width: 340,
    height: 400,
    onlyShowCloseButton: true,
    hideTitleBar: true,
    handlers: {
      savePreferences (prefs) {
        executeSafely(context, function () {
          webUI.panel.close()
          WebUI.clean()
          context.document.showMessage('Preferences updated')
        })
      }
    }
  })
  webUI.eval('window.artboards=' + JSON.stringify(artboards))
}