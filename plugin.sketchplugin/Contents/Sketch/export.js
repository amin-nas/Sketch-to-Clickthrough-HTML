var that = this;
function run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports['default'] = function (context) {
  var prefs = (0, _preferences.getUserPreferences)(context);

  var webUI = new _sketchModuleWebView2['default'](context, 'preferences.html', {
    identifier: 'clickthrough-html-sketch-plugin.preferences',
    width: 340,
    height: 400,
    onlyShowCloseButton: true,
    hideTitleBar: false
  });
  webUI.eval('window.prefs=' + JSON.stringify(prefs));
};

var _sketchModuleWebView = __webpack_require__(1);

var _sketchModuleWebView2 = _interopRequireDefault(_sketchModuleWebView);

var _preferences = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* globals NSUUID NSThread NSPanel NSMakeRect NSTexturedBackgroundWindowMask NSTitledWindowMask NSWindowTitleHidden NSClosableWindowMask NSColor NSWindowMiniaturizeButton NSWindowZoomButton NSFloatingWindowLevel WebView COScript */
var MochaJSDelegate = __webpack_require__(2)
var parseQuery = __webpack_require__(3)

var coScript = COScript.currentCOScript()

var LOCATION_CHANGED = 'webView:didChangeLocationWithinPageForFrame:'

function WebUI (context, htmlName, options) {
  // ColorPicker main window
  var identifier = options.identifier || NSUUID.UUID().UUIDString()
  var threadDictionary = NSThread.mainThread().threadDictionary()
  var backgroundColor = options.background || NSColor.whiteColor()
  var panel = threadDictionary[identifier] ? threadDictionary[identifier] : NSPanel.alloc().init()

  // Window size
  panel.setFrame_display(NSMakeRect(
    options.x || 0,
    options.y || 0,
    options.width || 240,
    options.height || 180
  ), true)

  panel.setStyleMask(options.styleMask || (NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask))
  panel.setBackgroundColor(backgroundColor)

  if (options.onlyShowCloseButton) {
    panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true)
    panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
  }

  // Titlebar
  panel.setTitle(options.title || context.plugin.name())
  if (options.hideTitleBar) {
    panel.setTitlebarAppearsTransparent(true)
    panel.setTitleVisibility(NSWindowTitleHidden)
  }

  panel.becomeKeyWindow()
  panel.setLevel(NSFloatingWindowLevel)

  threadDictionary[identifier] = panel

  if (options.shouldKeepAround !== false) { // Long-running script
    coScript.setShouldKeepAround(true)
  }

  // Add Web View to window
  var webView = WebView.alloc().initWithFrame(NSMakeRect(
    0,
    options.hideTitleBar ? -24 : 0,
    options.width || 240,
    (options.height || 180) - (options.hideTitleBar ? 0 : 24)
  ))

  if (options.frameLoadDelegate || options.handlers) {
    var handlers = options.frameLoadDelegate || {}
    if (options.handlers) {
      var lastQueryId
      handlers[LOCATION_CHANGED] = function (webview, frame) {
        var query = webview.windowScriptObject().evaluateWebScript('window.location.hash')
        query = parseQuery(query)
        if (query.pluginAction && query.actionId && query.actionId !== lastQueryId && query.pluginAction in options.handlers) {
          lastQueryId = query.actionId
          try {
            query.pluginArgs = JSON.parse(query.pluginArgs)
          } catch (err) {}
          options.handlers[query.pluginAction].apply(context, query.pluginArgs)
        }
      }
    }
    var frameLoadDelegate = new MochaJSDelegate(handlers)
    webView.setFrameLoadDelegate_(frameLoadDelegate.getClassInstance())
  }
  if (options.uiDelegate) {
    var uiDelegate = new MochaJSDelegate(options.uiDelegate)
    webView.setUIDelegate_(uiDelegate.getClassInstance())
  }

  webView.setOpaque(true)
  webView.setBackgroundColor(backgroundColor)
  webView.setMainFrameURL_(context.plugin.urlForResourceNamed(htmlName).path())

  panel.contentView().addSubview(webView)
  panel.center()
  panel.makeKeyAndOrderFront(null)

  return {
    panel: panel,
    eval: webView.stringByEvaluatingJavaScriptFromString,
    webView: webView
  }
}

