AppSandbox = function(){ }
AppSandbox.prototype.authorize = function(path, callback){
  log("AppSandbox.authorize("+path+")")
  var success = true

  // [allowedUrl startAccessingSecurityScopedResource]
  callback.call(this,success)
  // [allowedUrl stopAccessingSecurityScopedResource]
}
AppSandbox.prototype.key_for_url = function(url){
  return "bd_" + [url absoluteString]
}
AppSandbox.prototype.clear_key = function(key){
  var def = [NSUserDefaults standardUserDefaults]
  [def setObject:nil forKey:key]
}
AppSandbox.prototype.file_picker = function(url) {
  // Panel
  var openPanel = [NSOpenPanel openPanel]

  [openPanel setTitle:"Sketch Authorization"]
  [openPanel setMessage:"Due to Apple's Sandboxing technology, Sketch needs your permission to write to this folder."];
  [openPanel setPrompt:"Authorize"];

  [openPanel setCanCreateDirectories:false]
  [openPanel setCanChooseFiles:true]
  [openPanel setCanChooseDirectories:true]
  [openPanel setAllowsMultipleSelection:false]
  [openPanel setShowsHiddenFiles:false]
  [openPanel setExtensionHidden:false]

  [openPanel setDirectoryURL:url]

  var openPanelButtonPressed = [openPanel runModal]
  if (openPanelButtonPressed == NSFileHandlingPanelOKButton) {
    allowedUrl = [openPanel URL]
  }
  return allowedUrl
}

AppSandbox.prototype.get_data_for_key = function(key){
  var def = [NSUserDefaults standardUserDefaults]
  return [def objectForKey:key]
}

AppSandbox.prototype.set_data_for_key = function(data,key){
  var defaults = [NSUserDefaults standardUserDefaults],
      default_values = [NSMutableDictionary dictionary]

  [default_values setObject:data forKey:key]
  [defaults registerDefaults:default_values]
}