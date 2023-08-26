import { persistentMap } from "@nanostores/persistent";
import { map } from "nanostores";

export type RawSetting = {
  censored: "true" | "false";
};

export interface Setting {
  censored: boolean;
}

export const $rawSetting = persistentMap<RawSetting>("settings:", {
  censored: import.meta.env.PUBLIC_SCHOOL == "1" ? "true" : "false",
});

export const $setting = map<Setting>(rawSettingToSetting($rawSetting.get()));

$setting.listen((value) => {
  $rawSetting.set(settingToRawSetting(value));
});

function rawSettingToSetting(raw: RawSetting): Setting {
  return {
    censored: raw.censored == "true" ? true : false,
  };
}

function settingToRawSetting(setting: Setting): RawSetting {
  return {
    censored: setting.censored ? "true" : "false",
  };
}
