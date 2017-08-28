import prefsManager from 'sketch-module-user-preferences'
import fs from 'sketch-module-fs'
import { exec } from './common'

const keyPref = 'clickthroughHtml'
const PREFS_FILE = '.clickthroughhtmlrc'
const LOCAL_PREFS = {
  exportFolder: '.clickthroughHtml',
  exportFormat: 'png',
  exportScale: '2.0'
}
const GLOBAL_PREFS = {
  sendAnalytics: true
}

export function getUserPreferences (context) {
  let localPrefs = {}
  try {
    // var path = getGitDirectory(context)
    // localPrefs = JSON.parse(fs.readFile(path + '/' + PREFS_FILE))
  } catch (e) {
    console.log(e)
  }
  return Object.assign(
    {},
    LOCAL_PREFS,
    prefsManager.getUserPreferences(keyPref, GLOBAL_PREFS),
    localPrefs
  )
}

export function setUserPreferences (context, prefs) {
  const localPrefs = {}
  const globalPrefs = {}
  Object.keys(prefs).forEach(k => {
    if (Object.keys(LOCAL_PREFS).indexOf(k) !== -1) {
      localPrefs[k] = prefs[k]
    } else {
      globalPrefs[k] = prefs[k]
    }
  })

  try {
    // var path = getGitDirectory(context)
    // fs.writeFile(path + '/' + PREFS_FILE, JSON.stringify(localPrefs, null, '  '))
    // exec(context, 'git add "' + path + '/' + PREFS_FILE + '"')
  } catch (e) {
    console.log(e)
  }
  return prefsManager.setUserPreferences(keyPref, globalPrefs)
}