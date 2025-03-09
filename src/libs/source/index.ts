import { TwiVideosNetProvider } from "./twi-videos";
import { TwiVideoNetProvider } from "./twivideo";
import { TwiDougaNetProvider } from "./twidouga";
import { UraakaListComProvider } from "./uraakalist";

export const Providers = {
  TwiVideosNetProvider,
  TwiVideoNetProvider,
  TwiDougaNetProvider,
  UraakaListComProvider,
};

export interface Constructor<T> {
  new (...args: any[]): T;
}