WebUI.clean = function () {
  coScript.setShouldKeepAround(false)
}

module.exports = WebUI


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals NSUUID MOClassDescription NSObject NSSelectorFromString NSClassFromString */

module.exports = function (selectorHandlerDict, superclass) {
  var uniqueClassName = 'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString()

  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject)

  delegateClassDesc.registerClass()

  // Storage Handlers
  var handlers = {}

  // Define interface
  this.setHandlerForSelector = function (selectorString, func) {
    var handlerHasBeenSet = (selectorString in handlers)
    var selector = NSSelectorFromString(selectorString)

    handlers[selectorString] = func

    /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */
    if (!handlerHasBeenSet) {
      var args = []
      var regex = /:/g
      while (regex.exec(selectorString)) {
        args.push('arg' + args.length)
      }

      var dynamicFunction = eval('(function (' + args.join(', ') + ') { return handlers[selectorString].apply(this, arguments); })')

      delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction)
    }
  }

  this.removeHandlerForSelector = function (selectorString) {
    delete handlers[selectorString]
  }

  this.getHandlerForSelector = function (selectorString) {
    return handlers[selectorString]
  }

  this.getAllHandlers = function () {
    return handlers
  }

  this.getClass = function () {
    return NSClassFromString(uniqueClassName)
  }

  this.getClassInstance = function () {
    return NSClassFromString(uniqueClassName).new()
  }

  // Convenience
  if (typeof selectorHandlerDict === 'object') {
    for (var selectorString in selectorHandlerDict) {
      this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString])
    }
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (query) {
  query = query.split('?')[1]
  if (!query) { return }
  query = query.split('&').reduce(function (prev, s) {
    var res = s.split('=')
    if (res.length === 2) {
      prev[decodeURIComponent(res[0])] = decodeURIComponent(res[1])
    }
    return prev
  }, {})
  return query
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/* globals log */

var console = {
  log: log,
  warn: log,
  error: log,
  dump: function (obj) {
    log('###############################################')
    log('## Dumping object ' + obj)
    if (obj.className) {
      log('## obj class is: ' + obj.className())
    }
    log('###############################################')

    if (obj.class && obj.class().mocha) {
      log('obj.properties:')
      log(obj.class().mocha().properties())
      log('obj.propertiesWithAncestors:')
      log(obj.class().mocha().propertiesWithAncestors())

      log('obj.classMethods:')
      log(obj.class().mocha().classMethods())
      log('obj.classMethodsWithAncestors:')
      log(obj.class().mocha().classMethodsWithAncestors())

      log('obj.instanceMethods:')
      log(obj.class().mocha().instanceMethods())
      log('obj.instanceMethodsWithAncestors:')
      log(obj.class().mocha().instanceMethodsWithAncestors())

      log('obj.protocols:')
      log(obj.class().mocha().protocols())
      log('obj.protocolsWithAncestors:')
      log(obj.class().mocha().protocolsWithAncestors())
    }

    if (obj.treeAsDictionary) {
      log('obj.treeAsDictionary():')
      log(obj.treeAsDictionary())
    }
  }
}

// polyfill the global object
var commonjsGlobal = typeof global !== 'undefined'
  ? global
  : this

commonjsGlobal.console = commonjsGlobal.console || console

module.exports = console

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserPreferences = getUserPreferences;
exports.setUserPreferences = setUserPreferences;

var _sketchModuleUserPreferences = __webpack_require__(7);

var _sketchModuleUserPreferences2 = _interopRequireDefault(_sketchModuleUserPreferences);

var _sketchModuleFs = __webpack_require__(8);

var _sketchModuleFs2 = _interopRequireDefault(_sketchModuleFs);

var _common = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var keyPref = 'clickthroughHtml';
var PREFS_FILE = '.clickthroughhtmlrc';
var LOCAL_PREFS = {
  exportFolder: '.clickthroughHtml',
  exportFormat: 'png',
  exportScale: '2.0'
};
var GLOBAL_PREFS = {
  sendAnalytics: true
};

function getUserPreferences(context) {
  var localPrefs = {};
  try {
    // var path = getGitDirectory(context)
    // localPrefs = JSON.parse(fs.readFile(path + '/' + PREFS_FILE))
  } catch (e) {
    console.log(e);
  }
  return Object.assign({}, LOCAL_PREFS, _sketchModuleUserPreferences2['default'].getUserPreferences(keyPref, GLOBAL_PREFS), localPrefs);
}

function setUserPreferences(context, prefs) {
  var localPrefs = {};
  var globalPrefs = {};
  Object.keys(prefs).forEach(function (k) {
    if (Object.keys(LOCAL_PREFS).indexOf(k) !== -1) {
      localPrefs[k] = prefs[k];
    } else {
      globalPrefs[k] = prefs[k];
    }
  });

  try {
    // var path = getGitDirectory(context)
    // fs.writeFile(path + '/' + PREFS_FILE, JSON.stringify(localPrefs, null, '  '))
    // exec(context, 'git add "' + path + '/' + PREFS_FILE + '"')
  } catch (e) {
    console.log(e);
  }
  return _sketchModuleUserPreferences2['default'].setUserPreferences(keyPref, globalPrefs);
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

const SUITE_PREFIX = 'plugin.sketch.'

function isPresent (data) {
  return data != null
}

module.exports = {
  getUserPreferences: function (pluginName, defaultPrefs) {
    var prefs = {}
    var store = NSUserDefaults.alloc().initWithSuiteName(SUITE_PREFIX + pluginName)
    Object.keys(defaultPrefs).forEach(function (k) {
      if (typeof defaultPrefs[k] === 'boolean') {
        prefs[k] = isPresent(store.boolForKey(k)) ? Boolean(store.boolForKey(k)) : defaultPrefs[k]
      } else if (typeof defaultPrefs[k] === 'number') {
        prefs[k] = isPresent(store.doubleForKey(k)) ? store.boolForKey(k) : defaultPrefs[k]
      } else if (typeof defaultPrefs[k] === 'string') {
        prefs[k] = isPresent(store.boolForKey(k)) ? '' + store.stringForKey(k) : defaultPrefs[k]
      } else if (Array.isArray(defaultPrefs[k])) {
        prefs[k] = store.arrayForKey(k) || defaultPrefs[k]
      } else {
        prefs[k] = store.dictionaryForKey(k) || defaultPrefs[k]
      }
    })
    return prefs
  },
  setUserPreferences: function (pluginName, prefs) {
    var store = NSUserDefaults.alloc().initWithSuiteName(SUITE_PREFIX + pluginName)
    Object.keys(prefs).forEach(function (k) {
      if (typeof prefs[k] === 'boolean') {
        store.setBool_forKey(prefs[k], k)
      } else if (typeof prefs[k] === 'number') {
        store.setDouble_forKey(prefs[k], k)
      } else {
        store.setObject_forKey(prefs[k], k)
      }
    })
    store.synchronize()
  }
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
  mkdir: function (path) {
    var error = null
    var result = NSFileManager.defaultManager().createDirectoryAtPath_withIntermediateDirectories_attributes_error(path, true, {}, error)
    if (error != null) {
      throw new Error(error)
    }
    return result
  },

  readFile: function (path, encoding) {
    var error = null
    var result = NSString.stringWithContentsOfFile_encoding_error(path, encoding || NSUTF8StringEncoding, error)
    if (error != null) {
      throw new Error(error)
    }
    return result
  },

  writeFile: function (path, data, encoding) {
    var error = null
    var result
    if (data.TIFFRepresentation) {
      var tiffData = data.TIFFRepresentation()
      var p = NSBitmapImageRep.imageRepWithData(tiffData)
      var data = p.representationUsingType_properties(encoding || NSPNGFileType, null)
      data.writeToFile_atomically(path, true)
    } else {
      result = NSString.stringWithString(data).writeToFile_atomically_encoding_error(path, true, encoding || NSUTF8StringEncoding, error)
    }
    if (error != null) {
      throw new Error(error)
    }
    return result
  },

  rename: function (oldPath, newPath) {
    var error = null
    var result = NSFileManager.defaultManager().moveItemAtPath_toPath_error(oldPath, newPath, error)
    if (error != null) {
      throw new Error(error)
    }
    return result
  },

  rmdir: function (path) {
    var error = null
    var result = NSFileManager.defaultManager().removeItemAtPath_error(path, error)
    if (error != null) {
      throw new Error(error)
    }
    return result
  }
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getArtboards = getArtboards;
exports.executeSafely = executeSafely;
exports.exec = exec;
exports.getCurrentDirectory = getCurrentDirectory;
exports.getCurrentFileName = getCurrentFileName;
exports.createFailAlert = createFailAlert;
exports.createInput = createInput;
exports.createInputWithCheckbox = createInputWithCheckbox;
exports.createSelect = createSelect;
exports.exportArtboards = exportArtboards;
exports.TextArea = TextArea;
function getArtboards(context) {
  var sketch = context.api();
  var document = sketch.selectedDocument;
  var pages = document.pages;

  var artboards = [];

  var _loop = function _loop(i) {
    var page = pages[i];
    if (page.name == "Symbols") return 'break';

    var pageArtboards = [];

    page.iterate(function (item) {
      if (item.isArtboard) {
        var artboardName = new String(item.name).toString();
        var artboardId = new String(item.id).toString();
        pageArtboards.push({
          label: artboardName,
          value: artboardId
        });
      }
    });

    var pageName = new String(page.name).toString();
    artboards.push({
      type: 'group',
      name: pageName,
      items: pageArtboards
    });
  };

  for (var i in pages) {
    var _ret = _loop(i);

    if (_ret === 'break') break;
  }
  return artboards;
}

function executeSafely(context, func) {
  try {
    func(context);
  } catch (e) {
    sendError(context, e);
    createFailAlert(context, 'Failed...', e, true);
  }
}

function exec(context, command) {
  var task = NSTask.alloc().init();
  var pipe = NSPipe.pipe();
  var errPipe = NSPipe.pipe();

  var path = getCurrentDirectory(context);
  command = 'cd "' + String(path) + '" && ' + String(command);

  task.setLaunchPath_('/bin/bash');
  task.setArguments_(NSArray.arrayWithObjects_('-c', '-l', command, null));
  task.standardOutput = pipe;
  task.standardError = errPipe;
  task.launch();

  var errData = errPipe.fileHandleForReading().readDataToEndOfFile();
  var data = pipe.fileHandleForReading().readDataToEndOfFile();

  if (task.terminationStatus() != 0) {
    var message = 'Unknow error';
    if (errData != null && errData.length()) {
      message = NSString.alloc().initWithData_encoding_(errData, NSUTF8StringEncoding);
    } else if (data != null && data.length()) {
      message = NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding);
    }
    return NSException.raise_format_('failed', message);
  }

  return NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding);
}

function getCurrentDirectory(context) {
  return context.document.fileURL().URLByDeletingLastPathComponent().path();
}

function getCurrentFileName(context) {
  return context.document.fileURL().lastPathComponent();
}

function createFailAlert(context, title, error, buttonToReport) {
  console.log(error);
  var alert = NSAlert.alloc().init();
  alert.informativeText = '' + error;
  alert.messageText = title;
  alert.addButtonWithTitle('OK');
  if (buttonToReport) {
    alert.addButtonWithTitle('Report issue');
  }
  setIconForAlert(context, alert);

  var responseCode = alert.runModal();

  if (responseCode == 1001) {
    var errorString = error;
    if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object') {
      try {
        errorString = JSON.stringify(error, null, '\t');
        if (errorString === '{}') {
          errorString = error;
        }
      } catch (e) {}
    }
    var urlString = 'https://github.com/mathieudutour/git-sketch-plugin/issues/new?body=' + String(encodeURIComponent('### How did it happen?\n1.\n2.\n3.\n\n\n### Error log\n\n```\n' + errorString + '\n```'));
    var url = NSURL.URLWithString(urlString);
    NSWorkspace.sharedWorkspace().openURL(url);
  }

  return {
    responseCode: responseCode
  };
}

