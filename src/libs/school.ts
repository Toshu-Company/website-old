import { $setting } from "../store/setting";

export function isSchool() {
  return $setting.get().censored;
}
