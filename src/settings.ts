export interface Settings {

}

let defaultSettings = {

};

export function createSettings(settings?: Settings): Settings {
  return Object.assign(defaultSettings, settings || {});
}
