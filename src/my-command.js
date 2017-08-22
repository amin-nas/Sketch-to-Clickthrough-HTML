import WebUI from 'sketch-module-web-view';

/*
export default function (context) {
  context.document.showMessage('It\'s alive 🙌')
}
*/

const options = {
  identifier: 'unique.id', // to reuse the UI
  x: 0,
  y: 0,
  width: 500,
  height: 320,
  background: NSColor.whiteColor(),
  onlyShowCloseButton: false,
  title: '<HTML />',
  hideTitleBar: false,
  shouldKeepAround: true,
  frameLoadDelegate: { // https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc
    'webView:didFinishLoadForFrame:': function (webView, webFrame) {
        WebUI.clear();
    }
  },
  uiDelegate: {},
  handlers: {
    nativeLog: function (s) {
      context.document.showMessage(s)
    }
  }
}

const webUI = new WebUI(context, 'hello.html', options);