function createInput(context, msg, okLabel, cancelLabel) {
  var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50));
  var input = NSTextField.alloc().initWithFrame(NSMakeRect(0, 25, 300, 25));
  input.editable = true;
  accessory.addSubview(input);

  var alert = NSAlert.alloc().init();
  alert.setMessageText(msg);
  alert.addButtonWithTitle(okLabel || 'OK');
  alert.addButtonWithTitle(cancelLabel || 'Cancel');
  setIconForAlert(context, alert);
  alert.setAccessoryView(accessory);

  var responseCode = alert.runModal();
  var message = input.stringValue();

  return {
    responseCode: responseCode,
    message: message
  };
}

function createInputWithCheckbox(context, msg, checkboxMsg, checked, okLabel, cancelLabel) {
  var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 100));
  var input = TextArea(0, 25, 300, 75);
  var checkbox = NSButton.alloc().initWithFrame(NSMakeRect(0, 0, 300, 25));
  checkbox.setButtonType(3);
  checkbox.title = checkboxMsg;
  checkbox.state = checked ? 1 : 0;
  accessory.addSubview(input.view);
  accessory.addSubview(checkbox);

  var alert = NSAlert.alloc().init();
  alert.setMessageText(msg);
  alert.addButtonWithTitle(okLabel || 'OK');
  alert.addButtonWithTitle(cancelLabel || 'Cancel');
  setIconForAlert(context, alert);
  alert.setAccessoryView(accessory);

  var responseCode = alert.runModal();
  var message = input.getValue();

  return {
    responseCode: responseCode,
    message: message,
    checked: checkbox.state() == 1
  };
}

