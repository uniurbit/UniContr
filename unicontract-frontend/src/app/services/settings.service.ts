import { Injectable } from '@angular/core';


@Injectable()
export class SettingsService {

  private static settingsValues: {} = {
    'LANGUAGE': ['it'],
    'THEME': ['light', 'dark'],    
  };

  public getsettingsValues() {
    return SettingsService.settingsValues;
  }

  private settingsObject = {}; // store settings of a session if localStorage is not available

  public initSettingsObject() {
    // create settings object to store settings for session if localStorage is not available
    // settingsObject serves also as a fallback before the user sets any personal settings
    for (const key of Object.keys(SettingsService.settingsValues)) {
      this.settingsObject[key] = SettingsService.settingsValues[key][0];
    }    
  }

  constructor() {
    this.initSettingsObject();
  }

  public getSetting(key: string): string {
    
    if (!this.isValidKey(key)) {
      console.log('settings-service.getForecastSetting() key is invalid: ' + key);
      return null;
    }
    
    if ((typeof(Storage) !== 'undefined') && localStorage.getItem(key)) {
      let value =  localStorage.getItem(key);
      if (this.isValidSetting(key,value)){
        return value;
      }    
    } 

    return this.settingsObject[key];    
  }

  public setSetting(key: string, value: string) {
    
    if (!this.isValidSetting(key, value)) {
      console.log('settings-service: {' + key + ': ' + value + '} setting was incorrect');
      return;
    }

    if ((typeof(Storage) !== 'undefined')) {
      localStorage.setItem(key, value);
    } else {
      this.settingsObject[key] = value;
    }
  }

  public isValidSetting(key: string, value: string) {
    if (SettingsService.settingsValues.hasOwnProperty(key) &&
        SettingsService.settingsValues[key].includes(value)) {
          return true;
        } else {
          return false;
        }
  }

  public isValidKey(key: string) {
    if (SettingsService.settingsValues.hasOwnProperty(key)) {
          return true;
        } else {
          return false;
        }    
  }

}
