import { persistentMap } from "@nanostores/persistent";
import { map } from "nanostores";

export type RawSetting = {
  thumbnail: "true" | "false";
};

export interface Setting {
  thumbnail: boolean;
}

export const $rawSetting = persistentMap<RawSetting>("lover:settings:", {
  thumbnail: "true",
});

export const $setting = map<Setting>(rawSettingToSetting($rawSetting.get()));
export const setting = $setting;

$setting.listen((value) => {
  $rawSetting.set(settingToRawSetting(value));
});

function rawSettingToSetting(raw: RawSetting): Setting {
  return {
    thumbnail: raw.thumbnail == "true" ? true : false,
  };
}

function settingToRawSetting(setting: Setting): RawSetting {
  return {
    thumbnail: setting.thumbnail ? "true" : "false",
  };
}
