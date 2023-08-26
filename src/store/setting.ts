import { map } from "nanostores";

export interface Setting {
  censored: boolean;
}

export const $setting = map<Setting>({
  censored: import.meta.env.PUBLIC_SCHOOL == "1",
});
