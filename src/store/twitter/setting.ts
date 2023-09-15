import { persistentMap } from "@nanostores/persistent";
import { map } from "nanostores";

export interface RawSetting extends Record<string, string> {
  autoPlay: "true" | "false";
  loop: "true" | "false";
  mute: "true" | "false";
}

export interface Setting {
  autoPlay: boolean;
  loop: boolean;
  mute: boolean;
}

export const SETTING_INFO = {
  autoPlay: {
    label: "自動再生",
    description: "ツイートを自動で再生するかどうか",
    type: "toggle",
  },
};

export const $rawSetting = persistentMap<RawSetting>("twitter:settings:", {
  autoPlay: "true",
  loop: "false",
  mute: "false",
});

export const $setting = map<Setting>(rawSettingToSetting($rawSetting.get()));
export const setting = $setting;

$setting.listen((value) => {
  $rawSetting.set(settingToRawSetting(value));
});

function rawSettingToSetting(raw: RawSetting): Setting {
  return {
    autoPlay: raw.autoPlay == "true" ? true : false,
    loop: raw.loop == "true" ? true : false,
    mute: raw.mute == "true" ? true : false,
  };
}

function settingToRawSetting(setting: Setting): RawSetting {
  return {
    autoPlay: setting.autoPlay ? "true" : "false",
    loop: setting.loop ? "true" : "false",
    mute: setting.mute ? "true" : "false",
  };
}
