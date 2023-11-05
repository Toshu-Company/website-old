import { persistentMap } from "@nanostores/persistent";
import { map } from "nanostores";

export type RawSetting = {
  censored: "true" | "false";
  nocache: "true" | "false";
};

export interface Setting {
  censored: boolean;
  nocache: boolean;
}

export const $rawSetting = persistentMap<RawSetting>("settings:", {
  censored: import.meta.env.PUBLIC_SCHOOL == "1" ? "true" : "false",
  nocache: "false",
});

export const $setting = map<Setting>(rawSettingToSetting($rawSetting.get()));
export const setting = $setting;

$setting.listen((value) => {
  $rawSetting.set(settingToRawSetting(value));
});

function rawSettingToSetting(raw: RawSetting): Setting {
  return {
    censored: raw.censored == "true" ? true : false,
    nocache: raw.nocache == "true" ? true : false,
  };
}

function settingToRawSetting(setting: Setting): RawSetting {
  return {
    censored: setting.censored ? "true" : "false",
    nocache: setting.nocache ? "true" : "false",
  };
}
