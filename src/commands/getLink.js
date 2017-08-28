import WebUI from 'sketch-module-web-view'

export default function (context) {

  const webUI = new WebUI(context, 'about.html', {
    identifier: 'clickthrough-html-sketch-plugin.link',
    width: 340,
    height: 400,
    onlyShowCloseButton: true,
    hideTitleBar: true
  })
}