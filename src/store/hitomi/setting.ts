import { persistentMap } from "@nanostores/persistent";
import { map } from "nanostores";

export type RawSetting = {
  filter: "true" | "false";
};

export interface Setting {
  filter: boolean;
}

export const $rawSetting = persistentMap<RawSetting>("hitomi:settings:", {
  filter: "true",
});

export const $setting = map<Setting>(rawSettingToSetting($rawSetting.get()));

$setting.listen((value) => {
  $rawSetting.set(settingToRawSetting(value));
});

function rawSettingToSetting(raw: RawSetting): Setting {
  return {
    filter: raw.filter == "true" ? true : false,
  };
}

function settingToRawSetting(setting: Setting): RawSetting {
  return {
    filter: setting.filter ? "true" : "false",
  };
}
