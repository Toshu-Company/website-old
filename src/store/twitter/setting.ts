import { persistentMap } from "@nanostores/persistent";
import { map } from "nanostores";

export type RawSetting = {
  censored: "true" | "false";
  autoPlay: "true" | "false";
  loop: "true" | "false";
};

export interface Setting {
  censored: boolean;
  autoPlay: boolean;
  loop: boolean;
}

export const $rawSetting = persistentMap<RawSetting>("settings:", {
  censored: import.meta.env.PUBLIC_SCHOOL == "1" ? "true" : "false",
  autoPlay: "true",
  loop: "false",
});

export const $setting = map<Setting>(rawSettingToSetting($rawSetting.get()));

$setting.listen((value) => {
  $rawSetting.set(settingToRawSetting(value));
});

function rawSettingToSetting(raw: RawSetting): Setting {
  return {
    censored: raw.censored == "true" ? true : false,
    autoPlay: raw.autoPlay == "true" ? true : false,
    loop: raw.loop == "true" ? true : false,
  };
}

function settingToRawSetting(setting: Setting): RawSetting {
  return {
    censored: setting.censored ? "true" : "false",
    autoPlay: setting.autoPlay ? "true" : "false",
    loop: setting.loop ? "true" : "false",
  };
}
