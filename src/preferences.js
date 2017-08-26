import prefsManager from 'sketch-module-user-preferences'
import fs from 'sketch-module-fs'
import { exec } from './common'

const keyPref = 'sketchToHtml'
const PREFS_FILE = '.sketchtohtmlrc'
const LOCAL_PREFS = {
  exportFolder: '.exportedArtboards',
  exportFormat: 'png',
  exportScale: '2.0'
}
const GLOBAL_PREFS = {
  sendAnalytics: true
}

export function getUserPreferences (context) {
  console.log('anyone threr?!');
}

export function setUserPreferences (context, prefs) {
 
}