function createSelect(context, msg, items, selectedItemIndex, okLabel, cancelLabel) {
  selectedItemIndex = selectedItemIndex || 0;

  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 200, 25));
  accessory.addItemsWithObjectValues(items);
  accessory.selectItemAtIndex(selectedItemIndex);

  var alert = NSAlert.alloc().init();
  alert.setMessageText(msg);
  alert.addButtonWithTitle(okLabel || 'OK');
  alert.addButtonWithTitle(cancelLabel || 'Cancel');
  setIconForAlert(context, alert);
  alert.setAccessoryView(accessory);

  var responseCode = alert.runModal();
  var sel = accessory.indexOfSelectedItem();

  return {
    responseCode: responseCode,
    index: sel
  };
}

function exportArtboards(context, prefs) {
  var currentFileName = getCurrentFileName(context);
  var path = getCurrentDirectory(context);
  var currentFileNameWithoutExtension = currentFileName.replace(/\.sketch$/, '');
  var exportFolder = prefs.exportFolder,
      exportFormat = prefs.exportFormat,
      exportScale = prefs.exportScale,
      includeOverviewFile = prefs.includeOverviewFile;

  var pluginPath = context.scriptPath.replace(/\/Contents\/Sketch\/(\w*)\.js$/, '').replace(/ /g, '\\ ');
  var bundlePath = NSBundle.mainBundle().bundlePath();
  var fileFolder = exportFolder + '/' + currentFileNameWithoutExtension;
  var command = String(pluginPath) + '/exportArtboard.sh "' + String(path) + '" "' + String(exportFolder) + '" "' + fileFolder + '" "' + String(bundlePath) + '" "' + String(currentFileName) + '" "' + String(exportFormat || 'png') + '" "' + String(exportScale) + '" "' + String(includeOverviewFile) + '"';
  return exec(context, command);
}

