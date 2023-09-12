import { persistentMap } from "@nanostores/persistent";
import { map } from "nanostores";

export type RawSetting = {
  autoPlay: "true" | "false";
  loop: "true" | "false";
};

export interface Setting {
  autoPlay: boolean;
  loop: boolean;
}

export const $rawSetting = persistentMap<RawSetting>("twitter:settings:", {
  autoPlay: "true",
  loop: "false",
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
  };
}

function settingToRawSetting(setting: Setting): RawSetting {
  return {
    autoPlay: setting.autoPlay ? "true" : "false",
    loop: setting.loop ? "true" : "false",
  };
}
