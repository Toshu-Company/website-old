import { TwiVideosNetProvider } from "./twi-videos";
import { TwiVideoNetProvider } from "./twivideo";
import { UraakaListComProvider } from "./uraakalist";

export const Providers = {
  TwiVideosNetProvider,
  TwiVideoNetProvider,
  UraakaListComProvider,
};

export interface Constructor<T> {
  new (...args: any[]): T;
}
