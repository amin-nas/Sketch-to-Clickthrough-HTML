


export function getArtboards (context) {
  const sketch = context.api()
  const document = sketch.selectedDocument
  const pages = document.pages

  const artboards = []
  
  for (let i in pages) {
    let page = pages[i]
    if(page.name == "Symbols") break

    let pageArtboards = []

    page.iterate(function(item) {  
      if(item.isArtboard) {
        let artboardName = new String(item.name).toString()
        let artboardId = new String(item.id).toString()
        pageArtboards.push({
          label: artboardName,
          value: artboardId
        })
      }
    })

    let pageName = new String(page.name).toString()
    artboards.push({
      type: 'group', 
      name: pageName,
      items: pageArtboards
    })
  }
  return artboards
}


export function executeSafely (context, func) {
  try {
    func(context)
  } catch (e) {
    sendError(context, e)
    createFailAlert(context, 'Failed...', e, true)
  }
}

export function exec (context, command) {
  var task = NSTask.alloc().init()
  var pipe = NSPipe.pipe()
  var errPipe = NSPipe.pipe()

  var path = getCurrentDirectory(context)
  command = `cd "${path}" && ${command}`

  task.setLaunchPath_('/bin/bash')
  task.setArguments_(NSArray.arrayWithObjects_('-c', '-l', command, null))
  task.standardOutput = pipe
  task.standardError = errPipe
  task.launch()

  const errData = errPipe.fileHandleForReading().readDataToEndOfFile()
  const data = pipe.fileHandleForReading().readDataToEndOfFile()

  if (task.terminationStatus() != 0) {
    let message = 'Unknow error'
    if (errData != null && errData.length()) {
      message = NSString.alloc().initWithData_encoding_(errData, NSUTF8StringEncoding)
    } else if (data != null && data.length()) {
      message = NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding)
    }
    return NSException.raise_format_('failed', message)
  }

  return NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding)
}

export function getCurrentDirectory (context) {
  return context.document.fileURL().URLByDeletingLastPathComponent().path()
}

export function getCurrentFileName (context) {
  return context.document.fileURL().lastPathComponent()
}

export function createFailAlert (context, title, error, buttonToReport) {
  console.log(error)
  var alert = NSAlert.alloc().init()
  alert.informativeText = '' + error
  alert.messageText = title
  alert.addButtonWithTitle('OK')
  if (buttonToReport) {
    alert.addButtonWithTitle('Report issue')
  }
  setIconForAlert(context, alert)

  var responseCode = alert.runModal()

  if (responseCode == 1001) {
    var errorString = error
    if (typeof error === 'object') {
      try {
        errorString = JSON.stringify(error, null, '\t')
        if (errorString === '{}') {
          errorString = error
        }
      } catch (e) {}
    }
    var urlString = `https://github.com/mathieudutour/git-sketch-plugin/issues/new?body=${encodeURIComponent('### How did it happen?\n1.\n2.\n3.\n\n\n### Error log\n\n```\n' + errorString + '\n```')}`
    var url = NSURL.URLWithString(urlString)
    NSWorkspace.sharedWorkspace().openURL(url)
  }

  return {
    responseCode
  }
}

export function createInput (context, msg, okLabel, cancelLabel) {
  var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50))
  var input = NSTextField.alloc().initWithFrame(NSMakeRect(0, 25, 300, 25))
  input.editable = true
  accessory.addSubview(input)

  var alert = NSAlert.alloc().init()
  alert.setMessageText(msg)
  alert.addButtonWithTitle(okLabel || 'OK')
  alert.addButtonWithTitle(cancelLabel || 'Cancel')
  setIconForAlert(context, alert)
  alert.setAccessoryView(accessory)

  var responseCode = alert.runModal()
  var message = input.stringValue()

  return {
    responseCode: responseCode,
    message: message
  }
}

export function createInputWithCheckbox (context, msg, checkboxMsg, checked, okLabel, cancelLabel) {
  var accessory = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 100))
  var input = TextArea(0, 25, 300, 75)
  var checkbox = NSButton.alloc().initWithFrame(NSMakeRect(0, 0, 300, 25))
  checkbox.setButtonType(3)
  checkbox.title = checkboxMsg
  checkbox.state = checked ? 1 : 0
  accessory.addSubview(input.view)
  accessory.addSubview(checkbox)

  var alert = NSAlert.alloc().init()
  alert.setMessageText(msg)
  alert.addButtonWithTitle(okLabel || 'OK')
  alert.addButtonWithTitle(cancelLabel || 'Cancel')
  setIconForAlert(context, alert)
  alert.setAccessoryView(accessory)

  var responseCode = alert.runModal()
  var message = input.getValue()

  return {
    responseCode: responseCode,
    message: message,
    checked: checkbox.state() == 1
  }
}

export function createSelect (context, msg, items, selectedItemIndex, okLabel, cancelLabel) {
  selectedItemIndex = selectedItemIndex || 0

  var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 200, 25))
  accessory.addItemsWithObjectValues(items)
  accessory.selectItemAtIndex(selectedItemIndex)

  var alert = NSAlert.alloc().init()
  alert.setMessageText(msg)
  alert.addButtonWithTitle(okLabel || 'OK')
  alert.addButtonWithTitle(cancelLabel || 'Cancel')
  setIconForAlert(context, alert)
  alert.setAccessoryView(accessory)

  var responseCode = alert.runModal()
  var sel = accessory.indexOfSelectedItem()

  return {
    responseCode: responseCode,
    index: sel
  }
}

export function exportArtboards (context, prefs) {
  const currentFileName = getCurrentFileName(context)
  const path = getCurrentDirectory(context)
  const currentFileNameWithoutExtension = currentFileName.replace(/\.sketch$/, '')
  const {exportFolder, exportFormat, exportScale, includeOverviewFile} = prefs
  const pluginPath = context.scriptPath.replace(/\/Contents\/Sketch\/(\w*)\.js$/, '').replace(/ /g, '\\ ')
  const bundlePath = NSBundle.mainBundle().bundlePath()
  const fileFolder = exportFolder + '/' + currentFileNameWithoutExtension
  const command = `${pluginPath}/exportArtboard.sh "${path}" "${exportFolder}" "${fileFolder}" "${bundlePath}" "${currentFileName}" "${exportFormat || 'png'}" "${exportScale}" "${includeOverviewFile}"`
  return exec(context, command)
}

export function TextArea (x, y, width, heigh) {
  const scrollView = NSScrollView.alloc().initWithFrame(NSMakeRect(x, y, width, heigh))
  scrollView.borderStyle = NSLineBorder
  const contentSize = scrollView.contentSize()
  const input = NSTextView.alloc().initWithFrame(NSMakeRect(0, 0, contentSize.width, contentSize.height))
  input.minSize = NSMakeSize(0, contentSize.height)
  input.maxSize = NSMakeSize(contentSize.width, Infinity)
  scrollView.documentView = input
  return {
    view: scrollView,
    getValue: () => input.string()
  }
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