function TextArea(x, y, width, heigh) {
  var scrollView = NSScrollView.alloc().initWithFrame(NSMakeRect(x, y, width, heigh));
  scrollView.borderStyle = NSLineBorder;
  var contentSize = scrollView.contentSize();
  var input = NSTextView.alloc().initWithFrame(NSMakeRect(0, 0, contentSize.width, contentSize.height));
  input.minSize = NSMakeSize(0, contentSize.height);
  input.maxSize = NSMakeSize(contentSize.width, Infinity);
  scrollView.documentView = input;
  return {
    view: scrollView,
    getValue: function () {
      function getValue() {
        return input.string();
      }

      return getValue;
    }()
  };
}

/**
    Export artboards and fixed layers
    Scale set to 2 for retina displays 
  

  export function exportLayerToPath(doc, layer, path) {
    var frame = layer.frame
    var slice_name = layer.name
  
    var copy = layer.duplicate()
    var rect = copy.absoluteRect().rect()
    var request = MSExportRequest.new()
    request.rect = rect
    request.scale = 2
    copy.remove()
    
    doc.saveArtboardOrSlice_toFile(request, path)
  }
  
  
  
  /**
      Export html files
    
  
  export function createFolder(name) {
    var fileManager = [NSFileManager defaultManager];
    [fileManager createDirectoryAtPath:name withIntermediateDirectories:true attributes:nil error:nil];
  }
  
  
  export function saveTextToFile (filename, text) {
    var path = [@"" stringByAppendingString:filename];
    var str = [@"" stringByAppendingString:text];
    str.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(path, true);
  }
  
  export function fileSaver() {
    // Panel
    var openPanel = [NSOpenPanel openPanel]
  
    [openPanel setTitle: "Choose a location…"];
    [openPanel setPrompt: "Export"];
  
    [openPanel setCanCreateDirectories: true]
    [openPanel setCanChooseFiles: false]
    [openPanel setCanChooseDirectories: true]
    [openPanel setAllowsMultipleSelection: false]
    [openPanel setShowsHiddenFiles: false]
    [openPanel setExtensionHidden: false]
  
    var openPanelButtonPressed = [openPanel runModal]
    if (openPanelButtonPressed == NSFileHandlingPanelOKButton) {
      allowedUrl = [openPanel URL]
    }
    return allowedUrl
  }
  
  
  
  /**
      Display a message about broken links  
    
  
  export function displayMissingArtboardsWarnings (sketch, targets, artboards) {
    var warnings = '';
    targets.sort();
    for (var i = 0; i < targets.length; i++) {
      var target = targets[i];
      if (artboards.indexOf(target) === -1) {
        warnings += '\n ' + target
      };
    };
  
    if (warnings !== '') {
      warnings += '\n\nThe prototype will be exported anyway.';
      sketch.alert(warnings, "Links to missing artboards:");
    }
  }
  
  
  
  /**
      Return list of artboards in the current page  
      Return false if layer is not nested within an artboard
    
  
  export function getArtboardsList (doc) {
    var artboards = (doc.sketchObject).currentPage().artboards().objectEnumerator();
  
    var artboardsList = [];
  
    while (artboard = artboards.nextObject()) {
      var artboardName = artboard.name().trim();
      artboardsList.push(artboardName);
    }
  
    return artboardsList;
  }
  
  
  /**
      Open folder  
    
  
  export function openFolder (path) {
    var folderPath = [@"" stringByAppendingString:path];
    [[NSWorkspace sharedWorkspace]openFile:folderPath withApplication:@"Finder"]
  }
  
  
  /**
      Get the artboard ID of a selected layer  
    
  
  export function getParentArtboardId (object) {
    if (object.isKindOfClass(MSArtboardGroup)) {
      return (object.objectID())
    } else if (object.parentGroup() != null) {
      return getParentArtboardId(object.parentGroup())
    } else {
      return null
    }
  }
  
  
  
  /**
      If any parent layer is fixed, the layer has to be fixed too  
    
  
  export function getPosition (layer, artboardConfig) {
    
    var object = layer.sketchObject
    
    while(!(object.isKindOfClass(MSArtboardGroup))) {
      var objId = object.objectID();
      if(artboardConfig[objId] && 'fix' in artboardConfig[objId]) {
        return artboardConfig[objId]['fix']
      } else {
        object = object.parentGroup()
      }
    }
  
    return false
  }
  
  
  
  /**
    Set the new config text   
    
  
  export function setConfig (page, config) {
  
    var configStr = JSON.stringify(config)
  
    page.iterate(function(item) { 
      if (item.name == htmlConfigName) { 
        item.iterate(function(layer) {
          layer.text = configStr
        });
      }
    });
  }
  
  
  
  /**
    Return config object if it exists
    Create a new layer if it doesn't    
    
  
  function getConfigObject (sketch, page) {
    var config = {}
    var configStr
    var configExists = false
  
    page.iterate(function(item) { 
      if (item.name == htmlConfigName) { 
        configExists = true
        item.iterate(function(layer) {
          configStr = layer.text
        });
      }
    });
  
    if (configExists) {
      config = JSON.parse(configStr)
    } else {     
      var groupLayer = page.newGroup({frame: new sketch.Rectangle(-10000, -10000, 100, 100), name: htmlConfigName})
      var textLayer = groupLayer.newText({text:"{}", name: htmlConfigName})
      groupLayer.moveToBack()
      groupLayer.deselect()
    }
  
    return config
  }
  
  
  /**
    Remove config text    
    
  
  function removeConfigText (sketch, page) {
    var config = {}
    var configStr
  
    page.iterate(function(item) { 
      if (item.name == htmlConfigName) { 
        item.remove()
      }
    });
  }

  */
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = run.bind(this, 'default')
